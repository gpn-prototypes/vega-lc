import { clearStores } from '../../src/redux-store/clear/actions';
import { LogicConstructorActionTypes } from '../../src/redux-store/logic-constructor/action-types';
import {
  setCanvasElements,
  setScenarioList,
} from '../../src/redux-store/logic-constructor/actions';
import initialState from '../../src/redux-store/logic-constructor/initial-state';
import logicConstructorReducer from '../../src/redux-store/logic-constructor/reducer';
import { LogicConstructorState } from '../../src/types/redux-store';

describe('logic constructor reducer test', () => {
  let mockState: LogicConstructorState;

  beforeEach(() => {
    mockState = {
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
          id: 'mock id',
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
          data: {},
          title: 'mock title',
          type: 'step',
          position: { x: 0, y: 0 },
        },
      ],
      isStepEditorOpened: true,
    };
  });

  test('устанавливается список шагов сценария', () => {
    const action = setScenarioList(mockState.scenarioList);
    const newState = logicConstructorReducer(initialState, action);
    expect(newState.scenarioList).toEqual(mockState.scenarioList);
  });

  test('устанавливается наполненный список структуры проекта', () => {
    const action = setCanvasElements(mockState.canvasElements);
    const newState = logicConstructorReducer(initialState, action);
    expect(newState.canvasElements).toEqual(mockState.canvasElements);
  });

  test('добавляется элемент canvas', () => {
    const mockCanvasElement = {
      title: 'new mock element',
      type: 'step',
      position: { x: 10, y: 10 },
    };
    const action = {
      type: LogicConstructorActionTypes.ADD_CANVAS_ELEMENT,
      canvasElement: mockCanvasElement,
    };
    const newState = logicConstructorReducer(mockState, action);
    expect(newState.canvasElements).toContainEqual(mockCanvasElement);
  });

  test('устанавливается параметр isStepEditorOpened', () => {
    const action = {
      type: LogicConstructorActionTypes.TOGGLE_STEP_EDITOR,
      isStepEditorOpened: mockState.isStepEditorOpened,
    };
    const newState = logicConstructorReducer(initialState, action);
    expect(newState.isStepEditorOpened).toBe(mockState.isStepEditorOpened);
  });

  test('очищается store', () => {
    const action = clearStores();
    const newState = logicConstructorReducer(mockState, action);
    expect(newState).toEqual(initialState);
  });

  test('происходит замена ID элемента канвас', () => {
    const action = {
      type: LogicConstructorActionTypes.REPLACE_CANVAS_ELEMENT_ID,
      id: 'mock id',
      replaceId: 'replaced id',
    };
    const newState = logicConstructorReducer(mockState, action);
    expect(newState.canvasElements[0].id).toEqual('replaced id');
  });
});
