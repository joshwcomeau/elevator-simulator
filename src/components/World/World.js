// @flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { initializeBuilding, generateRandomPerson } from '../../actions';
import { ELEVATOR_SHAFT_WIDTH } from '../../constants';
import { random, range } from '../../utils';
import { getPeopleArray } from '../../reducers/people.reducer';

import Elevator from '../Elevator';
import Floor from '../Floor';
import Person from '../Person';
import PersonController from '../PersonController';

import type { ActionCreator } from '../../types';
import type { ElevatorsState } from '../../reducers/elevators.reducer';
import type { FloorsState } from '../../reducers/floors.reducer';
import type { Person as PersonData } from '../../reducers/people.reducer';

type Props = {
  numFloors: number,
  numElevators: number,
  floors: FloorsState,
  elevators: ElevatorsState,
  people: Array<PersonData>,
  initializeBuilding: ActionCreator,
  generateRandomPerson: ActionCreator,
};

class World extends PureComponent<Props, State> {
  static defaultProps = {
    numFloors: 4,
    numElevators: 1,
  };

  floorRefs: Array<HTMLElement> = [];
  elevatorRefs: Array<HTMLElement> = [];
  buttonRefs: Array<HTMLElement> = [];

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
    window.setTimeout(
      () =>
        generateRandomPerson({
          floorId: 0,
          destinationFloorId: random(1, numFloors),
        }),
      500
    );
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
    // this.setState(state => ({
    //   elevatorRequests: {
    //     ...state.elevatorRequests,
    //     [direction]: {
    //       ...state.elevatorRequests[direction],
    //       [originFloor]: {
    //         requestedAt: new Date(),
    //       },
    //     },
    //   },
    // }));
  };

  renderPerson = (person: any) => {
    // let destinationX;
    // switch (person.status) {
    //   case 'initialized': {
    //     // In this case, we just need to give them the destination of the
    //     // elevator button. Once they get there, they'll handle pushing the
    //     // button
    //     const elevatorButton = this.buttonRefs[person.floorIndex];

    //     destinationX = elevatorButton.getBoundingClientRect().left;
    //   }
    //   case 'waiting-for-elevator': {
    //     // Right after pushing the button, this is their state.
    //     // Shuffle around a bit.
    //     destinationX = random(-20, 10);
    //   }

    //   case 'boarding-elevator': {
    //     // The elevator has arrived, and its doors are open.
    //     // Move our fellow towards the elevator.
    //     const elevator = this.elevatorRefs[person.elevatorIndex];

    //     destinationX = elevator.getBoundingClientRect().left;
    //   }

    //   case 'exiting-elevator': {
    //   }
    // }

    return (
      <PersonController
        status={person.status}
        walkSpeed={person.walkSpeed}
        floorId={person.floorId}
        elevatorId={person.elevatorId}
        floorRef={this.floorRefs[person.floorId]}
        elevatorButtonRef={this.buttonRefs[person.floorId]}
        elevatorRef={this.elevatorRefs[person.elevatorId]}
        handleRequestElevator={this.callElevator}
        handleBoardElevator={this.todo}
        handleArriveAtDestinationFloor={this.todo}
      >
        {({ isWalking }) => <Person {...person} isWalking={isWalking} />}
      </PersonController>
    );
  };

  render() {
    const { floors, elevators, people } = this.props;

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

        {people.map(this.renderPerson)}
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
  people: getPeopleArray(state),
});

const mapDispatchToProps = { initializeBuilding, generateRandomPerson };

export default connect(mapStateToProps, mapDispatchToProps)(World);
