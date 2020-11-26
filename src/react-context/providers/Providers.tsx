import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';

import client from '../../client';
import getStore from '../../redux-store';

import { ProjectProvider } from './ProjectProvider';

interface ProvidersProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { graphqlClient = client, children } = props;

  return (
    <Provider store={getStore()}>
      <ApolloProvider client={graphqlClient}>
        <BrowserRouter>
          <ProjectProvider>{children}</ProjectProvider>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};
