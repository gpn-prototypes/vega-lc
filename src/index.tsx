import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Root } from '@gpn-prototypes/vega-root';

import getStore from './redux-store/index';
import { App } from './App';
import client from './client';

import './App.css';

ReactDOM.render(
  <Root initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
    <ApolloProvider client={client}>
      <Provider store={getStore()}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </Root>,
  document.getElementById('root'),
);
