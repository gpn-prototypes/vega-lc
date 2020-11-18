import { TreeItem } from '@gpn-prototypes/vega-ui';

import { GroupObjectsActionTypes } from '../../src/redux-store/group-objects/action-types';
import groupObjectsReducer from '../../src/redux-store/group-objects/reducer';

describe('group objects reducer test', () => {
  let mockState: TreeItem[];

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
    const action = { type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST };
    const newState = groupObjectsReducer(undefined, action);
    expect(newState.nodeList).toEqual([]);
  });

  test('set node list', () => {
    const action = { type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST, nodeList: mockState };
    const newState = groupObjectsReducer({ nodeList: 'unexpected data type' }, action);
    expect(newState.nodeList).toEqual(mockState);
  });
});
