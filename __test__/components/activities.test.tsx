import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ActivitiesWidget } from '../../src/components/activities';
import getStore from '../../src/redux-store';

describe('Geological Exploration', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer
      .create(
        <Provider store={getStore()}>
          <ActivitiesWidget />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });
});
