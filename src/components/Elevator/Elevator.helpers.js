// @flow
import { FLOOR_HEIGHT, FLOOR_BORDER_WIDTH } from '../../constants';

export const getElevatorOffset = (floor: number, numFloors: number) => {
  return (numFloors - 1 - floor) * FLOOR_HEIGHT - FLOOR_BORDER_WIDTH / 2;
};
