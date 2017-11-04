// @flow
import update from 'immutability-helper';
import { createSelector } from 'reselect';

import {
  NEW_PERSON_ENTERS_BUILDING,
  REQUEST_ELEVATOR,
  JOIN_GROUP_WAITING_FOR_ELEVATOR,
  START_BOARDING_ELEVATOR,
  FINISH_BOARDING_ELEVATOR,
  EXIT_FROM_ELEVATOR,
} from '../actions';

import type {
  Action,
  PersonElevatorPosition,
  PersonShape,
  PersonStatus,
  ReduxState,
} from '../types';

//
type BasePersonAttributes = {
  id: string,
  firstName: string,
  lastName: string,
  color: string,
  shape: PersonShape,
  patience: number,
  walkSpeed: number,
  destinationFloorId: number,
  status: PersonStatus,
};

type PersonOnFloor = {
  ...BasePersonAttributes,
  floorId: number,
};

type PersonOnElevator = {
  ...BasePersonAttributes,
  elevatorId: number,
  positionWithinElevator: PersonElevatorPosition,
};

type PersonBoardingElevator = {
  ...BasePersonAttributes,
  floorId: number,
  elevatorId: number,
  positionWithinElevator: PersonElevatorPosition,
};

export type Person = PersonOnFloor | PersonBoardingElevator | PersonOnElevator;

type PeopleState = {
  [id: string]: Person,
};

const initialState: PeopleState = {};

//
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
      const { personId } = action;
      const person = state[personId];

      return update(state, {
        [personId]: {
          status: { $set: 'waiting-for-elevator' },
        },
      });
    }

    case START_BOARDING_ELEVATOR: {
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

    case FINISH_BOARDING_ELEVATOR: {
      const { personId, numberOfFolksAlreadyOnElevator } = action;

      // A person's elevator position is an enum of -1, 0, 1.
      // the `0` position is right in the middle.
      // We use modulo to get repeating values 0, 1, 2, 0, 1, 2, ...
      // We subtract 1, to make it -1, 0, 1, -1, 0, 1, ...
      const elevatorPosition = numberOfFolksAlreadyOnElevator % 3 - 1;

      return {
        ...state,
        [personId]: {
          ...state[personId],
          floorId: null,
          status: 'riding-elevator',
          elevatorPosition,
        },
      };
    }

    case EXIT_FROM_ELEVATOR: {
      const { personId } = action;

      const person = state[personId];

      // If the person is exiting the elevator, I'm assuming that they've
      // arrived at their destination floor.
      return {
        ...state,
        [personId]: {
          ...person,
          floorId: person.destinationFloorId,
          elevatorId: null,
          status: 'arrived-at-destination',
        },
      };
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

// prettier-ignore
export const getPeopleOnElevatorFactory = (elevatorId: number) => (
  (state: ReduxState) => {
    const peopleArray = getPeopleArray(state);

    return peopleArray.filter(
      person =>
        person.status === 'riding-elevator' && person.elevatorId === elevatorId
    );
  }
);

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
