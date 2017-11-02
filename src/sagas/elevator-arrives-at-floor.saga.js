// @flow
import { delay } from 'redux-saga';
import { put, select, takeEvery } from 'redux-saga/effects';

import {
  ELEVATOR_ARRIVES_AT_FLOOR,
  openElevatorDoors,
  startBoardingElevator,
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

  // TODO: Start by checking if there are passengers on this elevator, and disembark
  // them. Add some delay so that the folks already on the floor ARE POLITE AND
  // DON'T TRY PUSHING THROUGH THEM.
  //
  // Next, check if this elevator is fulfilling a request.
  // If so, board the folks waiting.
  if (elevator.elevatorRequestId) {
    const elevatorRequest = yield select(
      state => state.elevatorRequests[elevator.elevatorRequestId]
    );

    const { peopleIds } = elevatorRequest;

    yield put(
      startBoardingElevator({
        peopleIds,
        elevatorId: elevator.id,
      })
    );
  }
}

function* listener(): Generator<*, *, *> {
  yield takeEvery(ELEVATOR_ARRIVES_AT_FLOOR, handleElevatorArrivesAtFloor);
}

export default listener;
