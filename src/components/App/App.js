import React, { PureComponent } from 'react';
import { Route } from 'react-router-dom';
import Aux from 'react-aux';

import Game from '../Game';

class App extends PureComponent {
  componentDidMount() {}

  render() {
    return (
      <Aux>
        <Route path="/scenarios/:slug" component={Game} />
      </Aux>
    );
  }
}

export default App;
