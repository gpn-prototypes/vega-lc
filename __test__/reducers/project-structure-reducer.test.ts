import { clearStores } from '@/redux-store/clear/actions';
import { ProjectStructureActionTypes } from '@/redux-store/project-structure/action-types';
import {
  setProjectStructureDraggingElements,
  setProjectStructureList,
} from '@/redux-store/project-structure/actions';
import initialState from '@/redux-store/project-structure/initial-state';
import projectStructureReducer from '@/redux-store/project-structure/reducer';
import { ProjectStructureState } from '@/types/redux-store';

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
      projectStructureQuery: {
        query: 'mock query',
        tree: ['mock tree element 1', 'mock tree element 2'],
      },
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

  test('устанавливается список dragging elements', () => {
    const action = setProjectStructureDraggingElements(mockState.draggingElements);
    const newState = projectStructureReducer(initialState, action);
    expect(newState.draggingElements).toEqual(mockState.draggingElements);
  });

  test('устанавливается project structure query', () => {
    const setProjectQueryAction = {
      type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY,
      projectStructureQuery: mockState.projectStructureQuery,
    };

    const newState = projectStructureReducer(initialState, setProjectQueryAction);
    expect(newState.projectStructureQuery).toEqual(mockState.projectStructureQuery);
  });

  test('очищается store', () => {
    const action = clearStores();
    const newState = projectStructureReducer(mockState, action);
    expect(newState).toEqual(initialState);
  });
});
