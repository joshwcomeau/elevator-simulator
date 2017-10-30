import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { requestElevator, joinGroupWaitingForElevator } from '../../actions';
import { getElevatorRequestsArray } from '../../reducers/elevator-requests.reducer';
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
  requestElevator: ActionCreator,
  handleBoardElevator: ActionCreator,
  handleDisembarkElevator: ActionCreator,
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
    const buttonPosition = elevatorButtonRef.children[0].getBoundingClientRect();
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
      // If they just finished requesting an elevator (or joining a group that
      // has), we want to move them a few steps back from the elevator buttons.
      this.setState(state => ({
        destinationX: state.destinationX - random(15, 50),
      }));
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
      destinationFloorId,
      floorRef,
      elevatorButtonRef,
      isFloorAlreadyRequested,
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

const mapStateToProps = (state, ownProps) => {
  const { floorId, destinationFloorId } = ownProps;

  // TODO: People on elevators don't have FloorIds and will need different data.

  const floorDirection = destinationFloorId > floorId ? 'up' : 'down';

  return {
    isFloorAlreadyRequested: getElevatorRequestsArray(state).some(
      request =>
        request.floorId === floorId && request.direction === floorDirection
    ),
  };
};

export default connect(mapStateToProps, {
  requestElevator,
  joinGroupWaitingForElevator,
})(PersonController);
