// @flow
import { COLORS } from '../../constants';

import type { Shape } from './Person.types';

export const SHAPES: Array<Shape> = ['rectangle', 'pentagon'];

export const PATHS = {
  pentagon: `
    M 100 43.48
    L 182.29 110
    L 150.86 200
    L 49.14 200
    L 17.71 110
  `,
  rectangle: `
    M 60 0
    L 140 0
    L 140 200
    L 60 200
  `,
};

export const BODY_COLORS = [
  COLORS.red[500],
  COLORS.orange[500],
  COLORS.green[500],
  COLORS.blue[500],
  COLORS.purple[500],
];
