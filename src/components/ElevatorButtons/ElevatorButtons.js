// @flow
import React from 'react';
import styled from 'styled-components';

import { colors } from '../../constants';

import type { RefCapturer } from '../../types';

type Props = {
  innerRef: RefCapturer,
  isBottomFloor: boolean,
  isTopFloor: boolean,
  hasRequestedUp: boolean,
  hasRequestedDown: boolean,
  offset: number,
};

const ElevatorButtons = ({
  innerRef,
  isBottomFloor,
  isTopFloor,
  hasRequestedUp,
  hasRequestedDown,
  offset,
}: Props) => (
  <ElevatorButtonsWrapper offset={offset} innerRef={innerRef}>
    <ElevatorButtonsPlate>
      {!isTopFloor && <ElevatorButton litUp={hasRequestedUp} />}
      {!isBottomFloor && <ElevatorButton litUp={hasRequestedDown} />}
    </ElevatorButtonsPlate>
  </ElevatorButtonsWrapper>
);

const BUTTON_SIZE = 8;
const BUTTON_PADDING = 6;

const ElevatorButtonsWrapper = styled.div`
  position: absolute;
  top: 0;
  right: ${props => props.offset}px;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ElevatorButtonsPlate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  height: 20px;
`;

const ElevatorButton = styled.button`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  padding: 0;
  background: ${props => (props.litUp ? colors.green[500] : colors.gray[100])};
  border: none;
  border-radius: 50%;

  &:nth-of-type(2) {
    margin-top: 2px;
  }
`;

export default ElevatorButtons;
