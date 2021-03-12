import { Dispatch } from 'react';
import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import { LogicConstructorActionTypes } from '../../src/redux-store/logic-constructor/action-types';
import { syncCanvasState } from '../../src/redux-store/logic-constructor/actions';
import initialState from '../../src/redux-store/logic-constructor/initial-state';
import { StoreLC } from '../../src/types/redux-store';

import { logicConstructorService } from '@/utils/lc-service/lc-service';

const mockStore = configureMockStore([thunkMiddleware]);

const mockQuery = (options: {
  method: 'scenarioStepCreateMutation' | 'canvasNodeCreateMutation';
  response?: any;
  error?: any;
}) => {
  const { method, response, error = 'NetworkError' } = options;

  jest.spyOn(logicConstructorService, method).mockImplementation(() => {
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

const mockedCreateCanvasNode = {
  data: {
    project: {
      logic: {
        canvas: {
          create: {
            result: {
              vid: 'created_canvas_node_id',
            },
          },
        },
      },
    },
  },
};

const mockedCreateScenarioStep = {
  data: {
    project: {
      logic: {
        scenarioStep: {
          create: {
            result: {
              vid: 'scenario_step_id',
            },
          },
        },
      },
    },
  },
};

describe('Objects group actions', () => {
  let mockState: Partial<StoreLC>;

  beforeEach(() => {
    mockState = {
      logicConstructor: {
        ...initialState,
        scenarioList: [
          {
            name: 'mock name',
            vid: 'mock step vid',
            itemList: [],
          },
        ],
        canvasElements: [
          {
            id: 'mock_id',
            getId() {
              return this.id;
            },
            getChildren() {
              return [];
            },
            getParents() {
              return [];
            },
            getData() {
              return this.data;
            },
            setData(data) {
              this.data = data;
            },
            data: {
              type: 'step',
              position: { x: 0, y: 0 },
              title: 'mock step title',
            },
          },
        ],
        isStepEditorOpened: true,
      },
    };
  });

  test('Происходит подмена ID при создании canvas node', async () => {
    const store = mockStore(mockState);

    mockQuery({ method: 'scenarioStepCreateMutation', response: mockedCreateScenarioStep });
    mockQuery({ method: 'canvasNodeCreateMutation', response: mockedCreateCanvasNode });

    (store.dispatch as Dispatch<any>)(
      syncCanvasState({
        type: 'add-tree',
        id: 'mock_id',
      }),
    );

    const expectedAction = {
      type: LogicConstructorActionTypes.REPLACE_CANVAS_ELEMENT_ID,
      id: 'mock_id',
      replaceId: 'created_canvas_node_id',
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(expectedAction));
  });
});
