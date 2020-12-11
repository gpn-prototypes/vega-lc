import { getHeaders } from './headers';
import { getProjectId } from './project-id';
import { incrementVersion } from './version';

export type QueryBody = {
  query: string;
  variables?: {
    [key: string]: unknown;
  };
};

type GraphqlRequestProps = { body: QueryBody; appendProjectId?: boolean; isMutation?: boolean };
type ResponseProp = { [key: string]: any };

const baseApiUrl = process.env.BASE_API_URL || 'http://ababakov-lt-vega-builder.code013.org:38080';

export function graphQlRequest({
  body,
  appendProjectId = false,
  isMutation = false,
}: GraphqlRequestProps): Promise<{ data: ResponseProp; errors?: ResponseProp }> {
  const uri = appendProjectId ? `graphql/${getProjectId()}` : 'graphql';

  return new Promise((resolve, reject) => {
    fetch(`${baseApiUrl}/${uri}`, {
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
