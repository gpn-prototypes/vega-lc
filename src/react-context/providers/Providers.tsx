import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';

import { ProjectProvider } from './ProjectProvider';

import getStore from '@/redux-store';
import { vegaApi } from '@/utils/api-clients/vega-api';

interface ProvidersProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { graphqlClient = vegaApi, children } = props;

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
