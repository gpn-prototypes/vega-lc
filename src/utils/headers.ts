import { authHeader } from './set-auth-token';

export const getHeaders = (): Headers => {
  return new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeader(),
  });
};
