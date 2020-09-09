import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Root } from '@gpn-prototypes/vega-root';

import { App } from './App';

import './App.css';

ReactDOM.render(
  <Root initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Root>,
  document.getElementById('root'),
);
