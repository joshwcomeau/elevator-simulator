// @flow
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { getElevatorRequestsByFloor } from '../../reducers/elevator-requests.reducer';

import type { RefCapturer } from '../../types';

type Props = {
  floorId: number,
  isBottomFloor: boolean,
  isTopFloor: boolean,
  hasRequestedUp: boolean,
  hasRequestedDown: boolean,
  refCapturer: RefCapturer,
};

const ElevatorButtons = ({
  isBottomFloor,
  isTopFloor,
  hasRequestedUp,
  hasRequestedDown,
  refCapturer,
}: Props) => (
  <ElevatorButtonsWrapper innerRef={refCapturer}>
    <ElevatorButtonsPlate>
      {!isTopFloor && <ElevatorButton litUp={hasRequestedUp} />}
      {!isBottomFloor && <ElevatorButton litUp={hasRequestedDown} />}
    </ElevatorButtonsPlate>
  </ElevatorButtonsWrapper>
);

const BUTTON_SIZE = 8;
const BUTTON_PADDING = 6;

const ElevatorButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
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
  background: ${props => (props.litUp ? COLORS.green[500] : COLORS.gray[100])};
  border: none;
  border-radius: 50%;

  &:nth-of-type(2) {
    margin-top: 2px;
  }
`;

const mapStateToProps = (state, { id }) => {
  const { floors, elevatorRequests } = state;

  const floor = floors[id];

  const requestsForThisFloor = getElevatorRequestsByFloor(id, state);

  const isBottomFloor = id === 0;
  const isTopFloor = id === floors.length - 1;

  const hasRequestedUp = requestsForThisFloor.includes(
    request => request.direction === 'up'
  );

  const hasRequestedDown = requestsForThisFloor.includes(
    request => request.direction === 'down'
  );

  return {
    isBottomFloor,
    isTopFloor,
    hasRequestedUp,
    hasRequestedDown,
  };
};

export default connect(mapStateToProps)(ElevatorButtons);
