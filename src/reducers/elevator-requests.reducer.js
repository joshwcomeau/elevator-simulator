// @flow
import { createSelector } from 'reselect';
import { REQUEST_ELEVATOR, JOIN_GROUP_WAITING_FOR_ELEVATOR } from '../actions';

import type { ReduxState, Action, Direction } from '../types';

export type ElevatorRequest = {
  id: string,
  floorId: number,
  peopleIds: Array<number>,
  direction: Direction,
  requestedAt: Date,
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
      // Check to see if there's already
      return {
        ...state,
        [action.id]: {
          id: action.id,
          floorId: action.floorId,
          peopleIds: [action.personId],
          direction: action.direction,
          requestedAt: action.requestedAt,
        },
      };
    }

    case JOIN_GROUP_WAITING_FOR_ELEVATOR: {
      // Find the existing request
      const requestId = Object.keys(state).find(
        id =>
          state[id].floorId === action.floorId &&
          // $FlowFixMe
          state[id].direction === action.direction
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

      return {
        ...state,
        [request.id]: {
          ...request,
          peopleIds: [...request.peopleIds, action.personId],
        },
      };
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
