import { TreeItem } from '@gpn-prototypes/vega-ui';

import { ActivitiesActionTypes } from '../../src/redux-store/activities/action-types';
import activitiesReducer from '../../src/redux-store/activities/reducer';

describe('activities reducer test', () => {
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
    const action = { type: ActivitiesActionTypes.SET_ACTIVITIES_LIST };
    const newState = activitiesReducer(undefined, action);
    expect(newState.nodeList).toEqual([]);
  });

  test('set node list', () => {
    const action = { type: ActivitiesActionTypes.SET_ACTIVITIES_LIST, nodeList: mockState };
    const newState = activitiesReducer({ nodeList: 'unexpected data type' }, action);
    expect(newState.nodeList).toEqual(mockState);
  });
});
