// @flow
import { PERSON_CEASES_TO_EXIST } from '../actions';

import type { Action } from '../types';

type StatsState = {
  // The time between a user pushing the up/down arrow (or, joining a group),
  // and the user climbing aboard the elevator
  waitTimes: Array<number>,
  // The time between a user boarding the elevator, and debarking the elevator
  rideTimes: Array<number>,
  // Wait + ride time
  totalTimes: Array<number>,
};

const initialState: StatsState = {
  waitTimes: [],
  rideTimes: [],
  totalTimes: [],
};

export default function reducer(
  state: StatsState = initialState,
  action: Action
) {
  switch (action.type) {
    case PERSON_CEASES_TO_EXIST: {
      const { waitStart, rideStart, rideEnd } = action;

      const waitTime = rideStart - waitStart;
      const rideTime = rideEnd - rideStart;
      const totalTime = waitTime + rideTime;

      return {
        ...state,
        waitTimes: [...state.waitTimes, waitTime],
        rideTimes: [...state.rideTimes, rideTime],
        totalTimes: [...state.totalTimes, totalTime],
      };
    }

    default:
      return state;
  }
}
