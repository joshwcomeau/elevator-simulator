// @flow
import { delayPromise as delay } from '../utils';
import type { BasePersonAttributes } from '../reducers/people.reducer';

import { getRandomPersonAttrbutes } from '../components/Person/Person.helpers';

type GeneratePerson = (person: BasePersonAttributes) => void;

export default {
  numFloors: 12,
  numElevators: 1,
  goals: {
    averageTotalTime: 20000,
  },
  run: async (generatePerson: GeneratePerson) => {
    await delay(500);
    generatePerson({
      ...getRandomPersonAttrbutes(),
      floorId: 0,
      destinationFloorId: 4,
    });

    await delay(500);
    generatePerson({
      ...getRandomPersonAttrbutes(),
      floorId: 0,
      destinationFloorId: 3,
    });

    await delay(500);
    generatePerson({
      ...getRandomPersonAttrbutes(),
      floorId: 0,
      destinationFloorId: 8,
    });

    await delay(500);
    generatePerson({
      ...getRandomPersonAttrbutes(),
      floorId: 0,
      destinationFloorId: 5,
    });

    await delay(500);
    generatePerson({
      ...getRandomPersonAttrbutes(),
      floorId: 5,
      destinationFloorId: 0,
    });
  },
};
