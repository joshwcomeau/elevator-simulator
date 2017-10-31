import { createSelector } from 'reselect';

import {
  GENERATE_PERSON,
  REQUEST_ELEVATOR,
  JOIN_GROUP_WAITING_FOR_ELEVATOR,
  FULFILL_ELEVATOR_REQUEST,
} from '../actions';

import type { Shape, Status } from '../components/Person/Person.types';
import type { Action } from '../types';

export type Person = {
  id: string,
  firstName: string,
  lastName: string,
  color: string,
  shape: Shape,
  patience: number,
  walkSpeed: number,
  floorId?: number,
  elevatorId?: number,
  destinationFloorId: number,
  status: Status,
};

type PeopleState = {
  [id: string]: Person,
};

const initialState: PeopleState = {};

export default function reducer(
  state: PeopleState = initialState,
  action: Action
) {
  switch (action.type) {
    case GENERATE_PERSON: {
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

    case FULFILL_ELEVATOR_REQUEST: {
      // TODO: Find all the people on this elevator, going to this floor.
      return state;
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
