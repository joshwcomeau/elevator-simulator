export const COLORS = {
  red: {
    100: '#FFCDD2',
    300: '#E57373',
    500: '#F44336',
    700: '#D32F2F',
    900: '#B71C1C',
  },
  orange: {
    100: '#FFECB3',
    300: '#FFD54F',
    500: '#FFC107',
    700: '#FFA000',
    900: '#FF6F00',
  },
  green: {
    100: '#DCEDC8',
    300: '#AED581',
    500: '#8BC34A',
    700: '#689F38',
    900: '#33691E',
  },
  blue: {
    100: '#B3E5FC',
    300: '#4FC3F7',
    500: '#03A9F4',
    700: '#0288D1',
    900: '#01579B',
  },
  purple: {
    100: '#E1BEE7',
    300: '#BA68C8',
    500: '#9C27B0',
    700: '#7B1FA2',
    900: '#4A148C',
  },
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    300: '#E0E0E0',
    500: '#9E9E9E',
    700: '#616161',
    900: '#212121',
  },
};

export const ELEVATOR_SHAFT_WIDTH = 66;
export const FLOOR_HEIGHT = 80;
export const FLOOR_BORDER_WIDTH = 6;

export const ELEVATOR_DOOR_TRANSITION_LENGTH = 1250;

// Z Indices
export const ELEVATORS_ZINDEX = 5;
export const FLOORS_ZINDEX = 10;
export const PERSON_ZINDEX_MIN = 1;
// We need to manually specify the z-indices of individual people when they
// disembark from the elevator, to ensure that the folks who get off first stay
// in front of those behind them.
export const PERSON_ZINDEX_MAX = 1000;
