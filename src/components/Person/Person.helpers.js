// @flow
import { sample, random } from '../../utils';

import {
  SHAPES,
  BODY_COLORS,
  FIRST_NAMES,
  LAST_NAMES,
  BASE_STEP_DURATION,
} from './Person.data';

export const getRandomPersonAttrbutes = () => {
  const firstName = sample(FIRST_NAMES);
  const lastName = sample(LAST_NAMES);

  const id = `${firstName}-${lastName}-${random(1000, 9999)}`;

  return {
    id,
    firstName,
    lastName,
    size: random(25, 40),
    shape: sample(SHAPES),
    color: sample(BODY_COLORS),
    patience: random(1, 10),
    walkSpeed: random(5, 10) / 10,
  };
};

/**
 * When the person reaches the elevators, they may need to push a button to
 * request one.
 * This method takes their SVG element and the button, and works out where
 * their arm has to end, in order to push the button.
 */
export const getDistanceToButton = ({
  svg,
  target,
  viewboxMultiplier,
}: {
  svg: HTMLElement,
  target: HTMLElement,
  viewboxMultiplier: number,
}) => {
  const buttonBox = target.getBoundingClientRect();
  const personBox = svg.getBoundingClientRect();

  const buttonCenter = {
    x: buttonBox.left + buttonBox.width / 2,
    y: buttonBox.top + buttonBox.height / 2,
  };

  // Get the distance, in pixels, from the top-left corner of our SVG person
  // to the center of the button.
  const distanceFromPerson = {
    x: buttonCenter.x - personBox.left,
    y: buttonCenter.y - personBox.top,
  };

  // Convert these screen-pixels into viewBox numbers.
  return {
    x: distanceFromPerson.x * viewboxMultiplier,
    y: distanceFromPerson.y * viewboxMultiplier,
  };
};

type animationArgs = { walkSpeed: number };

// We want the quickness of their steps to match the pace they'er translating
// across the screen; these two things are inversely correlatd (the FASTER the
// horizontal translation, the SMALLER the animation loop duration should be).
// The magic number 1.2 just _feels_ right, but at some point I should work out
// a proper formula.
export const getAnimationDuration = ({ walkSpeed }: animationArgs) =>
  (1.2 - walkSpeed) * BASE_STEP_DURATION;

export const getLeftLegAnimationDelay = ({ walkSpeed }: animationArgs) =>
  getAnimationDuration({ walkSpeed }) / 2;
