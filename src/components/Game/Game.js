import React from 'react';
import { connect } from 'react-redux';
import Aux from 'react-aux';

import { newPersonEntersBuilding } from '../../actions';
import scenarios from '../../scenarios';

import Building from '../Building';
import Statistics from '../Statistics';

const Game = ({ match }) => {
  // TODO: Handle 'scenario not found' 404
  const scenario = scenarios[match.params.slug];

  return (
    <Aux>
      <Building
        numFloors={scenario.numFloors}
        numElevators={scenario.numElevators}
      />
      <Statistics />
    </Aux>
  );
};

export default connect(null, { newPersonEntersBuilding })(Game);
