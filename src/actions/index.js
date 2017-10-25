// @flow
import { random } from '../utils';
import type { Direction } from '../types';

//
// Action Types
export const INITIALIZE_BUILDING = 'INITIALIZE_BUILDING';
export const OPEN_ELEVATOR_DOORS = 'OPEN_ELEVATOR_DOORS';
export const REQUEST_ELEVATOR = 'REQUEST_ELEVATOR';
export const ELEVATOR_ARRIVES_AT_FLOOR = 'ELEVATOR_ARRIVES_AT_FLOOR';
export const NEW_PERSON_ARRIVES_AT_BUILDING = 'NEW_PERSON_ARRIVES_AT_BUILDING';
export const PEOPLE_ARRIVE_AT_DESTINATION = 'PEOPLE_ARRIVE_AT_DESTINATION';

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
}) => {
  // Get a timestamp. Maybe this won't be useful in the end, but it seems neat
  // to be able to diagnose average request delays, in addition to person
  // wait times.
  const requestedAt = new Date();

  // Generate a unique ID for this request.
  // eg. '2-down-1508847804756`
  const id = `${floorId}-${direction}-${Number(requestedAt)}`;

  return {
    type: REQUEST_ELEVATOR,
    id,
    floorId,
    direction,
    requestedAt,
  };
};

export const elevatorArrivesAtFloor = ({
  elevatorId,
  floorId,
}: {
  elevatorId: number,
  floorId: number,
}) => ({
  type: ELEVATOR_ARRIVES_AT_FLOOR,
  elevatorId,
  floorId,
});
