import { authHeader } from '../../src/utils/set-auth-token';

describe('Функция формирующая хедер авторизации', () => {
  test('Формируется объект с Authorization Header', () => {
    const token = 'default-token';
    const header = authHeader(token);

    expect(header).toMatchObject({ Authorization: `Bearer ${token}` });
  });
});
