// @flow
/**
 * An Elevator consists of the shaft, as well as a single ElevatorCar?
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ELEVATOR_SHAFT_WIDTH, FLOOR_HEIGHT } from '../../constants';

import { getElevatorOffset } from './Elevator.helpers';

type Props = {
  status: string,
  floorId: number,
  requestedFloorIds: Array<number>,
  elevatorSpeed: number,
  onRest: () => void,
};

type State = {
  currentY: number,
  destinationY: number,
}

class Elevator extends PureComponent<Props, State> {
  elem: HTMLElement;

  state = {
    currentY: 0,
    destinationY: 0,
  }

  static defaultProps = {
    elevatorSpeed: 10,
  };

  componentDidMount() {
    const { status, numFloors, requestedFloorIds } = nextProps;

    const currentY = getElevatorOffset()
  }

  componentWillReceiveProps(nextProps) {
    const { status, numFloors, requestedFloorIds } = nextProps;

    // Kick-start a new animation loop if the elevator is moving into 'en-route'.
    if (this.props.status !== 'en-route' && nextProps.status === 'en-route') {
      const [floorId] = requestedFloorIds;

      const currentY = this.elem.getBoundingClientRect().top;
      const destinationY = (numFloors - 1 - floorId) * FLOOR_HEIGHT;

      this.setState({ currentY, destinationY }, this.moveTowardsDestinationY)
    }
  }

  moveTowardsDestinationY = () => {
    // If we've arrived at the destination, we're done!
    const { currentY, destinationY } = this.state;
    const { elevatorSpeed } = this.props;

    const distanceToDestination = Math.abs(currentY - destinationY);

    if (distanceToDestination <= elevatorSpeed) {
      this.setState({ currentY: destinationY });

      this.finishMoving();

      return;
    }


  }

  finishMoving = () => {
    // TODO: This could either be responding to an elevator request, or
    // unloading one or more passengers, or both. Just dispatch a redux action
    // and let a saga deal with it?
  }

  render() {
    const { numFloors, requestedFloorIds } = this.props;

    return (
      <ElevatorShaft innerRef={elem => this.elem = elem}>
        <ElevatorCarContainer numFloors={numFloors} floor={floorId}>
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
  transition: transform 500ms;
`;

const ElevatorCar = styled.div`
  width: ${ELEVATOR_SHAFT_WIDTH - 6}px;
  height: ${FLOOR_HEIGHT - 6}px;
  margin: 3px;
  background: white;
`;

const mapStateToProps = (state, ownProps) => ({
  numFloors: state.floors.length,
  floorId: state.elevators[ownProps.id].floorId,
  status: state.elevators[ownProps.id].status,
});

export default connect(mapStateToProps)(Elevator);
