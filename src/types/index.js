// @flow

/**
 * Generic types for React/Redux things
 */
export type Action = {
  type: string,
  [string]: any,
};
export type ActionCreator = (data: any) => Action;

export type RefCapturer = (elem: HTMLElement) => void;

//
/**
 * Specific types for Redux "models" and components
 */
export type ElevatorDirection = 'up' | 'down';

export type PersonShape = 'pentagon' | 'rectangle';
export type PersonStatus =
  | 'initialized'
  | 'waiting-for-elevator'
  | 'boarding-elevator'
  | 'riding-elevator'
  | 'disembarking-elevator';

export type ElevatorRequestStatus = 'awaiting-fulfillment' | 'boarding';

//
/**
 * Miscellaneous types
 */
// TODO: Should import the different sub-reducer types, maybe?
// Seems like a lot of trouble.
export type ReduxState = any;
