import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

import { logicConstructorService } from './lc-service';

const testURI = 'http://example.test';
const testProjectId = 'a3333333-b111-c111-d111-e00000000009';
const testProjectVersion = 2;

jest.mock('../../config/config.public');

beforeAll(() => {
  const client = new ApolloClient({
    link: createHttpLink({ uri: '/graphql', fetch }),
    cache: new InMemoryCache(),
  });

  logicConstructorService.init({
    client,
    projectId: testProjectId,
    projectVersion: testProjectVersion,
  });
});

describe('Сервис конструктора логики: ', () => {
  test('идентификатора проекта инициализируется', () => {
    expect(logicConstructorService.projectId).toBe(testProjectId);
  });

  test('клиент инициализируется', () => {
    expect(logicConstructorService.client).toBeDefined();
  });

  test('URI для запросов формируется валидным', () => {
    expect(logicConstructorService.getGraphQlUri()).toBe(`${testURI}/graphql/${testProjectId}`);
  });

  describe('Конкурентный доступ: ', () => {
    test('конфиг для разрешения конфликтов формируется c необходимыми свойствами и соответствует снэпшоту', () => {
      const diffResolvingConfig = logicConstructorService.getDiffResolvingConfig();

      ['errorTypename', 'maxAttempts', 'mergeStrategy', 'projectAccessor'].forEach((prop) => {
        expect(diffResolvingConfig).toHaveProperty(prop);
      });

      expect(diffResolvingConfig.projectAccessor.fromDiffError({}).local).toEqual({
        vid: testProjectId,
        version: 2,
      });

      expect(diffResolvingConfig).toMatchSnapshot();
    });

    test('При конфликте мутации устанавливается актуальная версия с сервера и активируется флаг isMutationConflict', () => {
      logicConstructorService
        .getDiffResolvingConfig()
        .projectAccessor.toVariables({}, { version: 10 });

      expect(logicConstructorService.projectVersion).toBe(10);
      expect(logicConstructorService.isMutationConflict).toBe(true);
    });

    test('Флаг isMutationConflict деактивируется', () => {
      logicConstructorService.setIsMutationConflictResolved();

      expect(logicConstructorService.isMutationConflict).toBe(false);
    });
  });
});
