// @flow
import type { PersonShape, ElevatorDirection } from '../types';

//
// Action Types
export const INITIALIZE_BUILDING = 'INITIALIZE_BUILDING';
export const NEW_PERSON_ENTERS_BUILDING = 'NEW_PERSON_ENTERS_BUILDING';
export const REQUEST_ELEVATOR = 'REQUEST_ELEVATOR';
export const JOIN_GROUP_WAITING_FOR_ELEVATOR =
  'JOIN_GROUP_WAITING_FOR_ELEVATOR';
export const DISPATCH_ELEVATOR = 'DISPATCH_ELEVATOR';
export const ELEVATOR_ARRIVES_AT_FLOOR = 'ELEVATOR_ARRIVES_AT_FLOOR';
export const OPEN_ELEVATOR_DOORS = 'OPEN_ELEVATOR_DOORS';
export const CLOSE_ELEVATOR_DOORS = 'CLOSE_ELEVATOR_DOORS';
// TODO: Better names for these next 2 actions. It's not an API call :/
export const WALK_TOWARDS_ELEVATOR_DOORS = 'WALK_TOWARDS_ELEVATOR_DOORS';
export const ENTER_ELEVATOR = 'ENTER_ELEVATOR';
export const FULFILL_ELEVATOR_REQUEST = 'FULFILL_ELEVATOR_REQUEST';
export const MOVE_ELEVATOR = 'MOVE_ELEVATOR';
export const EXIT_FROM_ELEVATOR = 'EXIT_FROM_ELEVATOR';
export const PERSON_CEASES_TO_EXIST = 'PERSON_CEASES_TO_EXIST';

//
// Action Creators
type InitializeBuilding = { numFloors: number, numElevators: number };
export const initializeBuilding = (args: InitializeBuilding) => ({
  type: INITIALIZE_BUILDING,
  ...args,
});

type NewPersonEntersBuilding = {
  id: string,
  firstName: string,
  lastName: string,
  shape: PersonShape,
  size: number,
  color: string,
  patience: number,
  walkSpeed: number,
  floorId: number,
  destinationFloorId: number,
};
export const newPersonEntersBuilding = (args: NewPersonEntersBuilding) => ({
  type: NEW_PERSON_ENTERS_BUILDING,
  person: {
    status: 'initialized',
    ...args,
  },
});

type RequestElevator = {
  personId: string,
  floorId: number,
  direction: ElevatorDirection,
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
  direction: ElevatorDirection,
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

type ElevatorArrivesAtFloor = {
  elevatorId: number,
  floorId: number,
  elevatorRequestId: string,
};
export const elevatorArrivesAtFloor = (args: ElevatorArrivesAtFloor) => ({
  type: ELEVATOR_ARRIVES_AT_FLOOR,
  ...args,
});

type OpenElevatorDoors = { elevatorId: number };
export const openElevatorDoors = (args: OpenElevatorDoors) => ({
  type: OPEN_ELEVATOR_DOORS,
  ...args,
});

type CloseElevatorDoors = { elevatorId: number };
export const closeElevatorDoors = (args: CloseElevatorDoors) => ({
  type: CLOSE_ELEVATOR_DOORS,
  ...args,
});

type WalkTowardsElevatorDoors = {
  peopleIds: Array<string>,
  elevatorId: number,
};
export const walkTowardsElevatorDoors = (args: WalkTowardsElevatorDoors) => ({
  type: WALK_TOWARDS_ELEVATOR_DOORS,
  ...args,
});

type EnterElevator = {
  personId: string,
  elevatorId: number,
  destinationFloorId: number,
  numberOfFolksAlreadyOnElevator: number,
};
export const enterElevator = (args: EnterElevator) => ({
  type: ENTER_ELEVATOR,
  ...args,
});

type FulfillElevatorRequest = {
  elevatorId: number,
  elevatorRequestId: string,
  resolvedAt: Date,
};
export const fulfillElevatorRequest = (args: FulfillElevatorRequest) => ({
  type: FULFILL_ELEVATOR_REQUEST,
  ...args,
});

type MoveElevator = { elevatorId: number, floorId: number };
export const moveElevator = (args: MoveElevator) => ({
  type: MOVE_ELEVATOR,
  ...args,
});

type ExitFromElevator = { personId: string };
export const exitFromElevator = (args: ExitFromElevator) => ({
  type: EXIT_FROM_ELEVATOR,
  ...args,
});

// 💀
type PersonCeasesToExist = { personId: string };
export const personCeasesToExist = (args: PersonCeasesToExist) => ({
  type: PERSON_CEASES_TO_EXIST,
  ...args,
});
