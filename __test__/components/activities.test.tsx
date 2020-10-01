import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { TreeItem } from '@gpn-prototypes/vega-tree';

import { ActivitiesWidget } from '../../src/components/activities';
import getStore from '../../src/redux-store';

describe('Geological Exploration', () => {
  let mockActivities: TreeItem[] = [];

  beforeEach(() => {
    mockActivities = [
      {
        name: 'mock',
        id: '1',
        nodeList: [],
      },
    ];
  });

  test('рендерится без ошибок', () => {
    const dom = renderer
      .create(
        <Provider store={getStore()}>
          <ActivitiesWidget activities={mockActivities} />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });
});
