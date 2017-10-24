import { createStore } from 'redux';

import rootReducer from '../reducers';
import DevTools from '../components/DevTools';

export default function configureStore(initialState) {
  // prettier-ignore
  const store = createStore(
    rootReducer,
    initialState,
    DevTools.instrument()
  );

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  return store;
}
