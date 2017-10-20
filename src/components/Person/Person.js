// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import { colors } from '../../constants';
import { sample } from '../../utils';

const PATHS = {
  pentagon: `
    M 100 43.48
    L 182.29 110
    L 150.86 200
    L 49.14 200
    L 17.71 110
  `,
  rectangle: `
    M 60 0
    L 140 0
    L 140 200
    L 60 200
  `,
};

const PATH_KEYS = Object.keys(PATHS);

const COLORS = [colors.orange[500]];

type Props = {
  color?: string,
  shape?: 'pentagon' | 'rectangle',
  size: number,
  isWalking: boolean,
};

class Person extends PureComponent<Props> {
  static defaultProps = {
    size: 30,
    isWalking: false,
  };

  render() {
    const { size, isWalking } = this.props;
    const color = this.props.color || sample(COLORS);
    const shape = this.props.shape || sample(PATH_KEYS);

    return (
      <svg viewBox="0 0 200 230" width={size} height={size}>
        <LeftLeg isWalking={isWalking} x1={80} y1={195} x2={80} y2={230} />
        <RightLeg isWalking={isWalking} x1={120} y1={195} x2={120} y2={230} />
        <Body color={color} d={PATHS[shape]} />
      </svg>
    );
  }
}

const takeStep = keyframes`
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

const Leg = styled.line`
  stroke: ${colors.gray[700]};
  stroke-width: 10;
  animation-name: ${props => (props.isWalking ? takeStep : 'none')};
  animation-duration: 500ms;
  animation-iteration-count: infinite;
  animation-play-state: ${props => (props.isWalking ? 'running' : 'paused')};
`;

const LeftLeg = styled(Leg)`
  animation-delay: 250ms;
`;

const RightLeg = styled(Leg)`
  /* No styles needed */
`;

const Body = styled.path`
  fill: ${props => props.color};
  stroke: none;
`;

export default Person;
