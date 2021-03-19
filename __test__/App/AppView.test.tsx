import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { AppView } from '../../src/App/AppView';
import { ProjectContext } from '../../src/react-context/providers';
import { store } from '../../src/redux-store';
import { logicConstructorService } from '../../src/utils/lc-service';

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

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
  test('вызывается очистка store', async () => {
    jest.spyOn(logicConstructorService, 'projectStructureQuery').mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          return resolve({ data: {}, loading: false, networkStatus: 7 });
        });
      });
    });

    renderComponent('mock project id', true);

    expect(mockClearStores).toHaveBeenCalledTimes(1);
  });
});
