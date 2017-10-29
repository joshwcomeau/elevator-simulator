// @flow
import { FLOOR_HEIGHT } from '../../constants';

export const getElevatorOffset = (floor: number, numFloors: number) => {
  return (numFloors - 1 - floor) * FLOOR_HEIGHT;
};
