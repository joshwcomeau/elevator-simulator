// @flow
import update from 'immutability-helper';

import {
  INITIALIZE_BUILDING,
  DISPATCH_ELEVATOR,
  ELEVATOR_ARRIVES_AT_FLOOR,
  OPEN_ELEVATOR_DOORS,
  ENTER_ELEVATOR,
  FULFILL_ELEVATOR_REQUEST,
  CLOSE_ELEVATOR_DOORS,
  MOVE_ELEVATOR,
  AWAIT_FURTHER_INSTRUCTION,
} from '../actions';
import { range, mergeUnique } from '../utils';

import type { Action } from '../types';

export type DoorStatus = 'open' | 'closed';

// An idle elevator is sitting at a floor, waiting for a request.
type IdleElevator = {
  id: number,
  status: 'idle',
  floorId: number,
  doors: DoorStatus,
};

// An elevator is en-route when it is moving. This happens when an idle
// elevator receives a request, or when an occupied elevator is moving from
// origin floor to destination floor.
type EnRouteElevator = {
  id: number,
  status: 'en-route',
  elevatorRequestId: string,
  requestedFloorIds: Array<number>,
  doors: DoorStatus,
};

// Finally, when an elevator stops at a floor either to pick up mew passengers,
// or to unload existing ones, it's in boarding-disembarking state.
type BoardingDisembarkingElevator = {
  id: number,
  status: 'boarding-disembarking',
  floorId: number,
  requestedFloorIds: Array<number>,
  doors: DoorStatus,
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
          $merge: {
            status: 'en-route',
            elevatorRequestId: action.elevatorRequestId,
            requestedFloorIds: [action.floorId],
          },
        },
      });
    }

    case ELEVATOR_ARRIVES_AT_FLOOR: {
      return update(state, {
        [action.elevatorId]: {
          status: { $set: 'boarding-disembarking' },
          requestedFloorIds: { $apply: floorIds => floorIds.slice(1) },
        },
      });
    }

    case OPEN_ELEVATOR_DOORS: {
      return update(state, {
        [action.elevatorId]: {
          doors: { $set: 'open' },
        },
      });
    }

    case ENTER_ELEVATOR: {
      return update(state, {
        [action.elevatorId]: {
          requestedFloorIds: {
            $apply: floorIds => {
              const uniqueIds = mergeUnique(floorIds, [
                action.destinationFloorId,
              ]);

              // TODO: handle "bad actors" who request a direction, but then
              // select a floor in the opposite direction
              return uniqueIds.sort((a, b) => a - b);
            },
          },
        },
      });
    }

    case FULFILL_ELEVATOR_REQUEST: {
      return update(state, {
        [action.elevatorId]: {
          elevatorRequestId: { $set: null },
        },
      });
    }

    case CLOSE_ELEVATOR_DOORS: {
      return update(state, {
        [action.elevatorId]: {
          doors: { $set: 'closed' },
        },
      });
    }

    case MOVE_ELEVATOR: {
      return update(state, {
        [action.elevatorId]: {
          status: { $set: 'en-route' },
        },
      });
    }

    case AWAIT_FURTHER_INSTRUCTION: {
      return update(state, {
        [action.elevatorId]: {
          status: { $set: 'idle' },
        },
      });
    }

    default:
      return state;
  }
}
