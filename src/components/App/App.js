import React, { Component, PureComponent } from 'react';
import Person, { RandomPersonGenerator } from '../Person';

import { random, range } from '../../utils';

class PersonMover extends Component<any, { x: number }> {
  timeoutId: number;
  state = {
    x: 0,
  };

  componentDidMount() {
    this.timeoutId = window.setInterval(this.updatePosition, random(500, 1000));
  }

  componentWillUnmount() {
    window.clearInterval(this.timeoutId);
  }

  updatePosition = () => {
    this.setState({ x: random(0, 200) });
  };

  render() {
    return (
      <RandomPersonGenerator>
        {randomizedProps => (
          <Person {...randomizedProps} destinationX={this.state.x} />
        )}
      </RandomPersonGenerator>
    );
  }
}

class App extends PureComponent {
  render() {
    return range(30).map(i => <PersonMover key={i} />);
  }
}

export default App;
