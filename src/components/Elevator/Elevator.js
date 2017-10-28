// @flow
/**
 * An Elevator consists of the shaft, as well as a single ElevatorCar?
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ELEVATOR_SHAFT_WIDTH, FLOOR_HEIGHT } from '../../constants';

type Props = {
  numFloors: number,
  currentFloorId: number,
  status: string,
  onRest: () => void,
};

class Elevator extends PureComponent<Props> {
  render() {
    const { numFloors, currentFloorId } = this.props;

    return (
      <ElevatorShaft>
        <ElevatorCarContainer numFloors={numFloors} floor={currentFloorId}>
          <ElevatorCar />
        </ElevatorCarContainer>
      </ElevatorShaft>
    );
  }
}

const ElevatorShaft = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: ${ELEVATOR_SHAFT_WIDTH}px;
`;

const ElevatorCarContainer = styled.div`
  width: ${ELEVATOR_SHAFT_WIDTH}px;
  height: ${FLOOR_HEIGHT}px;
  transform: translateY(${props => (props.numFloors - props.floor - 1) * 100}%);
`;

const ElevatorCar = styled.div`
  width: ${ELEVATOR_SHAFT_WIDTH - 6}px;
  height: ${FLOOR_HEIGHT - 6}px;
  margin: 3px;
  background: white;
`;

const mapStateToProps = (state, ownProps) => ({
  numFloors: state.floors.length,
  currentFloorId: state.elevators[ownProps.id].currentFloorId,
  status: state.elevators[ownProps.id].status,
});

export default connect(mapStateToProps)(Elevator);
