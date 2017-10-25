// @flow
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';

import { colors } from '../../constants';

import { PATHS } from './Person.data';

import type { Shape } from './Person.types';

export type Props = {
  color: string,
  shape: Shape,
  patience: number,
  walkSpeed: number,
  destinationX: number,
  size: number,
  renderTo: {
    ref: HTMLElement,
    index: number,
    type: 'floor' | 'elevator',
  },
  destinationFloor: number,
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
    currentX: 0,
    isWalking: false,
  };

  animationFrameId: number;

  componentDidMount() {
    if (this.props.destinationX !== this.state.currentX) {
      this.moveTowardsDestinationX();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.destinationX !== this.props.destinationX) {
      window.cancelAnimationFrame(this.animationFrameId);

      this.moveTowardsDestinationX();
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameId);
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
        this.animationFrameId = window.requestAnimationFrame(
          this.moveTowardsDestinationX
        );
      }
    );
  };

  render() {
    const { size, color, shape, renderTo } = this.props;
    const { currentX, isWalking } = this.state;

    const personElement = (
      <PersonSVG
        viewBox="0 0 200 230"
        width={size}
        height={size}
        style={{ transform: `translateX(${currentX}px)` }}
      >
        <LeftLeg isWalking={isWalking} x1={80} y1={195} x2={80} y2={230} />
        <RightLeg isWalking={isWalking} x1={120} y1={195} x2={120} y2={230} />
        <Body isWalking={isWalking} color={color} d={PATHS[shape]} />
      </PersonSVG>
    );

    // If we've specified a `renderTo`, open a portal to it.
    // otherwise, just render into the tree.
    if (renderTo) {
      return ReactDOM.createPortal(personElement, renderTo.ref);
    }

    return personElement;
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

const PersonSVG = styled.svg`
  /*
    Initialize all people in the bottom left corner of their parent container.
    They'll be moved around with transform: translate.
  */
  position: absolute;
  left: 0;
  bottom: 0;
`;

const Leg = styled.line`
  stroke: ${colors.gray[700]};
  stroke-width: 10;
  animation-name: ${props => (props.isWalking ? moveLeg : 'none')};
  animation-duration: ${STEP_DURATION}ms;
  animation-iteration-count: infinite;
  will-change: transform;
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
  will-change: transform;
`;

export default Person;
