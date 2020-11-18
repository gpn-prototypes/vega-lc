import { getHeaders } from './headers';
import { incrementVersion } from './version';

export type QueryBody = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; projectId?: string; isMutation?: boolean };

export function graphQlRequest({
  body,
  projectId,
  isMutation = false,
}: GraphqlRequestProps): Promise<Response> {
  const url = projectId ? `graphql/${projectId}` : 'graphql';

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
