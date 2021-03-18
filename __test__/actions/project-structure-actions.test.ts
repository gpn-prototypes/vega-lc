import { Dispatch } from 'react';
import { ApolloClient, createHttpLink, gql, InMemoryCache, NetworkStatus } from '@apollo/client';
import { waitFor } from '@testing-library/react';
import fetch from 'cross-fetch';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import '@/types/global';

import { ProjectStructureActionTypes } from '@/redux-store/project-structure/action-types';
import { fetchProjectStructureList } from '@/redux-store/project-structure/actions';
import initialState from '@/redux-store/project-structure/initial-state';
import { logicConstructorService } from '@/utils/lc-service';

const mockStore = configureMockStore([thunkMiddleware]);

jest.mock('@/config/config.public', () => {
  return {
    config: {
      baseApiUrl: 'http://example.test',
      authToken: 'mock-token',
    },
  };
});

jest.mock('@/utils/graphql-request', () => {
  const originalModule = jest.requireActual('@/utils/lc-service');

  return {
    ...originalModule,
    logicConstructorService: {
      ...originalModule.logicConstructorService,
      client: {
        query: jest.fn(),
      },
      projectId: 'a3333333-b111-c111-d111-e00000000009',
    },
  };
});

const mockFetchProjectStructureListQuery = (response: any) => {
  jest.spyOn(logicConstructorService.client, 'query').mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(response);
      });
    });
  });
};

const successResponse = {
  data: {
    project: {
      vid: 'a3333333-b111-c111-d111-e00000000011',
      domain: {
        geoEconomicAppraisalProjectList: [
          {
            typename: 'GeoEconomicAppraisalProject_Type',
            vid: 'a3333333-b111-c111-d111-e11000000000',
            name: 'root object',
            licensingRounds: [
              {
                typename: 'LicensingRound_A_Type',
                vid: 'a3333333-b111-c111-d111-e21000000000',
                name: 'L1',
                prospects: [
                  {
                    typename: 'Prospect_A_Type',
                    vid: 'a3333333-b111-c111-d111-e21000000001',
                    name: 'PR1',
                    __typename: 'Prospect_A_Type',
                  },
                  {
                    typename: 'Prospect_A_Type',
                    vid: 'a3333333-b111-c111-d111-e21000000002',
                    name: 'PR2',
                    __typename: 'Prospect_A_Type',
                  },
                ],
                __typename: 'LicensingRound_A_Type',
              },
              {
                typename: 'LicensingRound_A_Type',
                vid: 'a3333333-b111-c111-d111-e22000000000',
                name: 'L2',
                prospects: [
                  {
                    typename: 'Prospect_A_Type',
                    vid: 'a3333333-b111-c111-d111-e22000000001',
                    name: 'PR2_1',
                    __typename: 'Prospect_A_Type',
                  },
                  {
                    typename: 'Prospect_A_Type',
                    vid: 'a3333333-b111-c111-d111-e22000000002',
                    name: 'PR2_2',
                    __typename: 'Prospect_A_Type',
                  },
                ],
                __typename: 'LicensingRound_A_Type',
              },
            ],
          },
        ],
        __typename: 'DomainObjectQuery',
      },
    },
  },
  loading: false,
  networkStatus: NetworkStatus.ready,
};

const successResponseWithNoData = {
  loading: false,
  networkStatus: NetworkStatus.ready,
};

