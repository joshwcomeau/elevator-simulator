// @flow

export type Action = {
  type: string,
  [string]: any,
};

export type ActionCreator = (data: any) => Action;

export type Direction = 'up' | 'down';

export type RefCapturer = (elem: HTMLElement) => void;

// TODO: Should import the different sub-reducer types, maybe?
// Seems like a lot of trouble.
export type ReduxState = any;
