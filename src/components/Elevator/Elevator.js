// @flow
/**
 * An Elevator consists of the shaft, as well as a single ElevatorCar?
 */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

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
  width: 60px; /* TODO: dynamic? */
`;

export default Elevator;
