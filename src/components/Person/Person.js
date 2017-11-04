// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';

import { COLORS } from '../../constants';
import {
  requestAnimationFramePromise,
  setTimeoutPromise,
  calculateLineLength,
} from '../../utils';

import { PATHS, BODY_COLORS } from './Person.data';
import { getDistanceToButton } from './Person.helpers';

import type { PersonShape, PersonStatus } from '../../types';

export type Props = {
  id: string,
  color: string,
  shape: PersonShape,
  patience: number,
  walkSpeed: number,
  size: number,
  Status: PersonStatus,
  isWalking: boolean,
  armPokeTarget: ?HTMLElement,
  handleElevatorRequest: () => void,
};

type State = {
  armStatus: 'idle' | 'extending' | 'retracting',
  armEndpoint: {
    x: number,
    y: number,
  },
};

const VIEWBOX_WIDTH = 200;
const VIEWBOX_HEIGHT = 230;
const ARM_POKE_DURATION = 350;

class Person extends PureComponent<Props, State> {
  elem: HTMLElement;

  state = {
    armStatus: 'idle',
    armEndpoint: {
      // Center the arm within the SVG, so it's completely obscured by the
      // body.
      x: VIEWBOX_WIDTH / 2,
      y: VIEWBOX_HEIGHT / 2,
    },
  };

  static defaultProps = {
    size: 30,
    color: BODY_COLORS[0],
    shape: 'pentagon',
    patience: 50,
    walkSpeed: 1,
    isWalking: false,
  };

  setStatePromise = (state: any) =>
    // No idea what Flow is yammering on about.
    // $FlowFixMe
    new Promise(resolve => {
      this.setState(state, resolve);
    });

  componentWillReceiveProps(nextProps: Props) {
    // The person has an arm they can use to poke things.
    if (!this.props.armPokeTarget && nextProps.armPokeTarget) {
      this.pokeButton(nextProps.armPokeTarget);
    }
  }

  pokeButton(target: HTMLElement) {
    // We now have a reference to the thing we want to poke, and we've also
    // captured a ref to our rendered Person.
    // The tricky thing is we need to convert between the bounding-box
    // window coordinates, to the SVG viewBox coordinates.
    // Get the difference between the button top, and our person top.
    const viewboxMultiplier = VIEWBOX_WIDTH / this.props.size;

    const { x, y } = getDistanceToButton({
      svg: this.elem,
      target,
      viewboxMultiplier,
    });

    // Sadly, this is a non-trivial sequence of events.
    // First, we need to update the arm endpoint, so that our component can re-
    // render with the proper arm length. After a single frame, we need to start
    // the expand animation (won't work if we don't allow the update).
    // When the arm is fully extended, trigger the request elevator action,
    // and start retracting the arm.
    this.setStatePromise({ armEndpoint: { x, y } })
      .then(requestAnimationFramePromise)
      .then(() => this.setStatePromise({ armStatus: 'extending' }))
      .then(() => setTimeoutPromise(ARM_POKE_DURATION))
      .then(this.props.handleElevatorRequest)
      .then(() => this.setStatePromise({ armStatus: 'retracting' }));
  }

  render() {
    const { size, color, shape, isWalking } = this.props;
    const { armEndpoint, armStatus } = this.state;

    const armLength = calculateLineLength(
      VIEWBOX_WIDTH / 2,
      VIEWBOX_HEIGHT / 2,
      armEndpoint.x,
      armEndpoint.y
    );

    let armStyles = {
      strokeDashoffset: armStatus === 'extending' ? 0 : armLength,
      strokeDasharray: armLength,
      transition:
        armStatus !== 'idle'
          ? `stroke-dashoffset ${ARM_POKE_DURATION}ms linear`
          : `stroke-dashoffset 0`,
    };

    return (
      <PersonSvg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        width={size}
        height={size * 1.15}
        innerRef={elem => (this.elem = elem)}
      >
        <LeftLeg isWalking={isWalking} x1={80} y1={195} x2={80} y2={230} />
        <RightLeg isWalking={isWalking} x1={120} y1={195} x2={120} y2={230} />
        <Arm
          x1={VIEWBOX_WIDTH / 2}
          y1={VIEWBOX_HEIGHT / 2}
          x2={armEndpoint.x}
          y2={armEndpoint.y}
          style={armStyles}
        />
        <Body isWalking={isWalking} color={color} d={PATHS[shape]} />
      </PersonSvg>
    );
  }
}

const wobbleBody = keyframes`
  0% {
    transform-origin: bottom center;
    transform: rotateZ(3deg);
  }

  50% {
    transform-origin: bottom center;
    transform: rotateZ(-3deg);
  }

  100% {
    transform-origin: bottom center;
    transform: rotateZ(3deg);
  }
`;

const moveLeg = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-45%);
  }

  100% {
    transform: translateY(0);
  }
`;

const STEP_DURATION = 500;

const PersonSvg = styled.svg`
  display: block;
`;

const Leg = styled.line`
  stroke: ${COLORS.gray[700]};
  stroke-width: 10;
  animation-name: ${props => (props.isWalking ? moveLeg : 'none')};
  animation-duration: ${STEP_DURATION}ms;
  animation-iteration-count: infinite;
  will-change: transform;
`;

const LeftLeg = styled(Leg)`
  animation-delay: ${STEP_DURATION / 2}ms;
`;

const RightLeg = styled(Leg)`
  /* No styles needed */
`;

const Arm = styled.line`
  stroke: ${COLORS.gray[700]};
  stroke-width: 10;
`;

const Body = styled.path`
  fill: ${props => props.color};
  stroke: none;
  animation-name: ${props => (props.isWalking ? wobbleBody : 'none')};
  animation-duration: ${STEP_DURATION}ms;
  animation-iteration-count: infinite;
  will-change: transform;
`;

export default Person;
