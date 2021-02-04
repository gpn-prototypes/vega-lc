import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ObjectsGroupWidget } from '../../src/components/objects-group';
import { ObjectsGroupDialog } from '../../src/components/objects-group/ObjectsGroupDialog';
import { getStore } from '../../src/redux-store';
import ObjectsGroupInitialState from '../../src/redux-store/group-objects/initial-state';
import { createInitState } from '../utils/create-init-state';

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

const renderObjectsGroup = (store: Store) => {
  return render(
    <Provider store={store}>
      <ObjectsGroupWidget />
    </Provider>,
  );
};

describe('Группы объектов', () => {
  test('рендерится без ошибок', () => {
    const store = getStore();

    const { container } = renderObjectsGroup(store);

    expect(container).toBeInTheDocument();
  });
});

const renderObjectsGroupDialog = (store: Store) => {
  return render(
    <Provider store={store}>
      <ObjectsGroupDialog />
    </Provider>,
  );
};

describe('Диалог создания группы объектов', () => {
  test('рендерится без ошибок', () => {
    const initState = createInitState({
      groupObjects: {
        ...ObjectsGroupInitialState,
        isDialogOpened: true,
      },
    });

    const store = getStore(initState);

    const { container } = renderObjectsGroupDialog(store);

    expect(container).toBeInTheDocument();
  });
});
