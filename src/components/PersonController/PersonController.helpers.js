// @flow
import type { Direction } from '../../types';

export const getDirection = (
  floorId: number,
  destinationFloorId: number
): Direction => (destinationFloorId > floorId ? 'up' : 'down');

export const getButtonToPress = ({
  buttons,
  floorId,
  destinationFloorId,
}: {
  buttons: Array<HTMLElement>,
  floorId: number,
  destinationFloorId: number,
}) => {
  // On the first/last floor, there is no choice; only a single button.
  if (buttons.length === 1) {
    return buttons[0];
  }

  // For other floors, we want the first button if we're going up, and
  // the second button if we're going down.
  const direction: Direction = getDirection(floorId, destinationFloorId);

  return direction === 'up' ? buttons[0] : buttons[1];
};
