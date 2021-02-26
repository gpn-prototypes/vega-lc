import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import { createInitState } from '../testing-helpers/create-init-state';

import { ActivitiesWidget } from '@/components/activities';
import { getStore } from '@/redux-store';
import {
  getActivitiesDraggingElements,
  getActivitiesNodeList,
  getActivitiesRef,
  getIsActivitiesPanelOpen,
  getIsAutoFocus,
  getIsDroppingOnExistingStep,
  getSearchStringValue,
} from '@/redux-store/activities/selectors';

const renderActivities = (store?: Store) => {
  return render(
    <Provider store={store || getStore()}>
      <ActivitiesWidget />
    </Provider>,
  );
};

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

describe('Список мероприятий', () => {
  test('рендерится без ошибок', () => {
    renderActivities();
  });

  test('Поисковая строка принимает и выводит введенное значение', () => {
    const { container } = renderActivities();

    const search = container.getElementsByTagName('input')[0];

    const searchString = 'Геодезия';

    expect(search.value).toBe('');

    fireEvent.change(search, { target: { value: searchString } });

    expect(search.value).toBe(searchString);
  });

  test('Мероприятия можно скрыть и раскрыть', () => {
    const { container } = renderActivities();

    const button = container.querySelector('.ActivitiesWidget__Switch') as HTMLElement;
    const activities = container.querySelector('.ActivitiesWidget') as HTMLElement;

    expect(activities).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    expect(activities.hidden).toBe(false);

    fireEvent.click(button);

    expect(activities.hidden).toBe(true);

    fireEvent.click(button);

    expect(activities.hidden).toBe(false);
  });

  test('Перетягиваемый элемент корректно проставляется при событии drag-start и удаляется при drag-end', () => {
    const initialState = createInitState({
      activities: {
        isActivitiesPanelOpen: true,
        nodeList: [
          {
            name: 'mock',
            id: '1',
            nodeList: [
              {
                name: 'mock-2',
                id: '2',
                nodeList: [],
              },
            ],
          },
        ],
        searchString: '',
        autoFocus: false,
        draggingElements: [],
      },
    });

    const store = getStore(initialState);

    const { container } = renderActivities(store);

    const element = container.querySelector('.VegaTree__TreeNode') as HTMLElement;

    fireEvent.dragStart(element);

    expect(store?.getState().activities.draggingElements).toHaveLength(1);

    fireEvent.dragEnd(element);

    expect(store?.getState().activities.draggingElements).toHaveLength(0);
  });

  describe('Activities selectors', () => {
    const mockState = {
      activities: {
        isActivitiesPanelOpen: true,
        nodeList: [
          {
            name: 'mock',
            id: '1',
            nodeList: [
              {
                name: 'mock-2',
                id: '2',
                nodeList: [],
              },
            ],
          },
        ],
        searchString: 'test string',
        autoFocus: true,
        draggingElements: [
          {
            ref: null,
            id: 'drag element id',
            isDraggable: true,
          },
        ],
        isDroppingOnExistingStep: true,
      },
    };

    const initialState = createInitState(mockState);

    const store = getStore(initialState);

    test('getActivitiesRef выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.activitiesRef).not.toBeNull();

      const activitiesRef = getActivitiesRef(store.getState());
      expect(activitiesRef).not.toBeNull();
      if (activitiesRef) {
        expect(activitiesRef.current).toBeInTheDocument();
      }
    });

    test('getDraggingElements выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.draggingElements).not.toBeNull();

      const draggingElements = getActivitiesDraggingElements(store.getState());
      expect(draggingElements).toEqual(mockState.activities.draggingElements);
    });

    test('getActivitiesNodeList без фильтра по имени выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.nodeList).not.toBeNull();

      const nodeList = getActivitiesNodeList()(store.getState());

      expect(nodeList).toEqual(mockState.activities.nodeList);
    });

    test('getActivitiesNodeList с фильтром по имени выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.nodeList).not.toBeNull();

      const nodeList = getActivitiesNodeList('mock')(store.getState());

      expect(nodeList).toEqual([{ ...mockState.activities.nodeList[0], isExpanded: true }]);
    });

    test('getSearchStringValue выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.searchString).not.toBeNull();

      const searchString = getSearchStringValue(store.getState());

      expect(searchString).toBe(mockState.activities.searchString);
    });

    test('getIsAutoFocus выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.autoFocus).not.toBeNull();

      const autoFocus = getIsAutoFocus(store.getState());

      expect(autoFocus).toBe(mockState.activities.autoFocus);
    });

    test('getIsActivitiesPanelOpen выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.isActivitiesPanelOpen).not.toBeNull();

      const isActivitiesPanelOpen = getIsActivitiesPanelOpen(store.getState());

      expect(isActivitiesPanelOpen).toBe(mockState.activities.isActivitiesPanelOpen);
    });

    test('getIsDroppingOnExistingStep выдает корректные данные из store', () => {
      renderActivities(store);

      expect(store.getState().activities.isDroppingOnExistingStep).not.toBeNull();

      const isDroppingOnExistingStep = getIsDroppingOnExistingStep(store.getState());

      expect(isDroppingOnExistingStep).toBe(mockState.activities.isDroppingOnExistingStep);
    });
  });
});
