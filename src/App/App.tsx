import React from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Root } from '@gpn-prototypes/vega-ui';

import { AppView } from './AppView';
import classNames from './cn-app';

import './App.css';

import { Providers } from '@/react-context/providers';

interface AppProps {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
}

export const App: React.FC<AppProps> = (props) => {
  const { graphqlClient } = props;

  return (
    <Root
      initialPortals={[{ name: 'modalRoot' }]}
      defaultTheme="dark"
      className={classNames('App-Wrapper').toString()}
    >
      <Providers graphqlClient={graphqlClient}>
        <AppView />
      </Providers>
    </Root>
  );
};
