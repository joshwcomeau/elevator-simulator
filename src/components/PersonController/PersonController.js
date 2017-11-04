import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import {
  requestElevator,
  joinGroupWaitingForElevator,
  finishBoardingElevator,
} from '../../actions';
import { ELEVATOR_SHAFT_WIDTH } from '../../constants';
import { getElevatorRequestsArray } from '../../reducers/elevator-requests.reducer';
import { getPeopleOnElevatorFactory } from '../../reducers/people.reducer';
import { random } from '../../utils';

import { getButtonToPress, getDirection } from './PersonController.helpers';

import type { ActionCreator, Direction } from '../../types';
import type { Status } from '../Person/Person.types';

type Props = {
  status: Status,
  size: number,
  floorId?: number,
  elevatorId?: number,
  destinationFloorId: number,
  direction?: Direction,
  floorRef?: HTMLElement,
  elevatorRef?: HTMLElement,
  elevatorButtonRef?: HTMLElement,
  isFloorAlreadyRequested: boolean,
  numberOfFolksAlreadyWaiting: number,
  requestElevator: ActionCreator,
  handleBoardElevator: ActionCreator,
  handleDisembarkElevator: ActionCreator,
  personElevatorPosition?: 0 | 1 | 2,
  children: any,
};

type State = {
  currentX: number,
  destinationX: number,
  armPokeTarget?: HTMLElement,
};

class PersonController extends PureComponent<Props, State> {
  state = {
    currentX: 0,
    destinationX: 0,
  };

  animationFrameId: number;

  componentDidMount() {
    const { size, elevatorButtonRef } = this.props;

    // When a person mounts, their first order of business is to march towards
    // the elevator buttons on their floor.
    const [firstButton] = elevatorButtonRef.children;
    const buttonPosition = firstButton.getBoundingClientRect();
    const destinationX = buttonPosition.left + buttonPosition.width / 2 - size;

    this.setState({ destinationX });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.destinationX !== this.state.destinationX) {
      window.cancelAnimationFrame(this.animationFrameId);

      this.moveTowardsDestinationX();
    }

    if (
      prevProps.status === 'initialized' &&
      this.props.status === 'waiting-for-elevator'
    ) {
      // If we're waiting for the elevator, we want to form a neat orderly
      // line beside the elevator, with everyone else who has requested it.
      const offsetAmount = this.props.numberOfFolksAlreadyWaiting * 25;

      // We also don't want to IMMEDIATELY waddle away after pressing the
      // button; we want to wait a short amount of time.
      // That said, if the elevator arrives in that gap, we don't need to go
      // join the line, we can just file in. So, we'll cancel this timer if
      // it stops being important.
      this.nonCriticalTimeoutId = window.setTimeout(() => {
        this.setState(state => ({
          destinationX: state.destinationX - offsetAmount,
        }));
      }, 400);
    }

    if (
      prevProps.status === 'waiting-for-elevator' &&
      this.props.status === 'boarding-elevator'
    ) {
      if (!this.props.elevatorRef) {
        throw new Error(
          'Started trying to board elevator, but no elevator ref was supplied'
        );
      }
      // march our little fella towards the center of the elevator doors
      const elevatorBox = this.props.elevatorRef.getBoundingClientRect();

      const offsetAmount =
        elevatorBox.left + elevatorBox.width / 2 - this.props.size / 2;
      this.setState({
        destinationX: offsetAmount,
      });
    }

    if (
      prevProps.status === 'boarding-elevator' &&
      this.props.status === 'riding-elevator'
    ) {
      // Center the person within the elevator. This will be their NEW origin,
      // so that their on-screen position doesn't change.
      const offsetAmount = ELEVATOR_SHAFT_WIDTH / 2 - this.props.size / 2;

      this.setState({
        currentX: offsetAmount,
        destinationX: this.props.personElevatorPosition * (
          ELEVATOR_SHAFT_WIDTH / 4
        ),
      });
    }

    if (
      prevProps.status === 'riding-elevator' &&
      this.props.status === 'arrived-at-destination'
    ) {
      // We need to do the opposite of the boarding->riding transition, and
      // move this fella from the elevator DOM container to the new floor.
      const elevatorBox = prevProps.elevatorRef.getBoundingClientRect();
      const floorBox = this.props.floorRef.getBoundingClientRect();

      const offsetAmount =
        elevatorBox.left + ELEVATOR_SHAFT_WIDTH / 2 - this.props.size / 2;

      this.setState({
        currentX: offsetAmount,
        destinationX: floorBox.left + 50,
      });
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  moveTowardsDestinationX = () => {
    const { currentX, destinationX } = this.state;
    const { walkSpeed } = this.props;

    const distanceToDestination = Math.abs(currentX - destinationX);

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
      elevatorButtonRef,
      isFloorAlreadyRequested,
      joinGroupWaitingForElevator,
      finishBoardingElevator,
    } = this.props;

    switch (status) {
      case 'initialized': {
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

        // Start by figuring out which button to press.
        const armPokeTarget = getButtonToPress({
          buttons: elevatorButtonRef.children,
          floorId,
          destinationFloorId,
        });

        this.setState({ armPokeTarget });

        return;
      }

      case 'boarding-elevator': {
        finishBoardingElevator({
          personId: id,
          elevatorId,
          destinationFloorId,
        });

        return;
      }

      default:
        break;
    }
  };

  handleElevatorRequest = () => {
    const { floorId, destinationFloorId, requestElevator } = this.props;

    const direction: Direction = destinationFloorId > floorId ? 'up' : 'down';

    requestElevator({ floorId, personId: this.props.id, direction });
  };

  render() {
    const { children, floorRef, elevatorRef } = this.props;
    const { currentX, destinationX, armPokeTarget } = this.state;

    const renderTarget = floorRef || elevatorRef;

    const isWalking = currentX !== destinationX;

    return createPortal(
      <PersonContainer style={{ transform: `translateX(${currentX}px)` }}>
        {children({
          isWalking,
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

  const isBoardingElevator = status === 'boarding-elevator';

  if (isBoardingElevator) {
    // Figure out which elevator they're boarding, so that we can work out which
    // elevator position they'll fill.
    const numberOfFolksAlreadyOnElevator = (
      getPeopleOnElevatorFactory(ownProps.elevatorId)(state)
    );

    return {
      // Make the range value from 0-2 by using modulo, and then from
      // -1 to 1, by subtracting 1. THis way, the center spot is position 0,
      // which makes the math easier, but also makes a kind of sense since the
      // folks enter through the center.
      personElevatorPosition: numberOfFolksAlreadyOnElevator % 3 - 1,
    };
  }

  return {};
};

export default connect(mapStateToProps, {
  requestElevator,
  joinGroupWaitingForElevator,
  finishBoardingElevator,
})(PersonController);
