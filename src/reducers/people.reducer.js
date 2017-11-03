import { createSelector } from 'reselect';

import {
  NEW_PERSON_ENTERS_BUILDING,
  REQUEST_ELEVATOR,
  JOIN_GROUP_WAITING_FOR_ELEVATOR,
  START_BOARDING_ELEVATOR,
  FINISH_BOARDING_ELEVATOR,
  EXIT_FROM_ELEVATOR,
} from '../actions';

import type { Shape, Status } from '../components/Person/Person.types';
import type { Action } from '../types';

type BasePersonAttributes = {
  id: string,
  firstName: string,
  lastName: string,
  color: string,
  shape: Shape,
  patience: number,
  walkSpeed: number,
  destinationFloorId: number,
  status: Status,
};

type PersonOnFloor = {
  ...BasePersonAttributes,
  floorId: number,
};

type PersonOnElevator = {
  ...BasePersonAttributes,
  elevatorId: number,
};

type PersonBoardingElevator = {
  ...BasePersonAttributes,
  floorId: number,
  elevatorId: number,
};

export type Person = PersonOnFloor | PersonBoardingElevator | PersonOnElevator;

type PeopleState = {
  [id: string]: Person,
};

const initialState: PeopleState = {};

export default function reducer(
  state: PeopleState = initialState,
  action: Action
) {
  switch (action.type) {
    case NEW_PERSON_ENTERS_BUILDING: {
      const { person, person: { id } } = action;

      return {
        ...state,
        [id]: person,
      };
    }

    case REQUEST_ELEVATOR:
    case JOIN_GROUP_WAITING_FOR_ELEVATOR: {
      const { personId } = action;
      const person = state[personId];

      return {
        ...state,
        [personId]: {
          ...person,
          status: 'waiting-for-elevator',
        },
      };
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
      const { personId } = action;

      return {
        ...state,
        [personId]: {
          ...state[personId],
          floorId: null,
          status: 'riding-elevator',
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

export const getPeople = state => state.people;
// prettier-ignore
export const getPeopleArray = createSelector(
  getPeople,
  people => Object.values(people)
);

export const getPeopleOnElevatorFactory = (elevatorId: number) => state => {
  const peopleArray = getPeopleArray(state);

  return peopleArray.filter(
    person =>
      person.status === 'riding-elevator' && person.elevatorId === elevatorId
  );
};

export const getPeopleExitingElevatorFactory = (
  elevatorId: number,
  destinationFloorId: number
) => state => {
  const peopleArray = getPeopleArray(state);

  return peopleArray.filter(
    person =>
      person.status === 'riding-elevator' &&
      person.elevatorId === elevatorId &&
      person.destinationFloorId === destinationFloorId
  );
};
