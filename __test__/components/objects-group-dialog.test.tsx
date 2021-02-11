import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ObjectsGroupDialog } from '../../src/components/objects-group/ObjectsGroupDialog';
import { getStore } from '../../src/redux-store';
import * as actions from '../../src/redux-store/group-objects/actions';
import ObjectsGroupInitialState from '../../src/redux-store/group-objects/initial-state';
import { createInitState } from '../utils/create-init-state';

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderObjectsGroupDialog = (store: Store) => {
  return render(
    <Provider store={store}>
      <ObjectsGroupDialog />
    </Provider>,
  );
};

describe('Диалог создания группы объектов', () => {
  const initState = createInitState({
    groupObjects: {
      ...ObjectsGroupInitialState,
      isDialogOpened: true,
    },
  });

  test('Рендерится без ошибок и присутствует в DOM', () => {
    const store = getStore(initState);

    const { baseElement } = renderObjectsGroupDialog(store);

    const dialog = baseElement.querySelector('.ObjectsGroupWidget__Dialog');

    expect(dialog).toBeInTheDocument();
  });

  test('Принимает и отображает введенное значение', () => {
    const store = getStore(initState);

    const { baseElement } = renderObjectsGroupDialog(store);

    const textField = baseElement.getElementsByTagName('input')[0];

    const objectsGroupName = 'new objects group';

    expect(textField.value).toBe('');

    fireEvent.change(textField, { target: { value: objectsGroupName } });

    expect(textField.value).toBe(objectsGroupName);
  });

  test('Поле ввода не принимает пробелы в качестве первого символа', () => {
    const store = getStore(initState);

    const { baseElement } = renderObjectsGroupDialog(store);

    const textField = baseElement.getElementsByTagName('input')[0];

    const spaceSymbol = ' ';

    expect(textField.value).toBe('');

    fireEvent.change(textField, { target: { value: spaceSymbol } });

    expect(textField.value).toBe('');
  });

  test('Проставляется флаг isDynamic при клике на свитчер', () => {
    const store = getStore(initState);

    renderObjectsGroupDialog(store);

    const switcher = screen.getByLabelText('Динамическая');

    expect(store.getState().groupObjects.newGroupParams.isDynamic).toBe(false);

    fireEvent.click(switcher);

    expect(store.getState().groupObjects.newGroupParams.isDynamic).toBe(true);
  });

  test('Диалоговое окно закрывается при клике на кнопку отмены', () => {
    const store = getStore(initState);

    renderObjectsGroupDialog(store);

    const cancelBtn = screen.getByText('Отмена');

    expect(store.getState().groupObjects.isDialogOpened).toBe(true);

    fireEvent.click(cancelBtn);

    expect(store.getState().groupObjects.isDialogOpened).toBe(false);
  });

  test('Группа создается с валидным названием', () => {
    const store = getStore(initState);

    const { baseElement } = renderObjectsGroupDialog(store);

    const mockedCreateNewGroup = jest.fn();

    jest
      .spyOn(actions, 'createNewGroup')
      .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

    const newGroupName = 'new group name';

    const createGroupBtn = screen.getByText('Создать группу');
    const textField = baseElement.getElementsByTagName('input')[0];

    fireEvent.change(textField, { target: { value: newGroupName } });

    expect(store.getState().groupObjects.newGroupParams.name).toBe(newGroupName);

    fireEvent.click(createGroupBtn);

    expect(mockedCreateNewGroup).toBeCalledTimes(1);
    expect(mockedCreateNewGroup).toHaveBeenCalledWith([newGroupName]);
  });
});
