// @flow
/**
 * An Elevator consists of the shaft, as well as a single ElevatorCar?
 */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { ELEVATOR_SHAFT_WIDTH } from '../../constants';

type Props = {
  numFloors: number,
  destinationFloor: number,
  onRest: () => void,
};

type State = {
  currentFloor: number,
};

class Elevator extends PureComponent<Props, State> {
  state = {
    currentFloor: 0,
  };

  render() {
    return <ElevatorShaft />;
  }
}

const ElevatorShaft = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: ${ELEVATOR_SHAFT_WIDTH}px;
`;

export default Elevator;
