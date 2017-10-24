// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './polyfills';

import configureStore from './store';

import App from './components/App';
import DevTools from './components/DevTools';

const store = configureStore();

const rootNode = document.getElementById('root');

if (!rootNode) {
  throw new Error('Root node with ID `root` not found.');
}

ReactDOM.render(
  <Provider store={store}>
    <span>
      <App />
      <DevTools />
    </span>
  </Provider>,
  rootNode
);
