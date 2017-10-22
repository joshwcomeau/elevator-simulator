// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { ELEVATOR_SHAFT_WIDTH, FLOOR_HEIGHT } from '../../constants';
import { random, range } from '../../utils';

import Person, { RandomPersonGenerator } from '../Person';
import Elevator from '../Elevator';
import ElevatorButtons from '../ElevatorButtons';

type PersonData = {
  id: string,
  locationType: 'floor' | 'elevator',
  locationIndex: number,
  destinationFloor: number,
};

type ElevatorRequest = {
  floor: number,
  direction: 'up' | 'down',
  requestedAt: Date,
};

type Props = {
  numFloors: number,
  numElevators: number,
};

type State = {
  people: Array<PersonData>,
  elevatorRequests: Array<ElevatorRequest>,
};

type DefaultProps = {
  numFloors: number,
  numElevators: number,
};

class World extends PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    numFloors: 4,
    numElevators: 1,
  };

  floorRefs: Array<HTMLElement> = [];
  elevatorRefs: Array<HTMLElement> = [];
  buttonRefs: Array<HTMLElement> = [];

  peopleGeneratorId: number;

  state = {
    people: [],
    elevatorRequests: [],
  };

  componentDidMount() {
    // We've rendered a buncha floors and elevators, and captured their refs.
    // We need to know the X offset for each elevator shaft,
    this.generatePeoplePeriodically();
  }

  componentWillUnmount() {
    window.clearTimeout(this.peopleGeneratorId);
  }

  generatePeoplePeriodically = () => {
    this.setState(state => ({
      people: [
        ...state.people,
        {
          id: 'a',
          locationType: 'floor',
          locationIndex: 0,
          destinationFloor: 2,
        },
      ],
    }));

    this.peopleGeneratorId = window.setTimeout(
      this.generatePeoplePeriodically,
      random(10000, 20000)
    );
  };

  callElevator = (originFloor: number, direction: 'up' | 'down') => {
    this.setState(state => ({
      elevatorRequests: [
        ...state.elevatorRequests,
        {
          floor: originFloor,
          direction,
          requestedAt: new Date(),
        },
      ],
    }));
  };

  renderPerson = (person: any) => {
    return (
      <RandomPersonGenerator key={person.id}>
        {randomizedProps => (
          <Person
            {...randomizedProps}
            renderTo={{
              ref: this.floorRefs[person.locationIndex],
              index: person.locationIndex,
              type: 'floor',
            }}
            handleElevatorButtonPush={this.callElevator}
            destinationX={200}
          />
        )}
      </RandomPersonGenerator>
    );
  };

  render() {
    const { numFloors, numElevators } = this.props;

    return (
      <WorldElem>
        <Floors>
          {range(numFloors).map(i => (
            <Floor
              key={i}
              innerRef={elem => {
                this.floorRefs[i] = elem;
              }}
            >
              <ElevatorButtons
                innerRef={elem => (this.buttonRefs[i] = elem)}
                isBottomFloor={i === 0}
                isTopFloor={i === numFloors - 1}
                hasRequestedUp={i === 0}
                hasRequestedDown={i === 2}
                offset={numElevators * ELEVATOR_SHAFT_WIDTH + 15}
              />
            </Floor>
          ))}
        </Floors>

        <Elevators>
          {range(numElevators).map(i => (
            <Elevator
              key={i}
              innerRef={elem => {
                this.elevatorRefs[i] = elem;
              }}
            />
          ))}
        </Elevators>

        {this.state.people.map(this.renderPerson)}
      </WorldElem>
    );
  }
}

const WorldElem = styled.div`
  position: relative;
  width: 500px;
`;

const Floors = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
`;

const Elevators = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
`;

const Floor = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  height: ${FLOOR_HEIGHT}px;
  border-bottom: 1px solid #333;
`;

export default World;
