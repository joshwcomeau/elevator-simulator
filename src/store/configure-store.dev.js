// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import requestElevatorSaga from '../sagas/request-elevator.saga';
import elevatorArrivesAtFloor from '../sagas/elevator-arrives-at-floor.saga';
import DevTools from '../components/DevTools';

export default function configureStore(initialState: any) {
  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  // prettier-ignore
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(sagaMiddleware),
      DevTools.instrument()
    )
  );

  sagaMiddleware.run(requestElevatorSaga);
  sagaMiddleware.run(elevatorArrivesAtFloor);

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  return store;
}
