import React from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import type { ElevatorDirection } from '../../types';

type Props = {
  size: number,
  direction: ElevatorDirection,
  isRequested: boolean,
};
const ElevatorButton = ({ size, direction, isRequested }: Props) => {
  const iconSize = size - 1;

  const polygonPoints =
    direction === 'up'
      ? `0,${iconSize} ${iconSize / 2},0, ${iconSize},${iconSize}`
      : `0,0 ${iconSize / 2},${iconSize}, ${iconSize},0`;

  return (
    <ElevatorButtonElem size={size}>
      <ElevatorButtonIcon iconSize={iconSize}>
        <polygon
          points={polygonPoints}
          fill={isRequested ? COLORS.green[500] : COLORS.gray[300]}
        />
      </ElevatorButtonIcon>
    </ElevatorButtonElem>
  );
};

const ElevatorButtonElem = styled.button`
  width: ${props => props.size + 'px'};
  height: ${props => props.size + 'px'};
  padding: 0;
  border: none;
  background: transparent;

  &:nth-of-type(2) {
    margin-top: 2px;
  }
`;

const ElevatorButtonIcon = styled.svg`
  display: block;
  width: ${props => props.iconSize + 'px'};
  height: ${props => props.iconSize + 'px'};
`;

export default ElevatorButton;
