// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import type { Node as ReactNode } from 'react';

import {
  requestElevator,
  joinGroupWaitingForElevator,
  enterElevator,
  personCeasesToExist,
} from '../../actions';
import {
  ELEVATOR_SHAFT_WIDTH,
  PERSON_ZINDEX_MIN,
  PERSON_ZINDEX_MAX,
} from '../../constants';
import { getPersonElevatorPositionOffset } from '../Elevator/Elevator.helpers';
import { getElevatorRequestsArray } from '../../reducers/elevator-requests.reducer';
import {
  getPeopleOnElevator,
  getPeopleDisembarkedOnFloor,
} from '../../reducers/people.reducer';

import { getButtonToPress, getDirection } from './PersonController.helpers';

import type {
  ActionCreator,
  ElevatorDirection,
  PersonStatus,
} from '../../types';

type Props = {
  // Person attributes
  id: string,
  status: PersonStatus,
  size: number,
  walkSpeed: number,
  floorId?: number,
  elevatorId?: number,
  destinationFloorId: number,
  direction?: ElevatorDirection,
  positionWithinElevator?: number,
  waitStart?: Date,
  rideStart?: Date,
  rideEnd?: Date,

  // HTML element references, for when the person needs to move relative to
  // something in the DOM
  floorRef?: HTMLElement,
  elevatorRef?: HTMLElement,
  elevatorButtonRef?: HTMLElement,

  // Various environment statuses
  isFloorAlreadyRequested: boolean,
  numberOfFolksAlreadyWaiting: number,
  numberOfFolksAlreadyOnElevator: number,
  numberOfFolksAlreadyOnFloor: number,

  // Actions
  requestElevator: ActionCreator,
  joinGroupWaitingForElevator: ActionCreator,
  enterElevator: ActionCreator,
  personCeasesToExist: ActionCreator,

  // Uses function-as-children to pass data down to the underlying Person
  children: (data: {
    isWalking: boolean,
    isGhost: boolean,
    armPokeTarget: ?HTMLElement,
    handleElevatorRequest: () => void,
  }) => ReactNode,
};

type State = {
  // The person's current X offset from the left of the parent container
  currentX: number,
  // The person's ideal X offset from the left of the parent container.
  // When destinationX !== currentX, it means this person is on the move.
  destinationX: number,
  // Once the person makes it to their destination floor, they start fading
  // away. 😢
  isGhost: boolean,
  // If the person needs to poke something (like an elevator request button),
  // it can be stored here and passed down to the Person, who'll know what to
  // do with it.
  armPokeTarget: ?HTMLElement,
  // When we arrive at the destination floor, we need to manually set the
  // z-indices, so that the first one off is the top of the stack, not the
  // bottom.
  zIndex: number,
};

class PersonController extends PureComponent<Props, State> {
  state = {
    currentX: 100, // TEMP
    destinationX: 100, // TEMP
    isGhost: false,
    armPokeTarget: null,
    zIndex: PERSON_ZINDEX_MIN,
  };

  animationFrameId: number;
  nonCriticalTimeoutId: number;

  componentDidMount() {
    const { size, elevatorButtonRef } = this.props;

    if (!elevatorButtonRef) {
      throw new Error('Person needs to mount with an ElevatorButtonRef');
    }

    // When a person mounts, their first order of business is to march towards
    // the elevator buttons on their floor.
    const [firstButton] = elevatorButtonRef.children;
    const buttonPosition = firstButton.getBoundingClientRect();
    const destinationX = buttonPosition.left + buttonPosition.width / 2 - size;

    this.setState({ destinationX });
  }

  componentWillReceiveProps(nextProps) {
    // Every time the person's status changes, they need to perform an action.
    if (this.props.status !== nextProps.status) {
      this.handleStatusChange(nextProps);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.destinationX !== this.state.destinationX) {
      window.cancelAnimationFrame(this.animationFrameId);

      this.moveTowardsDestinationX();
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameId);
    window.clearTimeout(this.nonCriticalTimeoutId);
  }

