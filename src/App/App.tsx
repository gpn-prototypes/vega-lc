import React from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Root } from '@gpn-prototypes/vega-ui';

import { AppView } from './AppView';
import { cnApp } from './cn-app';

import './App.css';

import { Providers } from '@/react-context/providers';
import { Identity } from '@/types';
import { vegaApi } from '@/utils/api-clients/vega-api';

interface AppProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
  identity?: Identity;
}

export const App: React.FC<AppProps> = (props) => {
  const { graphqlClient = vegaApi, identity } = props;

  return (
    <Root
      initialPortals={[{ name: 'modalRoot' }]}
      defaultTheme="dark"
      className={cnApp('App-Wrapper').toString()}
    >
      <Providers graphqlClient={graphqlClient} identity={identity}>
        <AppView />
      </Providers>
    </Root>
  );
};
