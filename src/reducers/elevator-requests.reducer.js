// @flow
import { createSelector } from 'reselect';
import update from 'immutability-helper';

import {
  REQUEST_ELEVATOR,
  JOIN_GROUP_WAITING_FOR_ELEVATOR,
  FULFILL_ELEVATOR_REQUEST,
  OPEN_ELEVATOR_DOORS,
} from '../actions';

import type {
  ReduxState,
  Action,
  ElevatorDirection,
  ElevatorRequestStatus,
} from '../types';

export type ElevatorRequest = {
  id: string,
  floorId: number,
  peopleIds: Array<number>,
  direction: ElevatorDirection,
  status: ElevatorRequestStatus,
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
            status: 'awaiting-fulfillment',
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
          state[id].status !== 'resolved'
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

    case OPEN_ELEVATOR_DOORS: {
      // When an elevator's doors open, it may be because it's fulfilling a
      // request. We want to set the status to `boarding`, but only if there IS
      // a corresponding request; it may just be delivering passengers.
      if (!action.elevatorRequestId) {
        return state;
      }

      return update(state, {
        [action.elevatorRequestId]: {
          status: { $set: 'boarding' },
        },
      });
    }

    case FULFILL_ELEVATOR_REQUEST: {
      return update(state, {
        $unset: [action.elevatorRequestId],
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

export const getElevatorRequestsByFloor = (
  floorId: number,
  state: ReduxState
) => {
  const requestsArray = getElevatorRequestsArray(state);

  return requestsArray.filter(request => floorId === request.floorId);
};
