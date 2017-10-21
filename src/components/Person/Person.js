// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import { colors } from '../../constants';

import { PATHS } from './Person.data';

export type Props = {
  color: string,
  shape: 'pentagon' | 'rectangle',
  patience: number,
  walkSpeed: number,
  destinationX: number,
  size: number,
};

type State = {
  currentX: number,
  isWalking: boolean,
};

class Person extends PureComponent<Props, State> {
  static defaultProps = {
    destinationX: 0,
    size: 30,
    color: colors.gray[500],
    shape: 'pentagon',
    patience: 50,
    walkSpeed: 1,
    isWalking: false,
  };

  state = {
    currentX: this.props.destinationX,
    isWalking: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.destinationX !== this.props.destinationX) {
      this.moveTowardsDestinationX();
    }
  }

  moveTowardsDestinationX = () => {
    const { currentX } = this.state;
    const { destinationX, walkSpeed } = this.props;

    const distanceToDestination = Math.abs(currentX - destinationX);

    // If we're _almost_ at our destination (we'll get there in the next tick),
    // we can skip a bunch of stuff and just teleport there.
    if (distanceToDestination <= walkSpeed) {
      this.setState({ isWalking: false, currentX: destinationX });
      return;
    }

    const direction = destinationX < currentX ? 'left' : 'right';

    const offsetAmount = direction === 'right' ? walkSpeed : -walkSpeed;

    this.setState(
      state => ({
        isWalking: true,
        currentX: state.currentX + offsetAmount,
      }),
      () => {
        window.requestAnimationFrame(this.moveTowardsDestinationX);
      }
    );
  };

  render() {
    const { size, color, shape } = this.props;
    const { currentX, isWalking } = this.state;

    return (
      <svg
        viewBox="0 0 200 230"
        width={size}
        height={size}
        style={{ transform: `translateX(${currentX}px)` }}
      >
        <LeftLeg isWalking={isWalking} x1={80} y1={195} x2={80} y2={230} />
        <RightLeg isWalking={isWalking} x1={120} y1={195} x2={120} y2={230} />
        <Body isWalking={isWalking} color={color} d={PATHS[shape]} />
      </svg>
    );
  }
}

const wobbleBody = keyframes`
  0% {
    transform-origin: bottom center;
    transform: rotateZ(3deg);
  }

  50% {
    transform-origin: bottom center;
    transform: rotateZ(-3deg);
  }

  100% {
    transform-origin: bottom center;
    transform: rotateZ(3deg);
  }
`;

const moveLeg = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-45%);
  }

  100% {
    transform: translateY(0);
  }
`;

const STEP_DURATION = 500;

const Leg = styled.line`
  stroke: ${colors.gray[700]};
  stroke-width: 10;
  animation-name: ${props => (props.isWalking ? moveLeg : 'none')};
  animation-duration: ${STEP_DURATION}ms;
  animation-iteration-count: infinite;
`;

const LeftLeg = styled(Leg)`
  animation-delay: ${STEP_DURATION / 2}ms;
`;

const RightLeg = styled(Leg)`
  /* No styles needed */
`;

const Body = styled.path`
  fill: ${props => props.color};
  stroke: none;
  animation-name: ${props => (props.isWalking ? wobbleBody : 'none')};
  animation-duration: ${STEP_DURATION}ms;
  animation-iteration-count: infinite;
`;

export default Person;
