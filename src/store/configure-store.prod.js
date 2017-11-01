// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import requestElevatorSaga from '../sagas/request-elevator.saga';
import elevatorArrivesAtFloor from '../sagas/elevator-arrives-at-floor.saga';

export default function configureStore(initialState: any) {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(requestElevatorSaga);
  sagaMiddleware.run(elevatorArrivesAtFloor);

  return store;
}
