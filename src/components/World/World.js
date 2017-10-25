// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { initializeBuilding, generateRandomPerson } from '../../actions';
import { ELEVATOR_SHAFT_WIDTH } from '../../constants';
import { random, range } from '../../utils';

import Elevator from '../Elevator';
import Floor from '../Floor';
import Person, { RandomPersonGenerator } from '../Person';

import type { ActionCreator } from '../../types';
import type { ElevatorsState } from '../../reducers/elevators.reducer';
import type { FloorsState } from '../../reducers/floors.reducer';

type PersonData = {
  id: string,
  locationType: 'floor' | 'elevator',
  locationIndex: number,
  destinationFloor: number,
};

type ElevatorRequests = {
  [direction: 'up' | 'down']: {
    [floorIndex: number]: {
      requestedAt: Date,
    },
  },
};

type Props = {
  numFloors: number,
  numElevators: number,
  floors: FloorsState,
  elevators: ElevatorsState,
  initializeBuilding: ActionCreator,
  generateRandomPerson: ActionCreator,
};

type State = {
  people: Array<PersonData>,
  elevatorRequests: ElevatorRequests,
};

class World extends PureComponent<Props, State> {
  static defaultProps = {
    numFloors: 4,
    numElevators: 1,
  };

  floorRefs: Array<HTMLElement> = [];
  elevatorRefs: Array<HTMLElement> = [];
  buttonRefs: Array<HTMLElement> = [];

  peopleGeneratorId: number;

  state = {
    people: [],
    elevatorRequests: {},
  };

  componentDidMount() {
    const {
      numFloors,
      numElevators,
      initializeBuilding,
      generateRandomPerson,
    } = this.props;

    initializeBuilding({ numFloors, numElevators });

    // We've rendered a buncha floors and elevators, and captured their refs.
    // We need to know the X offset for each elevator shaft,
    window.requestAnimationFrame(generateRandomPerson);
  }

  componentWillUnmount() {
    window.clearTimeout(this.peopleGeneratorId);
  }

  generatePeoplePeriodically = () => {
    // this.setState(state => ({
    //   people: [
    //     ...state.people,
    //     {
    //       id: 'a',
    //       locationType: 'floor',
    //       locationIndex: 0,
    //       destinationFloor: 2,
    //       destinationX: 200,
    //     },
    //   ],
    // }));
    // this.peopleGeneratorId = window.setTimeout(
    //   this.generatePeoplePeriodically,
    //   random(10000, 20000)
    // );
  };

  callElevator = (originFloor: number, direction: 'up' | 'down') => {
    //
    this.setState(state => ({
      elevatorRequests: {
        ...state.elevatorRequests,
        [direction]: {
          ...state.elevatorRequests[direction],
          [originFloor]: {
            requestedAt: new Date(),
          },
        },
      },
    }));
  };

  renderPerson = (person: any) => {
    let destinationX;
    switch (person.status) {
      case 'initialized': {
        // In this case, we just need to give them the destination of the
        // elevator button. Once they get there, they'll handle pushing the
        // button
        const elevatorButton = this.buttonRefs[person.floorIndex];

        destinationX = elevatorButton.getBoundingClientRect().left;
      }
      case 'waiting-for-elevator': {
        // Right after pushing the button, this is their state.
        // Shuffle around a bit.
        destinationX = random(-20, 10);
      }

      case 'boarding-elevator': {
        // The elevator has arrived, and its doors are open.
        // Move our fellow towards the elevator.
        const elevator = this.elevatorRefs[person.elevatorIndex];

        destinationX = elevator.getBoundingClientRect().left;
      }

      case 'exiting-elevator': {
      }
    }

    // <PersonMover
    //   renderTo={{
    //     ref: this.floorRefs[person.locationIndex],
    //     index: person.locationIndex,
    //     type: 'floor',
    //   }}
    //   moveTowards={{

    //   }}
    return (
      <RandomPersonGenerator key={person.id}>
        {randomizedProps => (
          <Person
            {...person}
            {...randomizedProps}
            renderTo={{
              ref: this.floorRefs[person.locationIndex],
              index: person.locationIndex,
              type: 'floor',
            }}
            handleElevatorButtonPush={this.callElevator}
          />
        )}
      </RandomPersonGenerator>
    );
  };

  render() {
    const { floors, elevators } = this.props;

    console.log(floors, elevators, this.floorRefs);

    return (
      <WorldElem>
        <Floors>
          {floors.map(floor => (
            <Floor
              key={floor.id}
              id={floor.id}
              numElevators={elevators.length}
              floorRefCapturer={elem => (this.floorRefs[floor.id] = elem)}
              elevatorButtonsRefCapturer={elem =>
                (this.buttonRefs[floor.id] = elem)}
            />
          ))}
        </Floors>

        <Elevators>
          {elevators.map(elevator => (
            <Elevator
              key={elevator.id}
              innerRef={elem => {
                this.elevatorRefs[elevator.id] = elem;
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

const mapStateToProps = state => ({
  floors: state.floors,
  elevators: state.elevators,
});

const mapDispatchToProps = { initializeBuilding, generateRandomPerson };

export default connect(mapStateToProps, mapDispatchToProps)(World);
