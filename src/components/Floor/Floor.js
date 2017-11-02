// @flow
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  COLORS,
  ELEVATOR_SHAFT_WIDTH,
  FLOOR_HEIGHT,
  FLOOR_BORDER_WIDTH,
} from '../../constants';
import { range } from '../../utils';

import ElevatorButtons from '../ElevatorButtons';

import type { RefCapturer } from '../../types';

type Props = {
  id: number,
  numElevators: number,
  refCapturer: RefCapturer,
  elevatorButtonsRefCapturer: RefCapturer,
};

const Floor = ({
  id,
  numElevators,
  refCapturer,
  elevatorButtonsRefCapturer,
}: Props) => {
  // Our Floor consists of a main waiting area, and spacers that "block" the
  // elevator shafts. This is necessary so that we know where to put the
  // elevator buttons.
  return (
    <FloorElem>
      <FloorElevatorLayer>
        <ElevatorButtons
          floorId={id}
          refCapturer={elevatorButtonsRefCapturer}
        />
        {range(numElevators).map(() => <ElevatorSpacer />)}
      </FloorElevatorLayer>

      <FloorPeopleLayer innerRef={refCapturer} />
    </FloorElem>
  );
};

const FloorElem = styled.div`
  position: relative;
  height: ${FLOOR_HEIGHT}px;
  border-bottom: ${FLOOR_BORDER_WIDTH}px solid ${COLORS.gray[700]};
`;

const FloorElevatorLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  height: ${FLOOR_HEIGHT}px;
`;

const FloorPeopleLayer = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ElevatorSpacer = styled.div`
  height: inherit;
  width: ${ELEVATOR_SHAFT_WIDTH}px;
`;

export default Floor;
