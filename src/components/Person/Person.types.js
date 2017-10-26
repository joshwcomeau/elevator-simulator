// @flow
export type Shape = 'pentagon' | 'rectangle';

export type Status =
  | 'initialized'
  | 'waiting-for-elevator'
  | 'boarding-elevator'
  | 'exiting-elevator';
