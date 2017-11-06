// @flow
import { COLORS } from '../../constants';

import type { PersonShape } from '../../types';

export const SHAPES: Array<PersonShape> = ['rectangle', 'pentagon'];

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

// prettier-ignore
export const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael',
  'Elizabeth', 'William', 'Linda', 'David', 'Barbara', 'Richard', 'Susan',
  'Joseph', 'Jessica', 'Thomas', 'Margaret', 'Charles', 'Sarah', 'Christopher',
  'Karen', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Lisa',
]; // 28

// prettier-ignore
export const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
  'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas',
  'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
  'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez',
]; // 29

export const BASE_STEP_DURATION = 500;
export const BASE_POKE_DURATION = 350;
