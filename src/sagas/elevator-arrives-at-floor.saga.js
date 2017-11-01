// @flow
import { delay } from 'redux-saga';
import { put, select, takeEvery } from 'redux-saga/effects';

import {
  ELEVATOR_ARRIVES_AT_FLOOR,
  openElevatorDoors,
  fulfillElevatorRequest,
} from '../actions';
import { ELEVATOR_DOOR_TRANSITION_LENGTH } from '../constants';

function* handleElevatorArrivesAtFloor(action) {
  const { elevatorId, floorId } = action;

  const elevator = yield select(state => state.elevators[elevatorId]);

  // Start by opening the elevator doors.
  yield put(openElevatorDoors({ elevatorId }));
  yield delay(ELEVATOR_DOOR_TRANSITION_LENGTH);

  // We know that our elevator will have just switched from 'en-route', to
  // fulfill an elevator request, or drop off some passengers, or both.
  // Start by checking if the elevator is fulfilling a request.
  if (elevator.elevatorRequestId) {
    yield put(
      fulfillElevatorRequest({
        elevatorId,
        floorId,
        elevatorRequestId: elevator.elevatorRequestId,
      })
    );
  }
}

function* listener(): Generator<*, *, *> {
  yield takeEvery(ELEVATOR_ARRIVES_AT_FLOOR, handleElevatorArrivesAtFloor);
}

export default listener;
