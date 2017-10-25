// @flow
import { INITIALIZE_BUILDING } from '../actions';
import { range } from '../utils';

import type { Action } from '../types';

export type Floor = { id: number };
export type FloorsState = Array<Floor>;

export default function reducer(state: FloorsState = [], action: Action) {
  switch (action.type) {
    case INITIALIZE_BUILDING: {
      return range(action.numFloors).map(id => ({ id }));
    }

    default:
      return state;
  }
}
