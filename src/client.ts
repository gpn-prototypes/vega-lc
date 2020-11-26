import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

import { authHeader } from './utils/set-auth-token';

const headers = {
  ...authHeader(),
};

const VEGA_API_URI = 'http://outsourcing.nat.tepkom.ru:38080';

export const mainLink = new HttpLink({
  uri: `${VEGA_API_URI}/graphql`,
  headers,
  fetch,
});

export const projectLink = new HttpLink({
  uri: `${VEGA_API_URI}/graphql/a3333333-b111-c111-d111-e00000000000`,
  headers,
  fetch,
});

const client = new ApolloClient({
  link: new HttpLink({ uri: `${VEGA_API_URI}/graphql`, headers, fetch }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          logic: {
            merge: false,
          },
          domain: {
            merge: false,
          },
        },
      },
    },
  }),
});

export default client;
