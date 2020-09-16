import { authHeader } from './set-auth-token';

const getHeaders = (): Headers => {
  return new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeader(),
  });
};

export default getHeaders;
