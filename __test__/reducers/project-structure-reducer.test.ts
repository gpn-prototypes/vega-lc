import { TreeItem } from '@gpn-prototypes/vega-tree';

import { ProjectStructureActionTypes } from '../../src/redux-store/project-structure/action-types';
import projectStructureReducer from '../../src/redux-store/project-structure/reducer';

describe('project structure reducer test', () => {
  let mockState: TreeItem[] = [];

  beforeEach(() => {
    mockState = [
      {
        name: 'mock',
        id: '1',
        nodeList: [],
      },
    ];
  });

  test('set empty node list', () => {
    const action = { type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST };
    const newState = projectStructureReducer(undefined, action);
    expect(newState.nodeList).toEqual([]);
  });

  test('set node list', () => {
    const action = {
      type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST,
      nodeList: mockState,
    };
    const newState = projectStructureReducer({ nodeList: 'unexpected data type' }, action);
    expect(newState.nodeList).toEqual(mockState);
  });
});
