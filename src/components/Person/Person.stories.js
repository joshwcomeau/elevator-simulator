import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Person from './Person';

storiesOf('Person', module)
  .add('Default', () => <Person />)
  .add('Walking', () => <Person />);