  handleStatusChange = (nextProps: Props) => {
    const {
      status,
      size,
      positionWithinElevator,
      elevatorRef,
      numberOfFolksAlreadyWaiting,
      numberOfFolksAlreadyOnFloor,
    } = nextProps;

    switch (status) {
      case 'waiting-for-elevator': {
        // If we're waiting for the elevator, we want to form a neat orderly
        // line beside the elevator, with everyone else who has requested it.
        const offsetAmount = numberOfFolksAlreadyWaiting * 15;

        // We also don't want to IMMEDIATELY waddle away after pressing the
        // button; we want to wait a short amount of time.
        // That said, if the elevator arrives in that gap, we don't need to go
        // join the line, we can just file in. So, we'll cancel this timer if
        // it stops being important.
        this.nonCriticalTimeoutId = window.setTimeout(() => {
          this.setState(state => ({
            destinationX: state.destinationX - offsetAmount,
          }));
        }, 250);

        return;
      }

      case 'boarding-elevator': {
        if (!elevatorRef) {
          throw new Error('Elevator ref needed when boarding');
        }

        // march our little fella towards the center of the elevator doors
        const elevatorBox = elevatorRef.getBoundingClientRect();

        const offsetAmount =
          elevatorBox.left + elevatorBox.width / 2 - size / 2;

        this.setState({
          destinationX: offsetAmount,
        });

        return;
      }

      case 'riding-elevator': {
        if (typeof positionWithinElevator === 'undefined') {
          throw new Error('Elevator position needed while riding');
        }

        // Center the person within the elevator. This will be their NEW origin,
        // so that their on-screen position doesn't change.
        const originX = ELEVATOR_SHAFT_WIDTH / 2 - size / 2;

        // We want them to fill one of 3 pre-arranged elevator spots, based on
        // their `positionWithinElevator`, which is an enum of -1, 0, 1.
        const destinationX =
          originX + getPersonElevatorPositionOffset(positionWithinElevator);

        this.setState({
          currentX: originX,
          destinationX,
        });

        return;
      }

      case 'disembarking-elevator': {
        if (!elevatorRef || typeof positionWithinElevator === 'undefined') {
          throw new Error('Elevator data needed when arriving at destination');
        }

        // We need to do the opposite of the boarding->riding transition, and
        // move this fella from the elevator DOM container to the new floor.
        const elevatorBox = elevatorRef.getBoundingClientRect();

        const centerOfElevator =
          elevatorBox.left + ELEVATOR_SHAFT_WIDTH / 2 - size / 2;

        const elevatorPositionOffset = getPersonElevatorPositionOffset(
          positionWithinElevator
        );

        const originX = centerOfElevator + elevatorPositionOffset;

        this.setState({
          currentX: originX,
          destinationX: 0,
          isGhost: true,
          zIndex: PERSON_ZINDEX_MAX - numberOfFolksAlreadyOnFloor,
        });

        return;
      }

      default: {
        return;
      }
    }
  };

  moveTowardsDestinationX = () => {
    const { currentX, destinationX } = this.state;
    const { status, walkSpeed, isFloorAlreadyRequested } = this.props;

    const distanceToDestination = Math.abs(currentX - destinationX);

    // If we're in the process of walking towards the elevator request button,
    // and someone else gets there first and presses the button, we can
    // just join the group, and move into the queue.
    if (status === 'initialized' && isFloorAlreadyRequested) {
      this.finishWalking();
      return;
    }

    // If we're _almost_ at our destination (we'll get there in the next tick),
    // we can skip a bunch of stuff and just teleport there.
    if (distanceToDestination <= walkSpeed) {
      this.setState({ currentX: destinationX });

      this.finishWalking();

      return;
    }

    const direction = destinationX < currentX ? 'left' : 'right';

    const offsetAmount = direction === 'right' ? walkSpeed : -walkSpeed;

    this.setState(
      state => ({
        currentX: state.currentX + offsetAmount,
      }),
      () => {
        this.animationFrameId = window.requestAnimationFrame(
          this.moveTowardsDestinationX
        );
      }
    );
  };

