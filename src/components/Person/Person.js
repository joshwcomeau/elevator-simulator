// @flow
import React, { PureComponent } from 'react';

import { colors } from '../../constants';
import { sample } from '../../utils';


const PATHS = {
  pentagon: `
    M 100 43.48
    L 182.29 110
    L 150.86 200
    L 49.14 200
    L 17.71 110
  `,
  rectangle: `
    M 70 0
    L 130 0
    L 130 200
    L 70 200
  `,
};

const PATH_KEYS = Object.keys(PATHS);

const COLORS = [
  colors.orange[500],
];

type Props = {
  color?: string,
  shape?: 'pentagon' | 'rectangle',
  size: number,
  isWalking: boolean,
}

class Person extends PureComponent<Props> {
  static defaultProps = {
    size: 30,
    isWalking: false,
  }

  render() {
    const { size } = this.props;
    const color = this.props.color || sample(COLORS);
    const shape = this.props.shape || sample(PATH_KEYS);

    return (
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <path
          d={PATHS[shape]}
          stroke="none"
          fill={color}
        />
      </svg>
    )
  }
}

export default Person;
