import { logicConstructorService } from './lc-service';

export function authHeader(defaultToken: string | undefined) {
  const token = logicConstructorService.identity?.getToken() || defaultToken;

  return { Authorization: `Bearer ${token}` };
}
