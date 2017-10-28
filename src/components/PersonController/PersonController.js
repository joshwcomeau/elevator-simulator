import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { requestElevator } from '../../actions';

import { getButtonToPress } from './PersonController.helpers';

import type { ActionCreator, Direction } from '../../types';
import type { Status } from '../Person/Person.types';

type Props = {
  status: Status,
  size: number,
  floorId?: number,
  elevatorId?: number,
  destinationFloorId: number,
  floorRef?: HTMLElement,
  elevatorRef?: HTMLElement,
  elevatorButtonRef?: HTMLElement,
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

  componentDidUpdate(_, prevState) {
    const { status, requestElevator, floorId } = this.props;
    const { currentX, destinationX } = this.state;

    if (prevState.destinationX !== this.state.destinationX) {
      window.cancelAnimationFrame(this.animationFrameId);

      this.moveTowardsDestinationX();
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
      status,
      floorId,
      destinationFloorId,
      floorRef,
      elevatorButtonRef,
      requestElevator,
    } = this.props;

    switch (status) {
      case 'initialized': {
        // We need to hit the right elevator button, and then fire off the
        // elevator request action.
        // Hitting the button is surprisingly tricky; we have to work out where
        // the arm needs to poke, which mixes the SVG ViewBox coordinates with
        // the DOM BoundingBox coordinates.
        //
        // Start by figuring out which button to press.
        const armPokeTarget = getButtonToPress({
          buttons: elevatorButtonRef.children,
          floorId,
          destinationFloorId,
        });

        this.setState({ armPokeTarget });

        break;
      }
    }
  };

  handleElevatorRequest = () => {
    const { floorId, destinationFloorId, requestElevator } = this.props;

    const direction: Direction = destinationFloorId > floorId ? 'up' : 'down';

    requestElevator({ floorId, direction });
  };

  render() {
    const {
      children,
      status,
      floorId,
      elevatorId,
      floorRef,
      elevatorRef,
    } = this.props;
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

export default connect(null, { requestElevator })(PersonController);
