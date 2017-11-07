// @flow
import update from 'immutability-helper';
import { createSelector } from 'reselect';

import {
  NEW_PERSON_ENTERS_BUILDING,
  REQUEST_ELEVATOR,
  JOIN_GROUP_WAITING_FOR_ELEVATOR,
  WALK_TOWARDS_ELEVATOR_DOORS,
  ENTER_ELEVATOR,
  EXIT_FROM_ELEVATOR,
  PERSON_CEASES_TO_EXIST,
} from '../actions';

import type { Action, PersonShape, ReduxState } from '../types';

//////////
export type BasePersonAttributes = {
  id: string,
  firstName: string,
  lastName: string,
  color: string,
  shape: PersonShape,
  size: number,
  patience: number, // UNUSED
  walkSpeed: number,
  destinationFloorId: number,
};

type InitializedState = {
  ...BasePersonAttributes,
  status: 'initialized',
  floorId: number,
};

type WaitingForElevatorState = {
  ...BasePersonAttributes,
  status: 'waiting-for-elevator',
  floorId: number,
  waitStart: Date,
};

type BoardingElevatorState = {
  ...BasePersonAttributes,
  status: 'boarding-elevator',
  floorId: number,
  elevatorId: number,
  positionWithinElevator: number,
  waitStart: Date,
};

type RidingElevatorState = {
  ...BasePersonAttributes,
  status: 'riding-elevator',
  elevatorId: number,
  positionWithinElevator: number,
  waitStart: Date,
  rideStart: Date,
};

type DisembarkingElevatorState = {
  ...BasePersonAttributes,
  status: 'disembarking-elevator',
  floorId: number,
  elevatorId: number,
  waitStart: Date,
  rideStart: Date,
  rideEnd: Date,
};

export type Person =
  | InitializedState
  | WaitingForElevatorState
  | BoardingElevatorState
  | RidingElevatorState
  | DisembarkingElevatorState;

type PeopleState = {
  [id: string]: Person,
};

const initialState: PeopleState = {};

//////////
export default function reducer(
  state: PeopleState = initialState,
  action: Action
) {
  switch (action.type) {
    case NEW_PERSON_ENTERS_BUILDING: {
      const { person } = action;
      const { id } = person;

      return update(state, {
        $merge: {
          [id]: person,
        },
      });
    }

    case REQUEST_ELEVATOR:
    case JOIN_GROUP_WAITING_FOR_ELEVATOR: {
      const { personId, waitStart } = action;

      return update(state, {
        [personId]: {
          $merge: {
            status: 'waiting-for-elevator',
            waitStart,
          },
        },
      });
    }

    case WALK_TOWARDS_ELEVATOR_DOORS: {
      const { peopleIds, elevatorId } = action;

      const stateCopy = { ...state };

      return peopleIds.reduce(
        (newState, id) => ({
          ...newState,
          [id]: {
            ...state[id],
            elevatorId,
            status: 'boarding-elevator',
          },
        }),
        stateCopy
      );
    }

    case ENTER_ELEVATOR: {
      const { personId, numberOfFolksAlreadyOnElevator, rideStart } = action;

      // A person's elevator position is an enum of -1, 0, 1.
      // the `0` position is right in the middle.
      // We use modulo to get repeating values 0, 1, 2, 0, 1, 2, ...
      // We subtract 1, to make it -1, 0, 1, -1, 0, 1, ...
      const positionWithinElevator = numberOfFolksAlreadyOnElevator;

      return update(state, {
        [personId]: {
          $merge: {
            floorId: null,
            status: 'riding-elevator',
            positionWithinElevator,
            rideStart,
          },
        },
      });
    }

    case EXIT_FROM_ELEVATOR: {
      const { personId, rideEnd } = action;

      const person = state[personId];

      return update(state, {
        [personId]: {
          $merge: {
            // If the person is exiting the elevator, I'm assuming that they've
            // arrived at their destination floor.
            floorId: person.destinationFloorId,
            status: 'disembarking-elevator',
            rideEnd,
          },
        },
      });
    }

    case PERSON_CEASES_TO_EXIST: {
      const { personId } = action;

      return update(state, {
        $unset: [personId],
      });
    }

    default:
      return state;
  }
}

export const getPeople = (state: ReduxState) => state.people;
// prettier-ignore
export const getPeopleArray = createSelector(
  getPeople,
  people => Object.values(people)
);

export const getPeopleOnElevator = (elevatorId: number, state: ReduxState) => {
  const peopleArray = getPeopleArray(state);

  return peopleArray.filter(
    person =>
      person.status === 'riding-elevator' && person.elevatorId === elevatorId
  );
};

export const getPeopleDisembarkedOnFloor = (
  floorId: number,
  state: ReduxState
) => {
  const peopleArray = getPeopleArray(state);

  return peopleArray.filter(
    person =>
      person.status === 'disembarking-elevator' && person.floorId === floorId
  );
};

export const getPeopleExitingElevatorFactory = (
  elevatorId: number,
  destinationFloorId: number
) => (state: ReduxState) => {
  const peopleArray = getPeopleArray(state);

  return peopleArray.filter(
    person =>
      person.status === 'riding-elevator' &&
      person.elevatorId === elevatorId &&
      person.destinationFloorId === destinationFloorId
  );
};
