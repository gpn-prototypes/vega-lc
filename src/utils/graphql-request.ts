import { getHeaders } from './headers';
import { incrementVersion } from './version';

export type QueryBody = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; appendProjectId?: boolean; isMutation?: boolean };

export function graphQlRequest({
  body,
  appendProjectId = false,
  isMutation = false,
}: GraphqlRequestProps): Promise<Response> {
  const uri = appendProjectId ? `graphql/a3333333-b111-c111-d111-e00000000000` : 'graphql';

  return new Promise((resolve, reject) => {
    fetch(`http://outsourcing.nat.tepkom.ru:38080/${uri}`, {
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
