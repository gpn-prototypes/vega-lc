import { DocumentNode, gql } from '@apollo/client';

import client, { projectLink } from '../client';
import { CanvasMutations, Mutation } from '../generated/graphql-project';

import { getCurrentVersion, incrementVersion } from './version';

type QueryBody = {
  query: DocumentNode;
  variables?: {
    [key: string]: unknown;
  };
};

export const syncCanvasRequest = async (
  targetId: string,
  queryString: string,
  options?: {
    variables?: {
      pattern: string;
      [key: string]: unknown;
    };
    method?: 'update' | 'create' | 'delete';
    responseFields?: string;
  },
): Promise<void> => {
  const method = options?.method || 'update';
  const dataOnResult = options?.responseFields || '{result { vid }}';
  const version = getCurrentVersion();
  const queryBody: QueryBody = {
    query: gql`mutation ($version: Int!, $vid: UUID!) { logic { canvas
     { ${method} (vid: $vid, ${queryString}, version: $version) ${dataOnResult} }}}`,
    variables: {
      version,
      vid: targetId,
    },
  };

  if (options?.variables) {
    const { pattern, ...variables } = options.variables;

    queryBody.query = gql`mutation($version: Int!, $vid: UUID!, ${pattern})
     { logic { canvas { ${method}(vid: $vid, ${queryString}, version: $version) ${dataOnResult} }}}`;
    queryBody.variables = { ...queryBody.variables, ...variables };
  }

  function isCanvasHasError(canvas: CanvasMutations): boolean {
    switch (method) {
      case 'create':
        return canvas?.create?.__typename === 'Error';
      case 'update':
        return canvas?.update?.__typename === 'Error';
      case 'delete':
        return canvas?.delete?.__typename === 'Error';
      default:
        return false;
    }
  }

  return new Promise((resolve, reject) => {
    client.setLink(projectLink);
    client
      .mutate<Mutation>({
        mutation: queryBody.query,
        variables: queryBody.variables,
      })
      .then(async (response) => {
        const canvas = response.data?.logic?.canvas;
        if (canvas && !isCanvasHasError(canvas)) {
          incrementVersion();
          resolve();
        }
      })
      .catch(reject);
  });
};
