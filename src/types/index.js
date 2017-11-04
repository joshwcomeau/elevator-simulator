// @flow

export type Action = {
  type: string,
  [string]: any,
};
export type ActionCreator = (data: any) => Action;

export type RefCapturer = (elem: HTMLElement) => void;

// The possible directions for an elevator to be going
export type Direction = 'up' | 'down';

// The possible positions for a person to be standing within an elevator
export type PersonElevatorPosition = -1 | 0 | 1;

// TODO: Should import the different sub-reducer types, maybe?
// Seems like a lot of trouble.
export type ReduxState = any;
