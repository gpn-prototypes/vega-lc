import { Dispatch } from 'react';
import { NetworkStatus } from '@apollo/client';
import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import '@/types/global';

import { ActivitiesActionTypes } from '@/redux-store/activities/action-types';
import { fetchActivitiesList } from '@/redux-store/activities/actions';
import initialState from '@/redux-store/activities/initial-state';
import { logicConstructorService } from '@/utils/lc-service/lc-service';

const mockStore = configureMockStore([thunkMiddleware]);

const mockActivityListQuery = (response: any) => {
  jest.spyOn(logicConstructorService, 'activityListQuery').mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(response);
      });
    });
  });
};

const successResponse = {
  data: {
    activityList: [
      {
        vid: 'test vid',
        code: '0',
        createdAt: '2021-01-25T14:37:50.759000',
        editedAt: '2021-01-25T14:37:50.759000',
        name: 'test name',
        title: 'test title',
        description: 'test desc',
        category: {
          vid: 'test cat vid',
          code: '1',
          name: 'teset cat name',
          parent: {
            vid: 'test cat parent vid',
            code: '2',
            name: 'test cat parent',
          },
        },
      },
      {
        vid: 'test vid2',
        code: '0',
        createdAt: '2021-01-25T14:37:50.759000',
        editedAt: '2021-01-25T14:37:50.759000',
        name: 'test name2',
        title: 'test title2',
        description: 'test desc2',
        category: {
          vid: 'test cat vid',
          code: '1',
          name: 'teset cat name',
          parent: {
            vid: 'test cat parent vid',
            code: '2',
            name: 'test cat parent',
          },
        },
      },
    ],
  },
  loading: false,
  networkStatus: NetworkStatus.ready,
};

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('Activities actions', () => {
  test('Успешно загружается список групп объектов', async () => {
    const store = mockStore(initialState);

    mockActivityListQuery(successResponse);

    (store.dispatch as Dispatch<any>)(fetchActivitiesList());

    const expectedAction = {
      type: ActivitiesActionTypes.SET_ACTIVITIES_LIST,
      nodeList: [
        {
          id: 'test cat vid',
          isDraggable: false,
          isDropZone: false,
          name: 'teset cat name',
          nodeList: [
            { iconId: 'blue-line', id: 'test vid', name: 'test name', nodeList: [] },
            { iconId: 'blue-line', id: 'test vid2', name: 'test name2', nodeList: [] },
          ],
        },
      ],
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
  });

  test('Не вызывает setActivitiesList при отсутствии данных в ответе сервера', async () => {
    const store = mockStore(initialState);

    mockActivityListQuery({});

    (store.dispatch as Dispatch<any>)(fetchActivitiesList());

    await waitFor(() => expect(store.getActions()).toEqual([]));
  });
});
