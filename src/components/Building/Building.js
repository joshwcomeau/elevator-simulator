// @flow
// TODO: Rename this component to Building
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { initializeBuilding } from '../../actions';
import { ELEVATORS_ZINDEX, FLOORS_ZINDEX } from '../../constants';
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
};

class Building extends PureComponent<Props> {
  static defaultProps = {
    numFloors: 4,
    numElevators: 1,
  };

  floorRefs: Array<HTMLElement> = [];
  elevatorRefs: Array<HTMLElement> = [];
  buttonRefs: Array<HTMLElement> = [];

  componentDidMount() {
    const { numFloors, numElevators, initializeBuilding } = this.props;

    initializeBuilding({ numFloors, numElevators });
  }

  renderPerson = (person: any) => {
    return (
      <PersonController
        key={person.id}
        {...person}
        floorRef={this.floorRefs[person.floorId]}
        elevatorButtonRef={this.buttonRefs[person.floorId]}
        elevatorRef={this.elevatorRefs[person.elevatorId]}
      >
        {({ isWalking, isGhost, armPokeTarget, handleElevatorRequest }) => (
          <Person
            {...person}
            isWalking={isWalking}
            isGhost={isGhost}
            armPokeTarget={armPokeTarget}
            handleElevatorRequest={handleElevatorRequest}
          />
        )}
      </PersonController>
    );
  };

  render() {
    const { floors, elevators, people } = this.props;

    return (
      <BuildingElem>
        <Elevators>
          {elevators.map(elevator => (
            <Elevator
              key={elevator.id}
              id={elevator.id}
              refCapturer={elem => {
                this.elevatorRefs[elevator.id] = elem;
              }}
            />
          ))}
        </Elevators>

        <Floors>
          {floors.map(floor => (
            <Floor
              key={floor.id}
              id={floor.id}
              numElevators={elevators.length}
              refCapturer={elem => {
                this.floorRefs[floor.id] = elem;
              }}
              elevatorButtonsRefCapturer={elem => {
                this.buttonRefs[floor.id] = elem;
              }}
            />
          ))}
        </Floors>

        {people.map(this.renderPerson)}
      </BuildingElem>
    );
  }
}

const BuildingElem = styled.div`
  position: relative;
  width: 300px;
`;

const Floors = styled.div`
  position: relative;
  z-index: ${FLOORS_ZINDEX};
  display: flex;
  flex-direction: column-reverse;
`;

const Elevators = styled.div`
  position: absolute;
  z-index: ${ELEVATORS_ZINDEX};
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

const mapDispatchToProps = { initializeBuilding };

export default connect(mapStateToProps, mapDispatchToProps)(Building);
