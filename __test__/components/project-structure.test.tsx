import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { fireEvent, render } from '@testing-library/react';
import { Store } from 'redux';
import configureMockStore from 'redux-mock-store';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ProjectStructureWidget } from '../../src/components/project-structure';
import { setProjectStructureDraggingElements } from '../../src/redux-store/project-structure/actions';
import initialState from '../../src/redux-store/project-structure/initial-state';

const mockStore = configureMockStore();

const renderComponent = (store: Store) => {
  return render(
    <Provider store={store}>
      <ProjectStructureWidget />
    </Provider>,
  );
};

let store = mockStore({
  projectStructure: initialState,
});

describe('Project Structure', () => {
  beforeEach(() => {
    store = mockStore({
      projectStructure: initialState,
    });
  });

  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer
      .create(
        <Provider store={store}>
          <ProjectStructureWidget />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('Отображается заглушка при пустой структуре проекта', () => {
    const component = renderComponent(store);

    const NoStructureMessage = component.queryByText('Структура проекта отсутствует');

    expect(NoStructureMessage).toBeInTheDocument();
  });

  test('Скрывается заглушка если структура проекта не пуста', () => {
    const mockProjectStructureList: Array<TreeItem> = [
      {
        id: 'mockId',
        name: 'mockName',
        nodeList: [],
      },
    ];

    store = mockStore({
      projectStructure: {
        ...initialState,
        nodeList: mockProjectStructureList,
      },
    });

    const component = renderComponent(store);

    const NoStructureMessage = component.queryByText('Структура проекта отсутствует');

    expect(NoStructureMessage).not.toBeInTheDocument();
  });

  test('Отображается структура проекта', () => {
    const mockProjectStructureList: Array<TreeItem> = [
      {
        id: 'mockId',
        name: 'mockName',
        nodeList: [],
      },
      {
        id: 'mockId1',
        name: 'mockName1',
        nodeList: [],
      },
    ];

    store = mockStore({
      projectStructure: {
        ...initialState,
        nodeList: mockProjectStructureList,
      },
    });

    const component = renderComponent(store);

    const firstProjectStructureElement = component.queryByText('mockName');
    expect(firstProjectStructureElement).toBeInTheDocument();

    const secondProjectStructureElement = component.queryByText('mockName1');
    expect(secondProjectStructureElement).toBeInTheDocument();
  });

  test('Вызывается установка списка элементов при drag and drop', () => {
    const mockProjectStructureList: Array<TreeItem> = [
      {
        id: 'mockId',
        name: 'mockName',
        nodeList: [],
      },
      {
        id: 'mockId1',
        name: 'mockName1',
        nodeList: [],
      },
    ];

    store = mockStore({
      projectStructure: {
        ...initialState,
        nodeList: mockProjectStructureList,
      },
    });

    const component = renderComponent(store);

    const firstProjectStructureElement = component.container.querySelector('.VegaTree__Leaf');

    if (firstProjectStructureElement) {
      fireEvent.dragStart(firstProjectStructureElement);
      fireEvent.dragEnd(firstProjectStructureElement);
    }

    const dragElement = {
      id: mockProjectStructureList[0].id,
      ref: { current: firstProjectStructureElement },
      isDraggable: true,
    } as TargetData;

    const dragStartAction = setProjectStructureDraggingElements([dragElement]);
    expect(store.getActions()).toContainEqual(dragStartAction);

    const dragEndAction = setProjectStructureDraggingElements([]);
    expect(store.getActions()).toContainEqual(dragEndAction);
  });
});
