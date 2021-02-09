import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Store } from 'redux';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import ResizeObserver from 'resize-observer-polyfill';

import '../../../src/types/global';

import StepEditor from '../../../src/components/step-editor';
import { cnStepEditor } from '../../../src/components/step-editor/cn-lc';
import { store } from '../../../src/redux-store';
import { LogicConstructorActionTypes } from '../../../src/redux-store/logic-constructor/action-types';
import initialState from '../../../src/redux-store/logic-constructor/initial-state';

jest.mock('../../../src/components/step-editor/CommonInfo', () => {
  return () => {
    return <div data-testid="common-info" />;
  };
});

jest.mock('../../../src/components/step-editor/Conditions', () => {
  return () => {
    return <div data-testid="conditions" />;
  };
});

jest.mock('../../../src/components/step-editor/Effects', () => {
  return () => {
    return <div data-testid="effects" />;
  };
});

const middlewares = [thunkMiddleware];
const mockStore = configureMockStore(middlewares);

const renderComponent = (customStore: Store) => {
  return render(
    <Provider store={customStore}>
      <StepEditor />
    </Provider>,
  );
};

describe('Step Editor', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer
      .create(
        <Provider store={store}>
          <StepEditor />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('при переключении вкладки отображается нужный компонент', async () => {
    const mockedStore = mockStore({ logicConstructor: initialState });

    const component = await renderComponent(mockedStore);

    const tabs = component.container.querySelectorAll('.TabsTab');

    if (tabs[1]) {
      fireEvent.click(tabs[1]);
    }

    const conditions = component.queryByTestId('conditions');
    await waitFor(() => expect(conditions).toBeInTheDocument());

    if (tabs[2]) {
      fireEvent.click(tabs[2]);
    }

    const effects = component.queryByTestId('effects');
    await waitFor(() => expect(effects).toBeInTheDocument());

    if (tabs[0]) {
      fireEvent.click(tabs[0]);
    }

    const commonInfo = component.queryByTestId('common-info');
    await waitFor(() => expect(commonInfo).toBeInTheDocument());
  });

  test('редактор шага закрывается по нажатию на кнопку', async () => {
    const updateState = jest.fn();
    const mockCanvasViewRef = { current: { updateState } };
    const mockedStore = mockStore({
      logicConstructor: {
        ...initialState,
        isStepEditorOpened: true,
        canvasViewRef: mockCanvasViewRef,
      },
    });

    const component = await renderComponent(mockedStore);

    const closeButton = component.container.querySelector(`.${cnStepEditor('CloseBtn')}`);

    if (closeButton) {
      fireEvent.click(closeButton);
    }

    const expectedAction = {
      type: LogicConstructorActionTypes.TOGGLE_STEP_EDITOR,
      isStepEditorOpened: false,
    };

    await waitFor(() => expect(mockedStore.getActions()).toContainEqual(expectedAction));
    expect(updateState).toHaveBeenCalledTimes(1);
  });
});
