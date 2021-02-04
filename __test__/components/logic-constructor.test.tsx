import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import { Store } from 'redux';
import configureMockStore from 'redux-mock-store';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { LogicConstructorWidget } from '../../src/components/logic-constructor';
import initialState from '../../src/redux-store/logic-constructor/initial-state';

const mockStore = configureMockStore();

jest.mock('../../src/components/activities', () => {
  return {
    ActivitiesWidget: () => {
      return <div data-testid="activities" />;
    },
  };
});

jest.mock('../../src/components/canvas', () => {
  return {
    CanvasWidget: () => {
      return <div data-testid="canvas" />;
    },
  };
});

jest.mock('../../src/components/step-editor', () => {
  return () => {
    return <div data-testid="step-editor" />;
  };
});

const renderComponent = (store: Store) => {
  return render(
    <Provider store={store}>
      <LogicConstructorWidget />
    </Provider>,
  );
};

describe('Logic Constructor', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const storeData = { logicConstructor: initialState };
    const store = mockStore(storeData);

    const dom = renderer
      .create(
        <Provider store={store}>
          <LogicConstructorWidget />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('не отображается редактор шага при isStepEditorOpened = false', () => {
    const storeData = {
      logicConstructor: {
        ...initialState,
        isStepEditorOpened: false,
      },
    };
    const store = mockStore(storeData);

    const component = renderComponent(store);

    const stepEditor = component.queryByTestId('step-editor');

    expect(stepEditor).not.toBeInTheDocument();
  });

  test('отображается редактор шага при isStepEditorOpened = true', () => {
    const storeData = {
      logicConstructor: {
        ...initialState,
        isStepEditorOpened: true,
      },
    };
    const store = mockStore(storeData);

    const component = renderComponent(store);

    const stepEditor = component.queryByTestId('step-editor');

    expect(stepEditor).toBeInTheDocument();
  });
});
