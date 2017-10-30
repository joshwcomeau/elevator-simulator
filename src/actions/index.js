// @flow
import { getRandomPersonAttrbutes } from '../components/Person/Person.helpers';

import type { Shape } from '../components/Person/Person.types';
import type { Direction } from '../types';

//
// Action Types
export const INITIALIZE_BUILDING = 'INITIALIZE_BUILDING';
export const REQUEST_ELEVATOR = 'REQUEST_ELEVATOR';
export const JOIN_GROUP_WAITING_FOR_ELEVATOR =
  'JOIN_GROUP_WAITING_FOR_ELEVATOR';
export const DISPATCH_ELEVATOR = 'DISPATCH_ELEVATOR';
export const ELEVATOR_ARRIVES_AT_FLOOR = 'ELEVATOR_ARRIVES_AT_FLOOR';
export const OPEN_ELEVATOR_DOORS = 'OPEN_ELEVATOR_DOORS';
export const FULFILL_ELEVATOR_REQUEST = 'FULFILL_ELEVATOR_REQUEST';
export const GENERATE_PERSON = 'GENERATE_PERSON';
export const PEOPLE_ARRIVE_AT_DESTINATION = 'PEOPLE_ARRIVE_AT_DESTINATION';

//
// Action Creators
type InitializeBuilding = { numFloors: number, numElevators: number };
export const initializeBuilding = (args: InitializeBuilding) => ({
  type: INITIALIZE_BUILDING,
  ...args,
});

type RequestElevator = {
  personId: string,
  floorId: number,
  direction: Direction,
};
export const requestElevator = (args: RequestElevator) => {
  // Get a timestamp. Maybe this won't be useful in the end, but it seems neat
  // to be able to diagnose average request delays, in addition to person
  // wait times.
  const requestedAt = new Date();

  // Generate a unique ID for this request.
  // eg. '2-down-1508847804756`
  const id = `${args.floorId}-${args.direction}-${Number(requestedAt)}`;

  return {
    type: REQUEST_ELEVATOR,
    id,
    requestedAt,
    ...args,
  };
};

type JoinGroupWaitingForElevator = {
  floorId: number,
  personId: string,
  direction: Direction,
};
export const joinGroupWaitingForElevator = (
  args: JoinGroupWaitingForElevator
) => ({
  type: JOIN_GROUP_WAITING_FOR_ELEVATOR,
  ...args,
});

type DispatchElevator = {
  elevatorId: number,
  floorId: number,
  elevatorRequestId: string,
};
export const dispatchElevator = (args: DispatchElevator) => ({
  type: DISPATCH_ELEVATOR,
  ...args,
});

type ElevatorArrivesAtFloor = { elevatorId: number, floorId: number };
export const elevatorArrivesAtFloor = (args: ElevatorArrivesAtFloor) => ({
  type: ELEVATOR_ARRIVES_AT_FLOOR,
  ...args,
});

type OpenElevatorDoors = { elevatorId: number };
export const openElevatorDoors = (args: OpenElevatorDoors) => ({
  type: OPEN_ELEVATOR_DOORS,
  ...args,
});

type FulfillElevatorRequest = {
  elevatorId: number,
  floorId: number,
  elevatorRequestId: string,
};
export const fulfillElevatorRequest = (args: FulfillElevatorRequest) => ({
  type: FULFILL_ELEVATOR_REQUEST,
  ...args,
});

type GeneratePerson = {
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
};
export const generatePerson = (args: GeneratePerson) => ({
  type: GENERATE_PERSON,
  person: {
    status: 'initialized',
    ...args,
  },
});

// NOTE: This action-creator is impure, generates random values.
type GenerateRandomPerson = { floorId: number, destinationFloorId: number };
export const generateRandomPerson = (args: GenerateRandomPerson) =>
  generatePerson({
    ...getRandomPersonAttrbutes(),
    ...args,
  });
