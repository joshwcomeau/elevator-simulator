import { sample, random } from '../../utils';

import { SHAPES, PATHS, BODY_COLORS } from './Person.data';

// prettier-ignore
const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael',
  'Elizabeth', 'William', 'Linda', 'David', 'Barbara', 'Richard', 'Susan',
  'Joseph', 'Jessica', 'Thomas', 'Margaret', 'Charles', 'Sarah', 'Christopher',
  'Karen', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Lisa',
]; // 28

// prettier-ignore
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia',
  'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas',
  'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez',
  'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez',
]; // 29

export const getRandomPersonAttrbutes = () => {
  const firstName = sample(FIRST_NAMES);
  const lastName = sample(LAST_NAMES);

  const id = `${firstName}-${lastName}-${random(1000, 9999)}`;

  return {
    id,
    firstName,
    lastName,
    size: random(25, 35),
    shape: sample(SHAPES),
    color: sample(BODY_COLORS),
    patience: random(1, 10),
    walkSpeed: random(1, 10) / 10,
  };
};
