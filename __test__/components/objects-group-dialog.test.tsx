import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import { createInitState } from '../testing-helpers/create-init-state';

import { ObjectsGroupDialog } from '@/components/objects-group/ObjectsGroupDialog';
import { getStore } from '@/redux-store';
import * as actions from '@/redux-store/group-objects/actions';
import ObjectsGroupInitialState from '@/redux-store/group-objects/initial-state';

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  jest.restoreAllMocks();
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

    renderObjectsGroupDialog(store);

    const textField = screen.getByPlaceholderText(
      'Введите название группы объектов',
    ) as HTMLInputElement;

    const objectsGroupName = 'new objects group';

    expect(textField.value).toBe('');

    fireEvent.change(textField, { target: { value: objectsGroupName } });

    expect(textField.value).toBe(objectsGroupName);
  });

  test('Проставляется флаг isDynamic при клике на свитчер', () => {
    const store = getStore(initState);

    renderObjectsGroupDialog(store);

    const switcher = screen.getByLabelText('Динамическая');
    expect(switcher).not.toBeChecked();

    fireEvent.click(switcher);

    expect(switcher).toBeChecked();
  });

  test('Диалоговое окно закрывается при клике на кнопку отмены', () => {
    const store = getStore(initState);

    renderObjectsGroupDialog(store);

    const cancelBtn = screen.getByText('Отмена');

    expect(store.getState().groupObjects.isDialogOpened).toBe(true);

    fireEvent.click(cancelBtn);

    expect(store.getState().groupObjects.isDialogOpened).toBe(false);
  });

  test('Диалоговое окно закрывается при клике на кнопку закрытия (в вернем углу)', () => {
    const store = getStore(initState);

    const { baseElement } = renderObjectsGroupDialog(store);

    const closeBtn = baseElement.querySelector('.ObjectsGroupWidget__DialogCloser');

    expect(store.getState().groupObjects.isDialogOpened).toBe(true);

    if (closeBtn) {
      fireEvent.click(closeBtn);
    }

    expect(store.getState().groupObjects.isDialogOpened).toBe(false);
  });

  test('Группа создается с валидным названием', () => {
    const store = getStore(initState);

    renderObjectsGroupDialog(store);

    const mockedCreateNewGroup = jest.fn();

    jest
      .spyOn(actions, 'createNewGroup')
      .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

    const newGroupName = 'new group name';

    const createGroupBtn = screen.getByText('Создать группу');
    const textField = screen.getByPlaceholderText(
      'Введите название группы объектов',
    ) as HTMLInputElement;

    fireEvent.change(textField, { target: { value: newGroupName } });

    fireEvent.click(createGroupBtn);

    expect(mockedCreateNewGroup).toBeCalledTimes(1);
    expect(mockedCreateNewGroup).toHaveBeenCalledWith([newGroupName]);
  });

  describe('Валидация названия создаваемой группы объектов', () => {
    test('Нельзя отправить название состоящее из более 256 символов', () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;

      const longText = 'аааааааааа'.repeat(26);

      expect(textField.value).toBe('');

      fireEvent.change(textField, { target: { value: longText } });

      const createGroupBtn = screen.getByText('Создать группу');
      fireEvent.click(createGroupBtn);

      const errorMessage = 'Название проекта не может быть менее 2 символов и более 256 символов';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeVisible();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });

    test('Поле вывода ошибки очищается при внесении изменений в поле ввода названия', () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;

      const longText = 'аааааааааа'.repeat(26);

      expect(textField.value).toBe('');

      fireEvent.change(textField, { target: { value: longText } });
      fireEvent.blur(textField);

      const errorMessage = 'Название проекта не может быть менее 2 символов и более 256 символов';
      const errorMessageLabel = screen.queryByText(errorMessage);
      expect(errorMessageLabel).toBeVisible();

      fireEvent.change(textField, { target: { value: 'new text' } });

      expect(screen.queryByText(errorMessage)).toBeNull();
    });

    test('Нельзя отправить пустое название', () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;
      const createGroupBtn = screen.getByText('Создать группу');

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      expect(textField.value).toBe('');
      fireEvent.click(createGroupBtn);

      const errorMessage = 'Заполните обязательное поле';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeVisible();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });

    test('Нельзя отправить название состоящее из одного символа', () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;
      const createGroupBtn = screen.getByText('Создать группу');

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      const character = 'a';

      fireEvent.change(textField, { target: { value: character } });

      expect(textField.value).toBe(character);
      fireEvent.click(createGroupBtn);

      const errorMessage = 'Название проекта не может быть менее 2 символов и более 256 символов';
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeInTheDocument();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });

    test('Удаляются лишние пробелы', () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const mockedCreateNewGroup = jest.fn();

      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      const newGroupName = '           group name           ';

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;
      fireEvent.change(textField, { target: { value: newGroupName } });

      const createGroupBtn = screen.getByText('Создать группу');
      fireEvent.click(createGroupBtn);

      expect(mockedCreateNewGroup).toBeCalledTimes(1);
      expect(mockedCreateNewGroup).toHaveBeenCalledWith([newGroupName.trim()]);
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

      renderObjectsGroupDialog(store);

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;
      const createGroupBtn = screen.getByText('Создать группу');

      const mockedCreateNewGroup = jest.fn();
      jest
        .spyOn(actions, 'createNewGroup')
        .mockImplementationOnce((...args) => (): unknown => mockedCreateNewGroup(args));

      fireEvent.change(textField, { target: { value: mockGroup.name } });

      expect(textField.value).toBe(mockGroup.name);
      fireEvent.click(createGroupBtn);

      const errorMessage = `Группа объектов с таким именем уже существует`;
      const errorMessageLabel = screen.getByText(errorMessage);
      expect(errorMessageLabel).toBeVisible();
      expect(mockedCreateNewGroup).toBeCalledTimes(0);
    });
  });
});
