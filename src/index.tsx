import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Root } from '@gpn-prototypes/vega-root';

import getStore from './redux-store/index';
import { App } from './App';

import './App.css';

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
