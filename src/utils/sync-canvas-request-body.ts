import getHeaders from './headers';
import { getCurrentVersion, incrementVersion } from './version';

type QueryBody = {
  query: string;
  variables?: unknown;
};

export const syncCanvasRequest = async (
  targetId: string,
  queryString: string,
  options?: {
    variables?: unknown;
    method?: 'update' | 'create' | 'delete';
    responseFields?: string;
  },
): Promise<void> => {
  const method = options?.method || 'update';
  const dataOnResult = options?.responseFields || '{result { vid }}';
  const version = getCurrentVersion();
  const queryBody: QueryBody = {
    query: `mutation { logic { canvas { ${method}(vid: "${targetId}", ${queryString}, version: ${version}) ${dataOnResult} }}}`,
  };

  if (options?.variables) {
    queryBody.query = `mutation($vids: [UUID])
     { logic { canvas { ${method}(vid: "${targetId}", ${queryString}, version: 1){result { vid }} }}}`;
    queryBody.variables = options.variables;
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
