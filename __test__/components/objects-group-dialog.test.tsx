import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import { ObjectsGroupDialog } from '../../src/components/objects-group/ObjectsGroupDialog';
import { getStore } from '../../src/redux-store';
import * as actions from '../../src/redux-store/group-objects/actions';
import ObjectsGroupInitialState from '../../src/redux-store/group-objects/initial-state';
import { createInitState } from '../testing-helpers/create-init-state';

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

  describe('Валидация названия создаваемой группы объектов', () => {
    test('В поле ввода можно ввести не более 256 символов', () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const textField = baseElement.getElementsByTagName('input')[0];

      const longText = 'аааааааааа'.repeat(26);

      expect(textField.value).toBe('');

      fireEvent.change(textField, { target: { value: longText } });

      expect(textField.value.length).toBe(256);

      const errorMessage = 'Достигнуто максимальное количество символов';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeInTheDocument();
    });

    test('Поле вывода ошибки очищается при внесении изменений в поле ввода названия', () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const textField = baseElement.getElementsByTagName('input')[0];

      const longText = 'аааааааааа'.repeat(26);

      expect(textField.value).toBe('');

      fireEvent.change(textField, { target: { value: longText } });

      expect(textField.value.length).toBe(256);

      const errorMessage = 'Достигнуто максимальное количество символов';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeInTheDocument();

      fireEvent.change(textField, { target: { value: 'new text' } });
      expect(errorMessageLabel).toHaveTextContent('');
    });

    test('Нельзя отправить пустое название', () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const textField = baseElement.getElementsByTagName('input')[0];
      const createGroupBtn = screen.getByText('Создать группу');

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      expect(textField.value).toBe('');
      fireEvent.click(createGroupBtn);

      const errorMessage = 'Название группы объектов не может быть пустым';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeInTheDocument();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });

    test('Нельзя отправить название состоящее из одного символа', () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const textField = baseElement.getElementsByTagName('input')[0];
      const createGroupBtn = screen.getByText('Создать группу');

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      const character = 'a';

      fireEvent.change(textField, { target: { value: character } });

      expect(textField.value).toBe(character);
      fireEvent.click(createGroupBtn);

      const errorMessage = 'Название группы объектов должно содержать более одного символа';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeInTheDocument();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });

    test('Нельзя отправить название уже существующей группы объектов', () => {
      const mockGroup = { id: 'mock id', name: 'name', nodeList: [] };
      const groupState = createInitState({
        groupObjects: {
          ...ObjectsGroupInitialState,
          nodeList: [mockGroup],
          isDialogOpened: true,
        },
      });
      const store = getStore(groupState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const textField = baseElement.getElementsByTagName('input')[0];
      const createGroupBtn = screen.getByText('Создать группу');

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      fireEvent.change(textField, { target: { value: mockGroup.name } });

      expect(textField.value).toBe(mockGroup.name);
      fireEvent.click(createGroupBtn);

      const errorMessage = `Группа объектов с именем "${mockGroup.name}" уже существует`;
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeInTheDocument();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });
  });
});
