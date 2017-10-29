// @flow
import update from 'immutability-helper';
import {
  INITIALIZE_BUILDING,
  ELEVATOR_ARRIVES_AT_FLOOR,
  DISPATCH_ELEVATOR,
} from '../actions';
import { range } from '../utils';

import type { Action } from '../types';

// An idle elevator is sitting at a floor, waiting for a request.
type IdleElevator = {
  id: number,
  status: 'idle',
  floorId: number,
  doors: 'open' | 'closed',
};

// An elevator is en-route when it is moving. This happens when an idle
// elevator receives a request, or when an occupied elevator is moving from
// origin floor to destination floor.
type EnRouteElevator = {
  id: number,
  status: 'en-route',
  elevatorRequestId: string,
  requestedFloorIds: Array<number>,
  doors: 'open' | 'closed',
};

// Finally, when an elevator stops at a floor either to pick up mew passengers,
// or to unload existing ones, it's in boarding-disembarking state.
type BoardingDisembarkingElevator = {
  id: number,
  status: 'boarding-disembarking',
  floorId: number,
  requestedFloorIds: Array<number>,
  doors: 'open' | 'closed',
};

export type Elevator =
  | IdleElevator
  | EnRouteElevator
  | BoardingDisembarkingElevator;

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
          elevatorRequestId: { $set: action.elevatorRequestId },
          requestedFloorIds: { $set: [action.floorId] },
        },
      });
    }

    default:
      return state;
  }
}
