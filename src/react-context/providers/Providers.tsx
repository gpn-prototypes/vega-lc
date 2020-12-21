import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';

import { ProjectProvider } from './ProjectProvider';

import getStore from '@/redux-store';
import { Identity } from '@/types';
import { vegaApi } from '@/utils/api-clients/vega-api';

interface ProvidersProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { graphqlClient = vegaApi, identity, children } = props;

  return (
    <Provider store={getStore()}>
      <ApolloProvider client={graphqlClient}>
        <BrowserRouter>
          <ProjectProvider graphqlClient={graphqlClient} identity={identity}>
            {children}
          </ProjectProvider>
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};
