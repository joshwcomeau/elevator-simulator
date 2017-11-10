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
import { getElevatorRequestsArray } from '../reducers/elevator-requests.reducer';

function* elevatorDutiesFulfilled(elevator) {
  // TODO: This is one of those things that ought to be tweakable with knobs.
  // Fetch customizations from state and use it to figure out what to do.

  // Find any unfulfilled requests
  const requests = yield select(getElevatorRequestsArray);

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
  console.log(
    'OPENING DOORS',
    openElevatorDoors({ elevatorId, elevatorRequestId })
  );
  yield put(openElevatorDoors({ elevatorId, elevatorRequestId }));

  // We know that our elevator will have just switched from 'en-route', to
  // fulfill an elevator request, or drop off some passengers, or both.

  // Start by checking if there are passengers on this elevator, and disembark
  // them. Add some delay so that the folks already on the floor ARE POLITE AND
  // DON'T TRY PUSHING THROUGH THEM.
  const peopleDisembarking = yield select(
    getPeopleExitingElevatorFactory(elevatorId, floorId)
  );

  // If folks are getting off, wait until the doors are mostly opened.
  // Otherwise,
  const anyoneGettingOff = peopleDisembarking.length > 0;

  yield delay(
    anyoneGettingOff
      ? ELEVATOR_DOOR_TRANSITION_LENGTH * 0.75
      : ELEVATOR_DOOR_TRANSITION_LENGTH * 0.25
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
  if (elevatorRequestId) {
    const elevatorRequest = yield select(
      state => state.elevatorRequests[elevatorRequestId]
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
    // TODO: This solution doesn't work for folks joining the group mid-board.
    // Rewrite to `select` the state on each loop and see if anyone new is
    // trying to get on.
    let peopleRemaining = peopleIds.length;
    while (peopleRemaining) {
      yield take(ENTER_ELEVATOR);
      peopleRemaining--;
    }

    // At this point, the request is considered "fulfilled";
    // All passengers have boarded it, and it's ready to go.
    // Let's delete the elevator request.
    yield put(
      fulfillElevatorRequest({
        elevatorId,
        elevatorRequestId,
      })
    );
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
