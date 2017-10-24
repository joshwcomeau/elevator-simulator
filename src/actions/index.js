// @flow
import type { Direction } from '../types';

//
// Action Types
export const INITIALIZE_BUILDING = 'INITIALIZE_BUILDING';
export const OPEN_ELEVATOR_DOORS = 'OPEN_ELEVATOR_DOORS';
export const REQUEST_ELEVATOR = 'REQUEST_ELEVATOR';
export const ELEVATOR_ARRIVE_AT_FLOOR = 'ELEVATOR_ARRIVE_AT_FLOOR';

//
// Action Creators
export const initializeBuilding = ({
  numFloors,
  numElevators,
}: {
  numFloors: number,
  numElevators: number,
}) => ({
  type: INITIALIZE_BUILDING,
  numFloors,
  numElevators,
});

export const openElevatorDoors = ({ elevatorId }: { elevatorId: number }) => ({
  type: OPEN_ELEVATOR_DOORS,
  elevatorId,
});

export const requestElevator = ({
  floorId,
  direction,
}: {
  floorId: number,
  direction: Direction,
}) => ({
  type: REQUEST_ELEVATOR,
  floorId,
  direction,
});

export const elevatorArriveAtFloor = ({
  elevatorId,
  floorId,
}: {
  elevatorId: number,
  floorId: number,
}) => ({
  type: ELEVATOR_ARRIVE_AT_FLOOR,
  elevatorId,
  floorId,
});
