// @flow
/**
 * An Elevator consists of the shaft, as well as a single ElevatorCar?
 */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { elevatorArrivesAtFloor } from '../../actions';
import {
  COLORS,
  ELEVATOR_SHAFT_WIDTH,
  FLOOR_HEIGHT,
  ELEVATOR_DOOR_TRANSITION_LENGTH,
} from '../../constants';

import { getElevatorOffset } from './Elevator.helpers';

import type { ActionCreator, RefCapturer } from '../../types';
import type { DoorStatus } from '../../reducers/elevators.reducer';

type Props = {
  id: number,
  status: string,
  doors: DoorStatus,
  floorId: number,
  numFloors: number,
  requestedFloorIds: Array<number>,
  elevatorSpeed: number,
  elevatorRequestId?: string,
  refCapturer: RefCapturer,
  elevatorArrivesAtFloor: ActionCreator,
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

    const { numFloors, floorId } = props;

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
    const { numFloors, requestedFloorIds } = nextProps;
    const { currentY } = this.state;

    // Kick-start a new animation loop if the elevator is moving into 'en-route'.
    if (this.props.status !== 'en-route' && nextProps.status === 'en-route') {
      const [destinationFloorId] = requestedFloorIds;

      const destinationY = getElevatorOffset(destinationFloorId, numFloors);

      this.setState({ currentY, destinationY }, this.moveTowardsDestinationY);
    }
  }

  moveTowardsDestinationY = () => {
    const {
      id,
      elevatorSpeed,
      elevatorRequestId,
      requestedFloorIds,
      elevatorArrivesAtFloor,
    } = this.props;
    const { currentY, destinationY } = this.state;

    const distanceToDestination = Math.abs(currentY - destinationY);

    // This may be our last tick, if the distance to the elevator is less than
    // we can cover in a tick.
    if (distanceToDestination <= elevatorSpeed) {
      this.setState({ currentY: destinationY });

      elevatorArrivesAtFloor({
        elevatorId: id,
        floorId: requestedFloorIds[0],
        elevatorRequestId,
      });

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

  render() {
    const { doors, refCapturer } = this.props;
    const { currentY } = this.state;

    return (
      <ElevatorShaft innerRef={elem => (this.elem = elem)}>
        <ElevatorCarContainer style={{ transform: `translateY(${currentY}px` }}>
          <ElevatorCar innerRef={refCapturer}>
            <LeftElevatorDoor isOpen={doors === 'open'} />
            <RightElevatorDoor isOpen={doors === 'open'} />
          </ElevatorCar>
        </ElevatorCarContainer>
      </ElevatorShaft>
    );
  }
}

const ElevatorShaft = styled.div`
  background: rgba(0, 0, 0, 0.2);
  width: ${ELEVATOR_SHAFT_WIDTH}px;
`;

const ElevatorCarContainer = styled.div`
  width: ${ELEVATOR_SHAFT_WIDTH}px;
  height: ${FLOOR_HEIGHT - 6}px;
`;

const ElevatorCar = styled.div`
  width: ${ELEVATOR_SHAFT_WIDTH - 6}px;
  height: ${FLOOR_HEIGHT - 6}px;
  margin: 3px;
  background: ${COLORS.gray[50]};
  border-top: 7px solid #ddd;
  border-left: 10px solid #eee;
  border-right: 10px solid #eee;
  border-bottom: 3px solid #aaa;

  /* Hide overflow so that the doors can open/close */
  overflow: hidden;
`;

const ElevatorDoor = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(
    to bottom,
    ${COLORS.gray[100]},
    ${COLORS.gray[300]}
  );
  opacity: 0.8;
  transform: ${props => (props.isOpen ? `scaleX(0.08)` : `scaleX(1)`)};
  transition: transform ${ELEVATOR_DOOR_TRANSITION_LENGTH}ms;
`;

const LeftElevatorDoor = styled(ElevatorDoor)`
  left: 0;
  transform-origin: left;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
`;

const RightElevatorDoor = styled(ElevatorDoor)`
  right: 0;
  transform-origin: right;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
`;

const mapStateToProps = (state, ownProps) => {
  const elevatorData = state.elevators[ownProps.id];

  return {
    status: elevatorData.status,
    doors: elevatorData.doors,
    floorId: elevatorData.floorId,
    elevatorRequestId: elevatorData.elevatorRequestId,
    requestedFloorIds: elevatorData.requestedFloorIds,
    numFloors: state.floors.length,
  };
};

export default connect(mapStateToProps, { elevatorArrivesAtFloor })(Elevator);
