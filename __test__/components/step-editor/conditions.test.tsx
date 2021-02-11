import React from 'react';
import renderer from 'react-test-renderer';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import Conditions from '@/components/step-editor/Conditions';

describe('Conditions', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer.create(<Conditions />).toJSON();
    expect(dom).toMatchSnapshot();
  });
});
