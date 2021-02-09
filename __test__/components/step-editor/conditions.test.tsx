import React from 'react';
import renderer from 'react-test-renderer';
import ResizeObserver from 'resize-observer-polyfill';

import '../../../src/types/global';

import Conditions from '../../../src/components/step-editor/Conditions';

describe('Conditions', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer.create(<Conditions />).toJSON();
    expect(dom).toMatchSnapshot();
  });
});
