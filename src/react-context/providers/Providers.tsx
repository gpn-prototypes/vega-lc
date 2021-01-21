import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { Loader } from '@gpn-prototypes/vega-ui';
import { PersistGate } from 'redux-persist/es/integration/react';

import { ProjectProvider } from './ProjectProvider';

import { persistor, store } from '@/redux-store';
import { Identity } from '@/types';

interface ProvidersProps {
  graphqlClient: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { graphqlClient, identity, children } = props;

  return (
    <Provider store={store}>
      <ApolloProvider client={graphqlClient}>
        <PersistGate loading={<Loader size="m" />} persistor={persistor}>
          <BrowserRouter>
            <ProjectProvider graphqlClient={graphqlClient} identity={identity}>
              {children}
            </ProjectProvider>
          </BrowserRouter>
        </PersistGate>
      </ApolloProvider>
    </Provider>
  );
};
