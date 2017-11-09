// @flow
import { createSelector } from 'reselect';
import update from 'immutability-helper';

import {
  REQUEST_ELEVATOR,
  JOIN_GROUP_WAITING_FOR_ELEVATOR,
  FULFILL_ELEVATOR_REQUEST,
} from '../actions';

import type { ReduxState, Action, ElevatorDirection } from '../types';

export type ElevatorRequest = {
  id: string,
  floorId: number,
  peopleIds: Array<number>,
  direction: ElevatorDirection,
  requestedAt: Date,
  resolvedAt?: Date,
};

export type ElevatorRequestsState = {
  [id: string]: ElevatorRequest,
};

export default function reducer(
  state: ElevatorRequestsState = {},
  action: Action
) {
  switch (action.type) {
    case REQUEST_ELEVATOR: {
      // Check if this request already exists, to prevent duplicating it.
      // (as in the real world, pressing the same "down" arrow over and over
      // won't make the elevators come any faster)
      if (state[action.id]) {
        return update(state, {
          [action.id]: {
            peopleIds: { $push: [action.personId] },
          },
        });
      }

      return update(state, {
        $merge: {
          [action.id]: {
            id: action.id,
            floorId: action.floorId,
            peopleIds: [action.personId],
            direction: action.direction,
            requestedAt: action.requestedAt,
          },
        },
      });
    }

    case JOIN_GROUP_WAITING_FOR_ELEVATOR: {
      // Find the existing request
      const requestId = Object.keys(state).find(
        id =>
          state[id].floorId === action.floorId &&
          state[id].direction === action.direction &&
          !state[id].resolvedAt
      );

      const request = state[requestId || ''];

      // If the request cannot be found for some odd reason, do nothing.
      if (!requestId || !request) {
        // Yeah, yeah, no side effects in reducers...
        // Really this shouldn't happen, though.
        console.warn(
          'Uh oh! No request found in `JOIN_GROUP_WAITING_FOR_ELEVATOR`'
        );

        return state;
      }

      return update(state, {
        [requestId]: {
          peopleIds: { $push: [action.personId] },
        },
      });
    }

    case FULFILL_ELEVATOR_REQUEST: {
      // There may be a request for the elevator at this floor.
      // If so, mark it as resolved.
      //
      // TODO: It's probably bad that we let these requests pile up to infinity.
      // The only thing we care about is the delta between request and resolve.
      // Should have a saga that does this precalculation, and maybe a different
      // reducer, all about 'efficiency metrics', can store it?
      return update(state, {
        [action.elevatorRequestId]: {
          resolvedAt: { $set: action.resolvedAt },
        },
      });
    }

    default:
      return state;
  }
}

// Selectors
const getElevatorRequests = state => state.elevatorRequests;

export const getElevatorRequestsArray = createSelector(
  getElevatorRequests,
  elevatorRequests => Object.values(elevatorRequests)
);

export const getActiveElevatorRequestsArray = createSelector(
  getElevatorRequestsArray,
  elevatorRequestsArray =>
    elevatorRequestsArray.filter(request => !request.resolvedAt)
);

export const getElevatorRequestsByFloor = (
  floorId: number,
  state: ReduxState
) => {
  const requestsArray = getElevatorRequestsArray(state);

  return requestsArray.filter(request => floorId === request.floorId);
};

export const getActiveElevatorRequestsByFloor = (
  floorId: number,
  state: ReduxState
) => {
  return getElevatorRequestsByFloor(floorId, state).filter(
    request => !request.resolvedAt
  );
};
