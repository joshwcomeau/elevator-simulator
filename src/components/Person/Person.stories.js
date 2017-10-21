// @flow
import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Person, { RandomPersonGenerator } from './index';

type Props = any;
type State = {
  isWalking: boolean,
};

class WalkingToggle extends Component<Props, State> {
  state = {
    isWalking: false,
  };

  render() {
    const { isWalking } = this.state;

    return (
      <div>
        <Person isWalking={isWalking} {...this.props} />
        <br />
        <button onClick={() => this.setState({ isWalking: !isWalking })}>
          Toggle
        </button>
      </div>
    );
  }
}

const shapes = ['pentagon', 'rectangle'];

shapes.forEach(shape => {
  storiesOf(`Person (${shape})`, module)
    .add('default', () => <Person shape={shape} />)
    .add('walking toggle', () => <WalkingToggle shape={shape} />);
});

storiesOf('RandomPersonGenerator', module)
  .add('default', () => (
    <RandomPersonGenerator>
      {randomizedProps => <Person {...randomizedProps} />}
    </RandomPersonGenerator>
  ))
  .add('another', () => (
    <RandomPersonGenerator>
      {randomizedProps => <Person {...randomizedProps} />}
    </RandomPersonGenerator>
  ));
