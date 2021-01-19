import { clearStores } from '../../src/redux-store/clear/actions';
import {
  setGroupObjectsDraggingElements,
  setGroupObjectsList,
  setNewGroupParams,
  toggleDialog,
} from '../../src/redux-store/group-objects/actions';
import initialState from '../../src/redux-store/group-objects/initial-state';
import groupObjectsReducer from '../../src/redux-store/group-objects/reducer';
import { GroupObjectsState } from '../../src/types/redux-store';

describe('group objects reducer test', () => {
  let mockState: GroupObjectsState;

  beforeEach(() => {
    mockState = {
      ...initialState,
      nodeList: [
        {
          name: 'mock',
          id: '1',
          nodeList: [],
        },
      ],
      isDialogOpened: true,
      newGroupParams: {
        isDynamic: false,
        name: 'mock name',
      },
      draggingElements: [
        {
          ref: null,
          id: 'mock id',
          isDraggable: true,
        },
      ],
    };
  });

  test('устанавливается пустой список групп объектов', () => {
    const action = setGroupObjectsList([]);
    const newState = groupObjectsReducer(undefined, action);
    expect(newState.nodeList).toEqual([]);
  });

  test('устанавливается наполненный список групп объектов', () => {
    const action = setGroupObjectsList(mockState.nodeList);
    const newState = groupObjectsReducer({ nodeList: 'unexpected data type' }, action);
    expect(newState.nodeList).toEqual(mockState.nodeList);
  });

  test('устанавливается список dragging elements', () => {
    const action = setGroupObjectsDraggingElements(mockState.draggingElements);
    const newState = groupObjectsReducer(initialState, action);
    expect(newState.draggingElements).toEqual(mockState.draggingElements);
  });

  test('устанавливаются параметры для новых групп', () => {
    const action = setNewGroupParams(mockState.newGroupParams);
    const newState = groupObjectsReducer(initialState, action);
    expect(newState.newGroupParams).toEqual(mockState.newGroupParams);
  });

  test('устанавливается параметр isDialogOpened', () => {
    const action = toggleDialog(mockState.isDialogOpened);
    const newState = groupObjectsReducer(initialState, action);
    expect(newState.isDialogOpened).toBe(mockState.isDialogOpened);
  });

  test('очищается store', () => {
    const action = clearStores();
    const newState = groupObjectsReducer(mockState, action);
    expect(newState).toEqual(initialState);
  });
});
