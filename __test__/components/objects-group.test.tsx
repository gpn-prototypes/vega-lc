import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { TreeItem } from '@gpn-prototypes/vega-tree';

import { ObjectsGroupWidget } from '../../src/components/objects-group';
import getStore from '../../src/redux-store';

describe('Geological Exploration', () => {
  let mockObjectsGroup: TreeItem[] = [];

  beforeEach(() => {
    mockObjectsGroup = [
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
          <ObjectsGroupWidget objectsGroup={mockObjectsGroup} />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });
});
