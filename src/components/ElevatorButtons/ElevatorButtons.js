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

const BUTTON_SIZE = 10;
const BUTTON_PADDING = 6;

const ElevatorButtonsWrapper = styled.div`
  position: absolute;
  top: 0;
  right: ${props => props.offset}px;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
`;

const ElevatorButtonsPlate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.35);
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
`;

const ElevatorButton = styled.button`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  background: ${props => (props.litUp ? colors.green[500] : colors.gray[100])};
`;

export default ElevatorButtons;
