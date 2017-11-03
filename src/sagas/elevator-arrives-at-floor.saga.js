// @flow
import { delay } from 'redux-saga';
import { take, put, select, takeEvery } from 'redux-saga/effects';

import {
  ELEVATOR_ARRIVES_AT_FLOOR,
  FINISH_BOARDING_ELEVATOR,
  openElevatorDoors,
  fulfillElevatorRequest,
  closeElevatorDoors,
  startBoardingElevator,
  moveElevator,
  exitFromElevator,
} from '../actions';
import { ELEVATOR_DOOR_TRANSITION_LENGTH } from '../constants';
import { getPeopleExitingElevatorFactory } from '../reducers/people.reducer';

// Main Saga handler
function* handleElevatorArrivesAtFloor(action) {
  const { elevatorId, floorId } = action;

  const elevator = yield select(state => state.elevators[elevatorId]);
  const { elevatorRequestId } = elevator;

  // Start by opening the elevator doors.
  yield put(openElevatorDoors({ elevatorId }));
  yield delay(ELEVATOR_DOOR_TRANSITION_LENGTH);

  if (elevatorRequestId) {
    // At this point, the request is considered "fulfilled"; the elevator has
    // arrived at the requested floor, and the doors have opened.
    yield put(
      fulfillElevatorRequest({
        elevatorId,
        elevatorRequestId,
        resolvedAt: new Date(),
      })
    );
  }

  // We know that our elevator will have just switched from 'en-route', to
  // fulfill an elevator request, or drop off some passengers, or both.

  // Start by checking if there are passengers on this elevator, and disembark
  // them. Add some delay so that the folks already on the floor ARE POLITE AND
  // DON'T TRY PUSHING THROUGH THEM.
  const peopleDisembarking = yield select(
    getPeopleExitingElevatorFactory(elevatorId, floorId)
  );

  for (const person of peopleDisembarking) {
    yield put(exitFromElevator({ personId: person.id }));
    yield delay(300);
  }

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

    // We want to wait until the final person has finished boarding the
    // elevator. Thankfully, we know how many folks we're waiting for!
    let peopleRemaining = peopleIds.length;
    while (peopleRemaining) {
      yield take(FINISH_BOARDING_ELEVATOR);
      peopleRemaining--;
    }
  }

  // Close the doors, let's get this show on the road!
  yield put(closeElevatorDoors({ elevatorId }));
  yield delay(ELEVATOR_DOOR_TRANSITION_LENGTH);

  // Figure out which floor we should move to.
  // Get the updated list of stops.
  const requestedFloorIds = yield select(
    state => state.elevators[elevatorId].requestedFloorIds
  );

  // Figure out the next stop
  // TODO: This shouldn't just be a FIFO list; it should sort them so that
  // it moves in a logical order & ignores requests in the opposite direction
  const nextStopFloorId = requestedFloorIds[0];
  yield put(moveElevator({ elevatorId, floorId: nextStopFloorId }));
}

function* listener(): Generator<*, *, *> {
  yield takeEvery(ELEVATOR_ARRIVES_AT_FLOOR, handleElevatorArrivesAtFloor);
}

export default listener;
