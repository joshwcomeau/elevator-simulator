// @flow
import { createSelector } from 'reselect';

import { EXIT_FROM_ELEVATOR } from '../actions';
import { roundedMean } from '../utils';

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
    case EXIT_FROM_ELEVATOR: {
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

// Selectors
const getStats = state => state.stats;

// prettier-ignore
export const getAverageStats = createSelector(
  getStats,
  stats => ({
    averageWait: stats.waitTimes.length ? roundedMean(stats.waitTimes) : null,
    averageRide: stats.rideTimes.length ? roundedMean(stats.rideTimes) : null,
    averageTotal: stats.totalTimes.length ? roundedMean(stats.totalTimes) : null,
  })
);
