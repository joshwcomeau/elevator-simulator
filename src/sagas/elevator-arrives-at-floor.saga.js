// @flow
import { delay } from 'redux-saga';
import { take, put, select, takeEvery } from 'redux-saga/effects';

import {
  ELEVATOR_ARRIVES_AT_FLOOR,
  ENTER_ELEVATOR,
  openElevatorDoors,
  fulfillElevatorRequest,
  closeElevatorDoors,
  walkTowardsElevatorDoors,
  moveElevator,
  exitFromElevator,
  awaitFurtherInstruction,
  dispatchElevator,
} from '../actions';
import { ELEVATOR_DOOR_TRANSITION_LENGTH } from '../constants';
import { sortByDescending } from '../utils';
import { getPeopleExitingElevatorFactory } from '../reducers/people.reducer';
import { getActiveElevatorRequestsArray } from '../reducers/elevator-requests.reducer';

function* elevatorDutiesFulfilled(elevator) {
  // TODO: This is one of those things that ought to be tweakable with knobs.
  // Fetch customizations from state and use it to figure out what to do.

  // Find any unfulfilled requests
  const requests = yield select(getActiveElevatorRequestsArray);

  // If there are none, our work is done. Let's set the elevator to 'idle'
  // and wait for someone to request it.
  if (requests.length === 0) {
    yield put(awaitFurtherInstruction({ elevatorId: 0 }));
    return;
  }

  // Get the one closest to this elevator, in either direction
  const [closestRequest] = requests.sort(
    (a, b) =>
      Math.abs(elevator.floorId - a.floorId) -
      Math.abs(elevator.floorId - b.floorId)
  );

  yield put(
    dispatchElevator({
      elevatorId: elevator.id,
      floorId: closestRequest.floorId,
      elevatorRequestId: closestRequest.id,
    })
  );
}

// Main Saga handler
function* handleElevatorArrivesAtFloor(action) {
  const { elevatorId, floorId } = action;

  const elevator = yield select(state => state.elevators[elevatorId]);
  const { elevatorRequestId } = elevator;

  // Start by opening the elevator doors.
  yield put(openElevatorDoors({ elevatorId }));
  // Originally, I was waiting until the doors were 100% open before moving on,
  // but this was unrealistic and felt robotic. Now they start moving almost
  // immediately after the doors start to open.
  yield delay(ELEVATOR_DOOR_TRANSITION_LENGTH / 4);

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

  // People should exit in the reverse order that they entered.
  // This is both for realism, but also because it looks buggy when 2D shapes
  // suddenly change their stacking order.
  const peopleDisembarkingOrdered = sortByDescending(
    'positionWithinElevator',
    peopleDisembarking
  );

  for (const person of peopleDisembarkingOrdered) {
    yield put(
      exitFromElevator({
        personId: person.id,
        waitStart: person.waitStart,
        rideStart: person.rideStart,
      })
    );
    yield delay(500);
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
      walkTowardsElevatorDoors({
        peopleIds,
        elevatorId: elevator.id,
      })
    );

    // We want to wait until the final person has finished boarding the
    // elevator. Thankfully, we know how many folks we're waiting for!
    let peopleRemaining = peopleIds.length;
    while (peopleRemaining) {
      yield take(ENTER_ELEVATOR);
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

  if (requestedFloorIds.length === 0) {
    yield elevatorDutiesFulfilled(elevator);
    return;
  }

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
