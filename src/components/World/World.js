// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { range } from '../../utils';

import Person, { RandomPersonGenerator } from '../Person';
import Elevator from '../Elevator';

type PersonData = any;

type Props = {
  numFloors: number,
  numElevators: number,
};

type State = {
  people: Array<PersonData>,
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

  state = {
    people: [],
  };

  componentDidMount() {
    this.generatePeoplePeriodically();
  }

  generatePeoplePeriodically = () => {
    this.setState(state => ({
      people: [
        ...state.people,
        {
          id: 'a',
          floor: 0,
          destinationFloor: 2,
        },
      ],
    }));
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
            />
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

        {this.state.people.map(person => (
          <RandomPersonGenerator>
            {randomizedProps => (
              <Person
                {...randomizedProps}
                renderTo={this.floorRefs[0]}
                destinationX={200}
              />
            )}
          </RandomPersonGenerator>
        ))}
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
  height: 60px;
  border-bottom: 1px solid #333;
`;

export default World;
