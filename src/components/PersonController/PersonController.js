import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import type { Status } from '../Person/Person.types';

type Props = {
  status: Status,
  floorId?: number,
  elevatorId?: number,
  floorRef?: HTMLElement,
  elevatorRef?: HTMLElement,
  elevatorButtonRef?: HTMLElement,
  handleRequestElevator: () => void,
  handleBoardElevator: () => void,
  handleDisembarkElevator: () => void,
  children: any,
};

type State = {
  currentX: number,
  destinationX: number,
};

class PersonController extends PureComponent<Props, State> {
  state = {
    currentX: 0,
    destinationX: 0,
  };

  animationFrameId: number;

  componentDidMount() {
    // When a person mounts, their first order of business is to march towards
    // the elevator buttons on their floor.
    const buttonBox = this.props.elevatorButtonRef.getBoundingClientRect();
    const destinationX = buttonBox.left;

    this.setState({ destinationX });
  }

  componentDidUpdate(_, prevState) {
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

  render() {
    const {
      children,
      status,
      floorId,
      elevatorId,
      floorRef,
      elevatorRef,
    } = this.props;
    const { currentX, destinationX } = this.state;

    const renderTarget = floorRef || elevatorRef;

    const isWalking = currentX !== destinationX;

    console.log('Render person', { isWalking, currentX, destinationX });

    return createPortal(
      <PersonContainer style={{ transform: `translateX(${currentX}px)` }}>
        {children({ isWalking })}
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

export default PersonController;
