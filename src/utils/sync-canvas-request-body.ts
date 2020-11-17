import getHeaders from './headers';
import { getCurrentVersion, incrementVersion } from './version';

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

  return new Promise((resolve, reject) => {
    fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(queryBody),
    })
      .then(async (response) => {
        if (response.ok) {
          incrementVersion();

          const body = await response.json();

          resolve(body);
        }
      })
      .catch(reject);
  });
};