beforeAll(() => {
  const client = new ApolloClient({
    link: createHttpLink({ uri: '/graphql', fetch }),
    cache: new InMemoryCache(),
  });

  logicConstructorService.init({ client, projectId: 'a3333333-b111-c111-d111-e00000000009' });
});

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('Project Structure actions', () => {
  test('Успешно загружается структура проектов', async () => {
    const store = mockStore({
      projectStructure: {
        ...initialState,
        projectStructureQuery: {
          query: '{ mock }',
          tree: ['geoEconomicAppraisalProjectList', 'licensingRounds', 'prospects'],
        },
      },
    });

    mockFetchProjectStructureListQuery(successResponse);
    const expectedAction = {
      type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST,
      nodeList: [
        {
          name: 'root object',
          id: 'a3333333-b111-c111-d111-e11000000000',
          iconId: 'blue-line',
          nodeList: [
            {
              name: 'L1',
              id: 'a3333333-b111-c111-d111-e21000000000',
              iconId: 'blue-line',
              nodeList: [
                {
                  name: 'PR1',
                  id: 'a3333333-b111-c111-d111-e21000000001',
                  iconId: 'blue-line',
                  nodeList: [],
                },
                {
                  name: 'PR2',
                  id: 'a3333333-b111-c111-d111-e21000000002',
                  iconId: 'blue-line',
                  nodeList: [],
                },
              ],
            },
            {
              name: 'L2',
              id: 'a3333333-b111-c111-d111-e22000000000',
              iconId: 'blue-line',
              nodeList: [
                {
                  name: 'PR2_1',
                  id: 'a3333333-b111-c111-d111-e22000000001',
                  iconId: 'blue-line',
                  nodeList: [],
                },
                {
                  name: 'PR2_2',
                  id: 'a3333333-b111-c111-d111-e22000000002',
                  iconId: 'blue-line',
                  nodeList: [],
                },
              ],
            },
          ],
        },
      ],
    };

    (store.dispatch as Dispatch<any>)(fetchProjectStructureList());

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
  });

  test('Корректно обрабатывает ответ с пустым полем data при запросе списка структуры проектов', async () => {
    const store = mockStore({
      projectStructure: {
        ...initialState,
        projectStructureQuery: {
          query: '{ mock }',
          tree: [],
        },
      },
    });

    mockFetchProjectStructureListQuery(successResponseWithNoData);

    (store.dispatch as Dispatch<any>)(fetchProjectStructureList());

    // TODO change when throwing/showing error will be implemented

    await waitFor(() => expect(store.getActions()).toEqual([]));
  });

  test('Корректно обрабатывает возникающие исключения', async () => {
    const store = mockStore({
      projectStructure: {
        ...initialState,
        projectStructureQuery: {
          query: 'mock { mock }',
          tree: [],
        },
      },
    });

    mockFetchProjectStructureListQuery(successResponse);

    (store.dispatch as Dispatch<any>)(fetchProjectStructureList());

    // TODO change when throwing/showing error will be implemented

    await waitFor(() => expect(store.getActions()).toEqual([]));
  });

  test('Корректно обрабатывает структуру проектов при отсутствии параметра tree в store', async () => {
    const store = mockStore({
      projectStructure: {
        ...initialState,
        projectStructureQuery: {
          query: '{ mock }',
          tree: null,
        },
      },
    });

    mockFetchProjectStructureListQuery(successResponse);
    const expectedAction = {
      type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST,
      nodeList: [
        {
          name: 'root object',
          id: 'a3333333-b111-c111-d111-e11000000000',
          iconId: 'blue-line',
          nodeList: [],
        },
      ],
    };

    (store.dispatch as Dispatch<any>)(fetchProjectStructureList());

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
  });

  test('Запрос на загрузку данных вызывается с корректными параметрами', () => {
    const mockProjectStuctureState = {
      ...initialState,
      projectStructureQuery: {
        query: '{ mock }',
        tree: ['geoEconomicAppraisalProjectList'],
      },
    };

    const store = mockStore({
      projectStructure: mockProjectStuctureState,
    });

    const mockQuery = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(successResponse);
        });
      });
    });

    jest.spyOn(logicConstructorService.client, 'query').mockImplementation(mockQuery);

    (store.dispatch as Dispatch<any>)(fetchProjectStructureList());

    expect(mockQuery).toBeCalledWith({
      query: gql(mockProjectStuctureState.projectStructureQuery.query),
      context: {
        uri: logicConstructorService.getGraphQlUri(),
      },
    });
  });

  test('Если нет query вызывается загрузка DEFAULT_QUERY', () => {
    const mockProjectStuctureState = {
      ...initialState,
      projectStructureQuery: {
        tree: ['geoEconomicAppraisalProjectList'],
      },
    };

    const store = mockStore({
      projectStructure: mockProjectStuctureState,
    });

    const mockQuery = jest.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve(successResponse);
        });
      });
    });

    jest.spyOn(logicConstructorService.client, 'query').mockImplementation(mockQuery);

    (store.dispatch as Dispatch<any>)(fetchProjectStructureList());

    expect(mockQuery).toBeCalledWith({
      query: gql(
        `{
          project {
            vid
            domain{
              geoEconomicAppraisalProjectList{
                vid name
              }
            }
          }
        }`,
      ),
      context: {
        uri: logicConstructorService.getGraphQlUri(),
      },
    });
  });
});
