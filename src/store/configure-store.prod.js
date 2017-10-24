import { createStore } from 'redux';

import rootReducer from '../reducers';
import { handleStoreUpdates } from '../helpers/local-storage.helpers';

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState);

  return store;
}
