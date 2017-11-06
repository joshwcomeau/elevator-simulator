import React, { PureComponent } from 'react';
import Aux from 'react-aux';

import Building from '../Building';
import Statistics from '../Statistics';

class App extends PureComponent {
  render() {
    return (
      <Aux>
        <Building />
        <Statistics />
      </Aux>
    );
  }
}

export default App;
