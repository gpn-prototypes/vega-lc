import { DocumentNode, NetworkStatus } from '@apollo/client';

import client, { mainLink, projectLink } from '../client';
import { Mutation, Query } from '../generated/graphql';
import { Mutation as ProjectMutation, Query as ProjectQuery } from '../generated/graphql-project';

import { incrementVersion } from './version';

export type QueryBody = {
  query: DocumentNode;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; appendProjectId?: boolean; isMutation?: boolean };

type GraphqlResponse = ProjectMutation | Mutation | ProjectQuery | Query;

export function graphQlRequest({
  body,
  appendProjectId = false,
  isMutation = false,
}: GraphqlRequestProps): Promise<GraphqlResponse> {
  client.setLink(appendProjectId ? projectLink : mainLink);

  return new Promise((resolve, reject) => {
    if (isMutation) {
      client
        .mutate<Mutation | ProjectMutation>({
          mutation: body.query,
          variables: body.variables,
        })
        .then((resp) => {
          if (!resp.errors && resp.data) {
            incrementVersion();

            resolve(resp.data);
          }
        })
        .catch(reject);
    } else {
      client
        .query<Query | ProjectQuery>({
          query: body.query,
          variables: body.variables,
          fetchPolicy: 'network-only',
        })
        .then((resp) => {
          if (resp.networkStatus === NetworkStatus.ready) {
            resolve(resp.data);
          }
        })
        .catch(reject);
    }
  });
}
