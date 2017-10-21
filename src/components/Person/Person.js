// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import { colors } from '../../constants';

import { PATHS } from './Person.data';

type Props = {
  color: string,
  shape: 'pentagon' | 'rectangle',
  patience: number,
  walkSpeed: number,
  size: number,
  isWalking: boolean,
};

class Person extends PureComponent<Props> {
  static defaultProps = {
    destinationX: 0,
    size: 30,
    color: colors.gray[500],
    shape: 'pentagon',
    patience: 50,
    walkSpeed: 5,
    isWalking: false,
  };

  render() {
    const { size, color, shape, isWalking } = this.props;

    return (
      <svg viewBox="0 0 200 230" width={size} height={size}>
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
