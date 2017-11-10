// @flow
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getElevatorRequestsByFloor } from '../../reducers/elevator-requests.reducer';

import ElevatorButton from '../ElevatorButton';

import type { RefCapturer } from '../../types';

const BUTTON_SIZE = 8;

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
  <ElevatorButtonsWrapper>
    <ElevatorButtonsPlate innerRef={refCapturer}>
      {!isTopFloor && (
        <ElevatorButton
          size={BUTTON_SIZE}
          direction="up"
          isRequested={hasRequestedUp}
        />
      )}
      {!isBottomFloor && (
        <ElevatorButton
          size={BUTTON_SIZE}
          direction="down"
          isRequested={hasRequestedDown}
        />
      )}
    </ElevatorButtonsPlate>
  </ElevatorButtonsWrapper>
);

const ElevatorButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 45px;
`;

const ElevatorButtonsPlate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px;
  height: 26px;
  margin-bottom: 16px;
`;

const mapStateToProps = (state, { floorId }) => {
  const { floors } = state;

  const requestsForThisFloor = getElevatorRequestsByFloor(floorId, state);

  const isBottomFloor = floorId === 0;
  const isTopFloor = floorId === floors.length - 1;

  const hasRequestedUp = requestsForThisFloor.some(
    request => request.direction === 'up'
  );

  const hasRequestedDown = requestsForThisFloor.some(
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
