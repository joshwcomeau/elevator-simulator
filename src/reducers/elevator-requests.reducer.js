// @flow
import { createSelector } from 'reselect';
import { REQUEST_ELEVATOR } from '../actions';

import type { ReduxState, Action, Direction } from '../types';

export type ElevatorRequest = {
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
          floorId: action.floorId,
          direction: action.direction,
          requestedAt: action.requestedAt,
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
