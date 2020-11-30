import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

import { getProjectId } from '../project-id';
import { authHeader } from '../set-auth-token';

const headers = {
  ...authHeader(),
};

const baseApiUrl = process.env.BASE_API_URL || 'http://ababakov2-lt-vega-builder.code013.org:38080';

export const getMainLink = (): HttpLink =>
  new HttpLink({
    uri: `${baseApiUrl}/graphql`,
    headers,
    fetch,
  });

export const getProjectLink = (): HttpLink =>
  new HttpLink({
    uri: `${baseApiUrl}/graphql/${getProjectId()}`,
    headers,
    fetch,
  });

export const vegaApi = new ApolloClient({
  link: new HttpLink({ uri: `${baseApiUrl}/graphql`, headers, fetch }),
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
