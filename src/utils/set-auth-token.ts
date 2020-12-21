import { serviceConfig } from './graphql-request';

export function authHeader(defaultToken: string | undefined) {
  const token = serviceConfig.identity?.getToken() || defaultToken;

  return { Authorization: `Bearer ${token}` };
}
