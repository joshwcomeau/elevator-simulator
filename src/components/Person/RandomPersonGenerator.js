// @flow
import React, { Component } from 'react';

import { colors } from '../../constants';
import { sample, random } from '../../utils';

import Person from './Person';
import { SHAPES, PATHS, COLORS } from './Person.data';

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

    this.size = this.props.size || random(25, 35);
    this.shape = this.props.shape || sample(SHAPES);
    this.color = this.props.color || sample(COLORS);
    this.walkSpeed = this.props.walkSpeed || random(1, 10) / 10;
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
