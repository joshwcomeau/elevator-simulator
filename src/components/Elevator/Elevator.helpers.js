// @flow
import { FLOOR_HEIGHT } from '../../constants';

export const getElevatorOffset = (currentFloor: number, numFloors: number) => {
  return (numFloors - 1 - currentFloor) * FLOOR_HEIGHT;
}
