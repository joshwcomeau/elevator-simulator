import { combineReducers } from 'redux';

import elevators from './elevators.reducer';
import elevatorRequests from './elevator-requests.reducer';
import floors from './floors.reducer';
import people from './people.reducer';
import stats from './stats.reducer';

export default combineReducers({
  elevators,
  elevatorRequests,
  floors,
  people,
  stats,
});
