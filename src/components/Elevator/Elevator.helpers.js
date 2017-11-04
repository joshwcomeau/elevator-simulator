// @flow
import {
  ELEVATOR_SHAFT_WIDTH,
  FLOOR_HEIGHT,
  FLOOR_BORDER_WIDTH,
} from '../../constants';

import type { PersonElevatorPosition } from '../../types';

export const getElevatorOffset = (floor: number, numFloors: number) => {
  return (numFloors - 1 - floor) * FLOOR_HEIGHT - FLOOR_BORDER_WIDTH / 2;
};

export const getPersonElevatorPositionOffset = (
  position: PersonElevatorPosition
) => position * (ELEVATOR_SHAFT_WIDTH / 4);
