import { getHeaders } from './headers';
import { incrementVersion } from './version';

export type QueryBody = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; appendProjectId?: boolean; isMutation?: boolean };
type ResponseProp = { [key: string]: any };

export function graphQlRequest({
  body,
  appendProjectId = false,
  isMutation = false,
}: GraphqlRequestProps): Promise<{ data: ResponseProp; errors?: ResponseProp }> {
  const url = appendProjectId ? `graphql/a3333333-b111-c111-d111-e00000000000` : 'graphql';

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })
      .then(async (resp) => {
        const parsedResponse = await resp.json();

        if (resp.ok && !parsedResponse.errors) {
          if (isMutation) incrementVersion();

          resolve(parsedResponse);
        } else {
          throw new Error(parsedResponse.errors || 'Request failed');
        }
      })
      .catch(reject);
  });
}
