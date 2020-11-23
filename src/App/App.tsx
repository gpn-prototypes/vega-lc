import React from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Root } from '@gpn-prototypes/vega-root';

import { Providers } from '../components/providers';

import { AppView } from './AppView';

type AppProps = {
  graphqlClient?: ApolloClient<NormalizedCacheObject>;
};

export const App = (props: AppProps): React.ReactElement => {
  const { graphqlClient } = props;

  return (
    <Root initialPortals={[{ name: 'modalRoot' }]} defaultTheme="dark">
      <Providers graphqlClient={graphqlClient}>
        <AppView />
      </Providers>
    </Root>
  );
};
