import { graphQlRequest } from './graphql-request';
import { getCurrentVersion } from './version';

type QueryBody = {
  query: string;
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
    query: `mutation ($version: Int!, $vid: UUID!) { logic { canvas
     { ${method} (vid: $vid, ${queryString}, version: $version) ${dataOnResult} }}}`,
    variables: {
      version,
      vid: targetId,
    },
  };

  if (options?.variables) {
    const { pattern, ...variables } = options.variables;

    queryBody.query = `mutation($version: Int!, $vid: UUID!, ${pattern})
     { logic { canvas { ${method}(vid: $vid, ${queryString}, version: $version) ${dataOnResult} }}}`;
    queryBody.variables = { ...queryBody.variables, ...variables };
  }

  try {
    await graphQlRequest({
      body: queryBody,
      appendProjectId: true,
      isMutation: true,
    });
  } catch (e) {
    console.error(e);
  }
};
