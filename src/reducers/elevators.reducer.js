// @flow
import update from 'immutability-helper';
import { INITIALIZE_BUILDING, ELEVATOR_ARRIVES_AT_FLOOR, DISPATCH_ELEVATOR } from '../actions';
import { range } from '../utils';

import type { Action } from '../types';

type IdleElevator = {
  id: number,
  status: 'idle',
  floorId: number,
  doors: 'open' | 'closed',
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
        floorId: 0,
        doors: 'closed',
      }));
    }

    case DISPATCH_ELEVATOR: {
      return update(state, {
        [action.elevatorId]: {
          status: { $set: 'en-route' },
          floorId: { $set: action.floorId },
          elevatorRequestId: { $set: action.elevatorRequestId },
        },
      })
    }

    default:
      return state;
  }
}
