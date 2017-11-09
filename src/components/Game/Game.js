import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Aux from 'react-aux';

import { newPersonEntersBuilding } from '../../actions';
import scenarios from '../../scenarios';

import Building from '../Building';
import Statistics from '../Statistics';

import type { ActionCreator } from '../../types';

type Props = {
  match: any, // from React Router
  newPersonEntersBuilding: ActionCreator,
};

class Game extends PureComponent<Props> {
  constructor(props) {
    super(props);
    // TODO: Handle 'scenario not found' 404
    const scenario = scenarios[props.match.params.slug];

    this.state = {
      scenario,
    };
  }

  componentDidMount() {
    this.startScenarioGeneration();
  }

  startScenarioGeneration() {
    const { newPersonEntersBuilding } = this.props;
    const { scenario } = this.state;

    // TODO: Handle resetting?

    scenario.run(newPersonEntersBuilding);
  }

  render() {
    const { scenario } = this.state;

    return (
      <Aux>
        <Building
          numFloors={scenario.numFloors}
          numElevators={scenario.numElevators}
        />
        <Statistics />
      </Aux>
    );
  }
}

export default connect(null, { newPersonEntersBuilding })(Game);
