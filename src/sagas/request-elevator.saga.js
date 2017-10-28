import { call, put, select, takeEvery } from 'redux-saga/effects';

import { REQUEST_ELEVATOR, dispatchElevator } from '../actions';

function* requestElevator(action) {
  // NOTE: The reducer receives this action, which creates the elevatorRequest.
  const elevatorRequest = yield select(
    state => state.elevatorRequests[action.id]
  );

  console.log({action})

  // If there are any idle elevators, send them to deal with this request.
  const elevators = yield select(state => state.elevators);
  const firstIdleElevator = elevators.find(
    elevator => elevator.status === 'idle'
  );

  if (firstIdleElevator) {
    yield put(dispatchElevator({
      elevatorId: firstIdleElevator.id,
      floorId: elevatorRequest.floorId,
      elevatorRequestId: action.id,
    }));
  }
}

function* listener() {
  yield takeEvery(REQUEST_ELEVATOR, requestElevator);
}

export default listener;
