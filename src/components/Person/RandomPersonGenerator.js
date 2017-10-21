// @flow
import React, { Component } from 'react';

import { colors } from '../../constants';
import { sample, random } from '../../utils';

import { PATHS, COLORS } from './Person.data';

import type { Props as PersonProps } from './Person';
import type { Shape } from './Person.types';

const PATH_KEYS = Object.keys(PATHS);

type Props = PersonProps & {
  children: (props: PersonProps) => any,
};

class RandomPersonGenerator extends Component<Props> {
  shape: Shape;
  color: string;
  patience: number;
  walkSpeed: number;
  size: number;

  constructor(props: Props) {
    super(props);

    // For all of our person's missing props, generate random values.
    // Not bothering with state, since these are all constant values once
    // generated.
    this.shape = this.props.shape || sample(PATH_KEYS);
    this.color = this.props.color || sample(COLORS);
    this.patience = this.props.patience || random(10, 100);
    this.walkSpeed = this.props.walkSpeed || random(2, 10) / 10;
    this.size = this.props.size || random(25, 35);
  }

  render() {
    const { children, ...delegatedProps } = this.props;

    return children({
      ...delegatedProps,
      shape: this.shape,
      color: this.color,
      patience: this.patience,
      walkSpeed: this.walkSpeed,
      size: this.size,
    });
  }
}

export default RandomPersonGenerator;
