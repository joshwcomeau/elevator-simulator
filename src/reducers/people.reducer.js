import { GENERATE_PERSON } from '../actions';

import type { Shape } from '../components/Person/Person.types';

type Person = {
  color: string,
  shape: Shape,
  patience: number,
  walkSpeed: number,
  floorIndex?: number,
  elevatorIndex?: number,
  currentLocationType: 'floor' | 'elevator',
  status:
    | 'initialized'
    | 'waiting-for-elevator'
    | 'boarding-elevator'
    | 'exiting-elevator',
};
const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