  finishWalking = () => {
    const {
      id,
      status,
      floorId,
      elevatorId,
      destinationFloorId,
      waitStart,
      rideStart,
      rideEnd,
      elevatorButtonRef,
      isFloorAlreadyRequested,
      numberOfFolksAlreadyOnElevator,
      joinGroupWaitingForElevator,
      enterElevator,
      personCeasesToExist,
    } = this.props;

    switch (status) {
      case 'initialized': {
        if (typeof floorId === 'undefined' || !elevatorButtonRef) {
          throw new Error('Please provide floor and refs');
        }

        // We need to hit the right elevator button, and then fire off the
        // elevator request action.

        // It's possible, though, that someone previously already requested
        // the elevator going in the same direction on this floor. If so,
        // we want to join the group

        if (isFloorAlreadyRequested) {
          joinGroupWaitingForElevator({
            floorId: floorId,
            personId: id,
            direction: getDirection(floorId, destinationFloorId),
          });

          return;
        }

        const armPokeTarget = getButtonToPress({
          buttons: elevatorButtonRef.children,
          floorId,
          destinationFloorId,
        });

        this.setState({ armPokeTarget });

        return;
      }

      case 'boarding-elevator': {
        enterElevator({
          personId: id,
          elevatorId,
          destinationFloorId,
          numberOfFolksAlreadyOnElevator,
        });

        return;
      }

      case 'disembarking-elevator': {
        // This person will be deleted from our state; they're a big bag of
        // memory that we don't need anymore. That said, we do want to preserve
        // their wait/ride time stats, so that we can analyze current
        // performance
        personCeasesToExist({ personId: id, waitStart, rideStart, rideEnd });

        return;
      }

      default:
        break;
    }
  };

  handleElevatorRequest = () => {
    const { floorId, destinationFloorId, requestElevator } = this.props;

    // It makes no sense for `floorId` to be undefined at this point, but
    // Flow doesn't know that.
    if (typeof floorId === 'undefined') {
      throw new Error('Cannot handle an elevator request without a floor');
    }

    const direction: ElevatorDirection =
      destinationFloorId > floorId ? 'up' : 'down';

    requestElevator({
      floorId,
      personId: this.props.id,
      direction,
      requestedAt: new Date(),
    });
  };

  render() {
    const { children, floorRef, elevatorRef } = this.props;
    const {
      currentX,
      destinationX,
      armPokeTarget,
      isGhost,
      zIndex,
    } = this.state;

    const renderTarget = floorRef || elevatorRef;

    const isWalking = currentX !== destinationX;

    if (!renderTarget) {
      throw new Error('Please provide either a floor or elevator to render to');
    }

    return createPortal(
      <PersonContainer
        style={{ zIndex, transform: `translateX(${currentX}px)` }}
      >
        {children({
          isWalking,
          isGhost,
          armPokeTarget,
          handleElevatorRequest: this.handleElevatorRequest,
        })}
      </PersonContainer>,
      renderTarget
    );
  }
}

const PersonContainer = styled.div`
  /*
    Initialize all people in the bottom left corner of their parent container.
    They'll be moved around with transform: translate.
  */
  position: absolute;
  left: 0;
  bottom: 0;
`;

const getPropsForInitialFloor = (state, ownProps) => {
  const { floorId, destinationFloorId } = ownProps;

  const floorDirection = destinationFloorId > floorId ? 'up' : 'down';

  const preExistingElevatorRequest = getElevatorRequestsArray(state).find(
    request =>
      request.floorId === floorId && request.direction === floorDirection
  );

  const numberOfFolksAlreadyWaiting = preExistingElevatorRequest
    ? preExistingElevatorRequest.peopleIds.length
    : 0;

  return {
    // Figure out if this person has to click the button or not.
    isFloorAlreadyRequested: !!preExistingElevatorRequest,
    numberOfFolksAlreadyWaiting,
  };
};

const mapStateToProps = (state, ownProps) => {
  const { status } = ownProps;

  const isOnInitialFloor =
    status === 'initialized' || status === 'waiting-for-elevator';

  if (isOnInitialFloor) {
    return getPropsForInitialFloor(state, ownProps);
  }

  const isBoardingOrRidingElevator =
    status === 'boarding-elevator' || status === 'riding-elevator';

  if (isBoardingOrRidingElevator) {
    // Figure out which elevator they're boarding, so that we can work out which
    // elevator position they'll fill.
    const peopleOnElevator = getPeopleOnElevator(ownProps.elevatorId, state);

    return {
      numberOfFolksAlreadyOnElevator: peopleOnElevator.length,
    };
  }

  if (status === 'disembarking-elevator') {
    const peopleOnFloor = getPeopleDisembarkedOnFloor(ownProps.floorId, state);

    return { numberOfFolksAlreadyOnFloor: peopleOnFloor.length };
  }

  return {};
};

export default connect(mapStateToProps, {
  requestElevator,
  joinGroupWaitingForElevator,
  enterElevator,
  personCeasesToExist,
})(PersonController);
