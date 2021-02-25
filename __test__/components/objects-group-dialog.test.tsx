import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { over } from 'lodash';
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

  test('Диалоговое окно закрывается при клике на кнопку закрытия (в верхнем углу)', () => {
    const store = getStore(initState);

    const { baseElement } = renderObjectsGroupDialog(store);

    const closeBtn = baseElement.querySelector('.ObjectsGroupWidget__DialogCloser');

    expect(store.getState().groupObjects.isDialogOpened).toBe(true);

    if (closeBtn) {
      fireEvent.click(closeBtn);
    }

    expect(store.getState().groupObjects.isDialogOpened).toBe(false);
  });

  describe('Данные формы сбрасываются после закрытия', () => {
    const checkClose = async (store: Store, button: HTMLElement, isOverlay?: boolean) => {
      const newGroupName = 'new group name';

      let textField = screen.getByPlaceholderText('Введите название группы объектов');

      fireEvent.change(textField, { target: { value: newGroupName } });

      expect(textField).toHaveValue(newGroupName);

      if (!isOverlay) {
        fireEvent.click(button);
      } else {
        fireEvent.mouseDown(button);
      }

      expect(store.getState().groupObjects.isDialogOpened).toBeFalsy();
      await waitFor(() => expect(textField).not.toBeInTheDocument());

      await store.dispatch(actions.toggleDialog(true));

      expect(store.getState().groupObjects.isDialogOpened).toBeTruthy();

      textField = screen.getByPlaceholderText('Введите название группы объектов');
      await waitFor(() => expect(textField).not.toHaveValue(newGroupName));
      expect(textField).toHaveValue('');
    };

    test('данные формы сбрасываются после закрытия по кнопке закрытия (в верхнем углу)', async () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const closeBtn = baseElement.querySelector(
        '.ObjectsGroupWidget__DialogCloser',
      ) as HTMLElement;

      await checkClose(store, closeBtn);
    });

    test('данные формы сбрасываются после закрытия по кнопке отмена', async () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const closeBtn = screen.getByText('Отмена');

      await checkClose(store, closeBtn);
    });

    test('данные формы сбрасываются после добавления группы объектов', async () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const createGroupBtn = screen.getByText('Создать группу');

      await checkClose(store, createGroupBtn);
    });

    test('данные формы сбрасываются после клика вне модального окна', async () => {
      const store = getStore(initState);

      const { baseElement } = renderObjectsGroupDialog(store);

      const overlay = baseElement.querySelector(
        '[aria-label="Оверлей модального окна"]',
      ) as HTMLElement;

      await checkClose(store, overlay, true);
    });
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

      renderObjectsGroupDialog(store);

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

    test('Удаляются лишние пробелы при создании группы', () => {
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

    test('Удаляются лишние пробелы на onBlur', () => {
      const store = getStore(initState);

      renderObjectsGroupDialog(store);

      const newGroupName = '           group name           ';

      const textField = screen.getByPlaceholderText(
        'Введите название группы объектов',
      ) as HTMLInputElement;
      fireEvent.change(textField, { target: { value: newGroupName } });

      fireEvent.blur(textField);

      expect(textField.value).toBe(newGroupName.trim());
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
