import React from 'react';
import renderer from 'react-test-renderer';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import Effects from '@/components/step-editor/Effects';

describe('Effects', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer.create(<Effects />).toJSON();
    expect(dom).toMatchSnapshot();
  });
});
