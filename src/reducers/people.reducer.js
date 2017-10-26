import { createSelector } from 'reselect';

import { GENERATE_PERSON } from '../actions';

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
  status: Status,
};

type PeopleState = {
  [id: string]: Person,
};

const initialState = {};

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
