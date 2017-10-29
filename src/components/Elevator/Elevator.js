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
  numFloors: number,
  requestedFloorIds: Array<number>,
  elevatorSpeed: number,
  onRest: () => void,
};

type State = {
  currentY: number,
  destinationY: number,
};

class Elevator extends PureComponent<Props, State> {
  elem: HTMLElement;
  animationFrameId: number;

  static defaultProps = {
    elevatorSpeed: 1,
  };

  constructor(props) {
    super(props);

    const { status, numFloors, floorId } = props;

    const currentY = getElevatorOffset(floorId, numFloors);
    // I'm assuming that all elevators initialize at their intended floor.
    // Because of that, destination === current.
    const destinationY = currentY;

    this.state = {
      currentY,
      destinationY,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { status, numFloors, requestedFloorIds } = nextProps;
    const { currentY } = this.state;

    console.log(this.props.status, nextProps.status, requestedFloorIds);

    // Kick-start a new animation loop if the elevator is moving into 'en-route'.
    if (this.props.status !== 'en-route' && nextProps.status === 'en-route') {
      const [destinationFloorId] = requestedFloorIds;

      const destinationY = getElevatorOffset(destinationFloorId, numFloors);

      this.setState({ currentY, destinationY }, this.moveTowardsDestinationY);
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

    const direction = destinationY > currentY ? 'down' : 'up';
    const offsetAmount = direction === 'down' ? elevatorSpeed : -elevatorSpeed;

    this.setState(
      state => ({
        currentY: state.currentY + offsetAmount,
      }),
      () => {
        this.animationFrameId = window.requestAnimationFrame(
          this.moveTowardsDestinationY
        );
      }
    );
  };

  finishMoving = () => {
    // TODO: This could either be responding to an elevator request, or
    // unloading one or more passengers, or both. Just dispatch a redux action
    // and let a saga deal with it?
  };

  render() {
    const { numFloors, floorId, requestedFloorIds } = this.props;
    const { currentY } = this.state;

    return (
      <ElevatorShaft innerRef={elem => (this.elem = elem)}>
        <ElevatorCarContainer style={{ transform: `translateY(${currentY}px` }}>
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
`;

const ElevatorCar = styled.div`
  width: ${ELEVATOR_SHAFT_WIDTH - 6}px;
  height: ${FLOOR_HEIGHT - 6}px;
  margin: 3px;
  background: white;
`;

const mapStateToProps = (state, ownProps) => {
  const elevatorData = state.elevators[ownProps.id];

  return {
    status: elevatorData.status,
    floorId: elevatorData.floorId,
    requestedFloorIds: elevatorData.requestedFloorIds,
    numFloors: state.floors.length,
  };
};

export default connect(mapStateToProps)(Elevator);
