// polyfills to fix regeneratorRuntime is not defined
import 'regenerator-runtime/runtime';
import 'antd/dist/antd.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

// fixed wrong import for configureStore
import configureStore from './redux/index';
import Router from './components/Router';

const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
);
