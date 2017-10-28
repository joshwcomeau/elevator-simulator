// @flow
import { getRandomPersonAttrbutes } from '../components/Person/Person.helpers';

import type { Shape } from '../components/Person/Person.types';
import type { Direction } from '../types';

//
// Action Types
export const INITIALIZE_BUILDING = 'INITIALIZE_BUILDING';
export const OPEN_ELEVATOR_DOORS = 'OPEN_ELEVATOR_DOORS';
export const REQUEST_ELEVATOR = 'REQUEST_ELEVATOR';
export const ELEVATOR_ARRIVES_AT_FLOOR = 'ELEVATOR_ARRIVES_AT_FLOOR';
export const GENERATE_PERSON = 'GENERATE_PERSON';
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

export const generatePerson = ({
  shape,
  size,
  color,
  patience,
  walkSpeed,
  floorId,
  destinationFloorId,
}: {
  id: string,
  firstName: string,
  lastName: string,
  shape: Shape,
  size: number,
  color: string,
  patience: number,
  walkSpeed: number,
  floorId: number,
  destinationFloorId: number,
}) => ({
  type: GENERATE_PERSON,
  person: {
    status: 'initialized',
    shape,
    size,
    color,
    patience,
    walkSpeed,
    floorId,
    destinationFloorId,
  },
});

// NOTE: This action-creator is impure, generates random values.
export const generateRandomPerson = ({
  floorId,
  destinationFloorId,
}: {
  floorId: number,
  destinationFloorId: number,
}) =>
  generatePerson({
    ...getRandomPersonAttrbutes(),
    floorId,
    destinationFloorId,
  });
