import { combineReducers } from 'redux';

import elevators from './elevators.reducer';
import elevatorRequests from './elevator-requests.reducer';
import floors from './floors.reducer';
import people from './people.reducer';

export default combineReducers({
  elevators,
  elevatorRequests,
  floors,
  people,
});
