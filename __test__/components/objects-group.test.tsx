import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ObjectsGroupWidget } from '../../src/components/objects-group';
import { getStore } from '../../src/redux-store';
import * as actions from '../../src/redux-store/group-objects/actions';
import ObjectsGroupInitialState from '../../src/redux-store/group-objects/initial-state';
import ProjectStructureInitialState from '../../src/redux-store/project-structure/initial-state';
import { createInitState } from '../testing-helpers/create-init-state';

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderObjectsGroup = (store?: Store) => {
  return render(
    <Provider store={store || getStore()}>
      <ObjectsGroupWidget />
    </Provider>,
  );
};

describe('Группы объектов', () => {
  test('Рендерится без ошибок и присутствует в DOM', () => {
    const { container } = renderObjectsGroup();

    const objectGroup = container.querySelector('.ObjectsGroupWidget');

    expect(objectGroup).toBeInTheDocument();
  });

  test('При нажатии на кнопку Добавить группу isDialogOpened выставляется в true', () => {
    const store = getStore();

    const { container } = renderObjectsGroup(store);

    const objectGroup = container.querySelector('.ObjectsGroupWidget__AddGroupBtn') as HTMLElement;

    expect(store.getState().groupObjects.isDialogOpened).toBe(false);

    fireEvent.click(objectGroup);

    expect(store.getState().groupObjects.isDialogOpened).toBe(true);
  });

  test('Устанавливаются переносимые элементы при drag-start и очищаются при drag-end', () => {
    const initState = createInitState({
      groupObjects: {
        ...ObjectsGroupInitialState,
        nodeList: [
          {
            id: 'parent',
            isDraggable: true,
            name: 'parent',
            nodeList: [
              {
                id: 'child',
                nodeList: [],
                name: 'child',
              },
            ],
          },
        ],
      },
    });

    const store = getStore(initState);

    const { container } = renderObjectsGroup(store);

    const treeNode = container.querySelector('#parent') as HTMLElement;

    expect(store.getState().groupObjects.draggingElements).toHaveLength(0);

    fireEvent.dragStart(treeNode);

    expect(store.getState().groupObjects.draggingElements).toHaveLength(1);

    fireEvent.dragEnd(treeNode);

    expect(store.getState().groupObjects.draggingElements).toHaveLength(0);
  });

  test('Группы объектов наполняются элементами через перенос из структуры проекта', () => {
    const initState = createInitState({
      groupObjects: {
        ...ObjectsGroupInitialState,
        nodeList: [
          {
            id: 'drop-zone',
            isDraggable: true,
            name: 'parent',
            nodeList: [],
          },
        ],
      },
      projectStructure: {
        ...ProjectStructureInitialState,
        draggingElements: [
          {
            ref: null,
            isDraggable: true,
            id: 'dragging-element',
          },
        ],
      },
    });

    const mockedUpdateGroupObject = jest.fn();

    jest
      .spyOn(actions, 'updateGroupObject')
      .mockImplementationOnce((groupObjectId: string, objectsId: string[]) => (): unknown =>
        mockedUpdateGroupObject(groupObjectId, objectsId),
      );

    const store = getStore(initState);

    const { container } = renderObjectsGroup(store);

    const objectsGroup = container.querySelector('#drop-zone') as HTMLElement;

    expect(store.getState().groupObjects.nodeList[0].nodeList).toHaveLength(0);
    expect(store.getState().projectStructure.draggingElements).toHaveLength(1);

    fireEvent.dragEnter(objectsGroup);
    fireEvent.drop(objectsGroup);

    expect(mockedUpdateGroupObject).toBeCalledWith('drop-zone', ['dragging-element']);
  });
});
