// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';

import { PATHS, BODY_COLORS } from './Person.data';

import type { Shape, Status } from './Person.types';

export type Props = {
  id: string,
  color: string,
  shape: Shape,
  patience: number,
  walkSpeed: number,
  size: number,
  Status: Status,
  isWalking: boolean,
};

class Person extends PureComponent<Props> {
  static defaultProps = {
    size: 30,
    color: BODY_COLORS[0],
    shape: 'pentagon',
    patience: 50,
    walkSpeed: 1,
    isWalking: false,
  };

  render() {
    const { size, color, shape, isWalking } = this.props;

    return (
      <PersonSvg viewBox="0 0 200 230" width={size} height={size}>
        <LeftLeg isWalking={isWalking} x1={80} y1={195} x2={80} y2={230} />
        <RightLeg isWalking={isWalking} x1={120} y1={195} x2={120} y2={230} />
        <Arm x1={100} y1={100} x2={200} y2={100} />
        <Body isWalking={isWalking} color={color} d={PATHS[shape]} />
      </PersonSvg>
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

const PersonSvg = styled.svg`
  display: block;
`;

const Leg = styled.line`
  stroke: ${COLORS.gray[700]};
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

const Arm = styled.line`
  stroke: ${COLORS.gray[700]};
  stroke-width: 10;
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
