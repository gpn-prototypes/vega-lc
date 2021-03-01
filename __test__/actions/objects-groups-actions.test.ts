import { Dispatch } from 'react';
import { IconAlert } from '@gpn-prototypes/vega-ui';
import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { GroupObjectsActionTypes } from '../../src/redux-store/group-objects/action-types';
import {
  createNewGroup,
  fetchGroupObjectList,
  updateGroupObject,
} from '../../src/redux-store/group-objects/actions';

import initialState from '@/redux-store/group-objects/initial-state';
import * as graphqlRequest from '@/utils/graphql-request';

const mockStore = configureMockStore([thunkMiddleware]);

jest.mock('@/utils/graphql-request', () => {
  const originalModule = jest.requireActual('@/utils/graphql-request');

  return {
    ...originalModule,
    groupObjectListQuery: jest.fn(),
    objectGroupCreateMutation: jest.fn(),
    objectGroupUpdateMutation: jest.fn(),
  };
});

const mockQuery = (options: {
  method: 'objectGroupCreateMutation' | 'groupObjectListQuery' | 'objectGroupUpdateMutation';
  response?: any;
  error?: any;
}) => {
  const { method, response, error = 'NetworkError' } = options;

  jest.spyOn(graphqlRequest, method).mockImplementation(() => {
    return new Promise((resolve, reject) => {
      if (response) {
        resolve(response);

        return;
      }

      reject(error);
    });
  });
};

beforeEach(() => {
  jest.restoreAllMocks();
});

const mockedObjectsGroupList = {
  data: {
    domain: {
      objectGroupList: [
        {
          vid: 'group-test-vid',
          name: 'test-name',
          objects: [
            {
              vid: 'test-object-vid',
              name: 'test-object-name',
            },
          ],
        },
      ],
    },
  },
};

describe('Objects group actions', () => {
  test('Устанавливаются группы объектов', async () => {
    const store = mockStore(initialState);

    mockQuery({ method: 'groupObjectListQuery', response: mockedObjectsGroupList });

    (store.dispatch as Dispatch<any>)(fetchGroupObjectList());

    const expectedAction = {
      type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST,
      nodeList: [
        {
          id: 'group-test-vid',
          name: 'test-name',
          iconId: 'square',
          nodeList: [
            {
              name: 'test-object-name',
              id: 'test-object-vid',
              iconId: 'circle',
              nodeList: [],
              isDropZone: true,
              isDraggable: false,
            },
          ],
        },
      ],
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
  });

  test('Устанавливает пустой массив при отсутствии групп объектов в ответе с сервера', async () => {
    const store = mockStore(initialState);

    mockQuery({ method: 'groupObjectListQuery', response: {} });

    (store.dispatch as Dispatch<any>)(fetchGroupObjectList());

    const expectedAction = {
      type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST,
      nodeList: [],
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
  });

  test('При запросе групп объектов обрабатывает ошибку с сервера', async () => {
    const store = mockStore(initialState);

    mockQuery({ method: 'groupObjectListQuery' });

    await waitFor(() => expect(store.getActions()).toEqual([]));
  });

  test('При успешном создании группы закрывает диалог, заново запрашивает и устанавливает группы объектов', async () => {
    const store = mockStore(initialState);

    const expectedActions = [
      { isDialogOpened: false, type: GroupObjectsActionTypes.TOGGLE_DIALOG },
      {
        nodeList: [],
        type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST,
      },
    ];

    mockQuery({ method: 'objectGroupCreateMutation', response: { data: {} } });
    mockQuery({ method: 'groupObjectListQuery', response: {} });

    (store.dispatch as Dispatch<any>)(createNewGroup('test-name'));

    await waitFor(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('Обрабатывает ошибку с сервера при попытке создания группы c неуникальным названием и устанавливает уведомление об ошибке', async () => {
    const store = mockStore(initialState);

    const testName = 'test-name';
    const errorMessage = `There exists name "${testName}" in Domain Object Groups`;

    const expectedActions = [
      {
        notification: {
          icon: IconAlert,
          message: `Группа объектов с именем "${testName}" уже существует`,
          status: 'alert',
        },
        type: 'Notification_SET_NOTIFICATION',
      },
    ];

    mockQuery({
      method: 'objectGroupCreateMutation',
      error: {
        graphQLErrors: [
          {
            message: errorMessage,
          },
        ],
      },
    });

    (store.dispatch as Dispatch<any>)(createNewGroup(testName));

    await waitFor(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('При успешном обновлении группы заново запрашивает и устанавливает группы объектов', async () => {
    const store = mockStore({
      groupObjects: {
        ...initialState,
        nodeList: [
          {
            id: 'test-id',
            nodeList: [],
          },
        ],
      },
    });

    const expectedActions = [
      {
        nodeList: [],
        type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST,
      },
    ];

    mockQuery({ method: 'objectGroupUpdateMutation', response: { data: {} } });
    mockQuery({ method: 'groupObjectListQuery', response: {} });

    (store.dispatch as Dispatch<any>)(updateGroupObject('test-id', ['new-group']));

    await waitFor(() => expect(store.getActions()).toEqual(expectedActions));
  });

  test('Проверяет и не добавляет объект в группу, если уже есть объект с таким ID', async () => {
    const store = mockStore({
      groupObjects: {
        ...initialState,
        nodeList: [
          {
            id: 'test-id',
            nodeList: [
              {
                id: 'test-object-id',
              },
            ],
          },
        ],
      },
    });

    (store.dispatch as Dispatch<any>)(updateGroupObject('test-id', ['test-object-id']));

    await waitFor(() => expect(store.getActions()).toEqual([]));
  });
});
