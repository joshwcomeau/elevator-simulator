// @flow
import React, { Component } from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { random } from '../../utils';

import Person, { RandomPersonGenerator } from './index';

class WalkingToggle extends Component<any, { isWalking: boolean }> {
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

class PersonMover extends Component<any, { x: number }> {
  timeoutId: number;
  state = {
    x: 0,
  };

  componentDidMount() {
    this.timeoutId = window.setInterval(this.updatePosition, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timeoutId);
  }

  updatePosition = () => {
    this.setState({ x: random(0, 200) });
  };

  render() {
    return <Person destinationX={this.state.x} />;
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

storiesOf('PersonMover', module)
  .add('default', () => <PersonMover />)
  .add('multiple people', () => [
    <PersonMover key="1" />,
    <PersonMover key="2" />,
    <PersonMover key="3" />,
  ]);
