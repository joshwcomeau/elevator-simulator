// @flow
import { INITIALIZE_BUILDING, ELEVATOR_ARRIVE_AT_FLOOR } from '../actions';
import { range } from '../utils';

import type { Action } from '../types';

type IdleElevator = {
  id: number,
  status: 'idle',
  currentFloorId: number,
};

type EnRouteElevator = {
  id: number,
  status: 'en-route',
  elevatorRequestId: string,
  doors: 'open' | 'closed',
};

type OccupiedElevator = {
  id: number,
  status: 'occupied',
  requestedFloorIds: Array<number>,
  doors: 'open' | 'closed',
};

export type Elevator = IdleElevator | EnRouteElevator | OccupiedElevator;

export type ElevatorsState = Array<Elevator>;

export default function reducer(state: ElevatorsState = [], action: Action) {
  switch (action.type) {
    case INITIALIZE_BUILDING: {
      return range(action.numElevators).map(id => ({
        id,
        status: 'idle',
        currentFloorId: 0,
      }));
    }
    default:
      return state;
  }
}
