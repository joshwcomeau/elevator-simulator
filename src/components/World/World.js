// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import Person from '../Person';

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

  floorRefs = [];

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
    return (
      <WorldElem>
        <Floor innerRef={elem => (this.floorRefs[0] = elem)} />
        <Floor innerRef={elem => (this.floorRefs[1] = elem)} />
        <Floor innerRef={elem => (this.floorRefs[2] = elem)} />

        {this.state.people.map(person => (
          <Person renderTo={this.floorRefs[0]} destinationX={200} />
        ))}
      </WorldElem>
    );
  }
}

const WorldElem = styled.div`
  width: 250px;
`;

const Floor = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  height: 60px;
  border-bottom: 1px solid #333;
`;

export default World;
