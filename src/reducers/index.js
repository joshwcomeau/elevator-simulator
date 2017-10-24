import { combineReducers } from 'redux';

import elevators from './elevators.reducer';
import floors from './floors.reducer';

export default combineReducers({
  elevators,
  floors,
});
