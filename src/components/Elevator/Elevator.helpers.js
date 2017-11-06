// @flow
import {
  ELEVATOR_SHAFT_WIDTH,
  FLOOR_HEIGHT,
  FLOOR_BORDER_WIDTH,
} from '../../constants';

export const getElevatorOffset = (floor: number, numFloors: number) => {
  return (numFloors - 1 - floor) * FLOOR_HEIGHT - FLOOR_BORDER_WIDTH / 2;
};

export const getSlotForPerson = (positionWithinElevator: number) =>
  // We want to transform a 0-indexed value representing their elevator
  // position, and get their "slot" (either -1 for the left position, 0 for the
  // center position, or 1 for the right position)
  positionWithinElevator % 3 - 1;

export const getPersonElevatorPositionOffset = (personIndex: number) =>
  getSlotForPerson(personIndex) * (ELEVATOR_SHAFT_WIDTH / 4);
