import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { TreeItem } from '@gpn-prototypes/vega-tree';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ProjectStructureWidget } from '../../src/components/project-structure';
import getStore from '../../src/redux-store';

describe('Geological Exploration', () => {
  let mockProjectStructure: TreeItem[] = [];

  beforeEach(() => {
    mockProjectStructure = [
      {
        name: 'mock',
        id: '1',
        nodeList: [],
      },
    ];
  });

  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer
      .create(
        <Provider store={getStore()}>
          <ProjectStructureWidget projectStructure={mockProjectStructure} />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });
});
