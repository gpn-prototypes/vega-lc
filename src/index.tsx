import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Root } from '@gpn-prototypes/vega-root';
import { Provider } from 'react-redux';

import { App } from './App';

import './App.css';
import getStore from './redux-store/index';

ReactDOM.render(
  <Root initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
    <Provider store={getStore()}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Root>,
  document.getElementById('root'),
);
