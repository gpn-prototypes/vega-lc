import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render, waitFor } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { AppView } from '../../src/App/AppView';
import { ProjectContext } from '../../src/react-context/providers';
import { store } from '../../src/redux-store';

const mockClearStores = jest.fn();

jest.mock('../../src/redux-store/clear/actions', () => {
  return {
    clearStores: () => mockClearStores,
  };
});

beforeEach(() => {
  mockClearStores.mockClear();
});

const renderComponent = (projectId = '', initialized = false) => {
  return render(
    <Provider store={store}>
      <ProjectContext.Provider value={{ projectId, initialized }}>
        <AppView />
      </ProjectContext.Provider>
    </Provider>,
  );
};

describe('AppView', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer
      .create(
        <Provider store={store}>
          <AppView />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('вызывается очистка store', async () => {
    renderComponent('mock project id', true);

    await waitFor(() => expect(mockClearStores).toHaveBeenCalledTimes(1));
  });
});
