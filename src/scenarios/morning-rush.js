// @flow
import type { BasePersonAttributes } from '../reducers/people.reducer';
const delay = length =>
  new Promise(resolve => window.setTimeout(resolve, length));

type GeneratePerson = (person: BasePersonAttributes) => void;

export default {
  numFloors: 12,
  numElevators: 1,
  goals: {
    averageTotalTime: 20000,
  },
  events: async (generatePerson: GeneratePerson) => {
    await delay(500);
    console.log('boop');
    await delay(500);
    console.log('beep');
    await delay(500);
    console.log('boop');
    await delay(500);
    console.log('beep');
  },
};
