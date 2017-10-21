// @flow
import React from 'react';

import { colors } from '../../constants';
import { sample, random } from '../../utils';

import { PATHS, COLORS } from './Person.data';

const PATH_KEYS = Object.keys(PATHS);

const RandomPersonGenerator = (props: any) => {
  const randomizedProps = {
    ...props,
    shape: props.shape || sample(PATH_KEYS),
    color: props.color || sample(COLORS),
    patience: props.patience || random(10, 100),
    walkSpeed: props.walKSpeed || random(2, 10),
    size: props.size || random(25, 35),
  };

  return props.children(randomizedProps);
};

export default RandomPersonGenerator;
