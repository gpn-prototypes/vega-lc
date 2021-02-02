import { clearStores } from '../../src/redux-store/clear/actions';
import {
  setProjectStructureDraggingElements,
  setProjectStructureList,
} from '../../src/redux-store/project-structure/actions';
import initialState from '../../src/redux-store/project-structure/initial-state';
import projectStructureReducer from '../../src/redux-store/project-structure/reducer';
import { ProjectStructureState } from '../../src/types/redux-store';

describe('project structure reducer test', () => {
  let mockState: ProjectStructureState;

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
      draggingElements: [
        {
          ref: null,
          id: 'mock id',
          isDraggable: true,
        },
      ],
    };
  });

  test('устанавливается пустой список структуры проекта', () => {
    const action = setProjectStructureList([]);
    const newState = projectStructureReducer(undefined, action);
    expect(newState.nodeList).toEqual([]);
  });

  test('устанавливается наполненный список структуры проекта', () => {
    const action = setProjectStructureList(mockState.nodeList);
    const newState = projectStructureReducer({ nodeList: 'unexpected data type' }, action);
    expect(newState.nodeList).toEqual(mockState.nodeList);
  });

  test('устанавливается список dragging elements', () => {
    const action = setProjectStructureDraggingElements(mockState.draggingElements);
    const newState = projectStructureReducer(initialState, action);
    expect(newState.draggingElements).toEqual(mockState.draggingElements);
  });

  test('очищается store', () => {
    const action = clearStores();
    const newState = projectStructureReducer(mockState, action);
    expect(newState).toEqual(initialState);
  });
});
