// @flow
// TODO: This story is very broken. Update it!
// import React, { Component } from 'react';

// import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { random, range } from '../../utils';

// import Person from './index';

// class WalkingToggle extends Component<any, { isWalking: boolean }> {
//   state = {
//     isWalking: false,
//   };

//   render() {
//     const { isWalking } = this.state;

//     return (
//       <div>
//         <Person isWalking={isWalking} {...this.props} />
//         <br />
//         <button onClick={() => this.setState({ isWalking: !isWalking })}>
//           Toggle
//         </button>
//       </div>
//     );
//   }
// }

// class PersonMover extends Component<any, { x: number }> {
//   timeoutId: number;
//   state = {
//     x: 0,
//   };

//   componentDidMount() {
//     this.timeoutId = window.setInterval(this.updatePosition, random(500, 1000));
//   }

//   componentWillUnmount() {
//     window.clearInterval(this.timeoutId);
//   }

//   updatePosition = () => {
//     this.setState({ x: random(0, 200) });
//   };

//   render() {
//     return (
//       <RandomPersonGenerator>
//         {randomizedProps => (
//           <Person {...randomizedProps} destinationX={this.state.x} />
//         )}
//       </RandomPersonGenerator>
//     );
//   }
// }

// const shapes = ['pentagon', 'rectangle'];

// shapes.forEach(shape => {
//   storiesOf(`Person (${shape})`, module)
//     .add('default', () => <Person shape={shape} />)
//     .add('walking toggle', () => <WalkingToggle shape={shape} />);
// });

// storiesOf('RandomPersonGenerator', module)
//   .add('default', () => (
//     <RandomPersonGenerator>
//       {randomizedProps => <Person {...randomizedProps} />}
//     </RandomPersonGenerator>
//   ))
//   .add('another', () => (
//     <RandomPersonGenerator>
//       {randomizedProps => <Person {...randomizedProps} />}
//     </RandomPersonGenerator>
//   ));

// storiesOf('PersonMover', module)
//   .add('default', () => <PersonMover />)
//   .add('3 people', () => range(3).map(i => <PersonMover key={i} />))
//   .add('10 people', () => range(10).map(i => <PersonMover key={i} />))
//   .add('30 people', () => range(30).map(i => <PersonMover key={i} />));
