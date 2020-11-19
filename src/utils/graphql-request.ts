import { getHeaders } from './headers';
import { incrementVersion } from './version';

export type QueryBody = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; projectId?: boolean; isMutation?: boolean };

export function graphQlRequest({
  body,
  projectId = false,
  isMutation = false,
}: GraphqlRequestProps): Promise<Response> {
  const url = projectId ? `graphql/a3333333-b111-c111-d111-e00000000000` : 'graphql';

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
      .then((resp) => {
        if (resp.ok) {
          if (isMutation) incrementVersion();

          resolve(resp);
        }
      })
      .catch(reject);
  });
}
