import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ActivitiesWidget } from '../../src/components/activities';
import { getStore } from '../../src/redux-store';
import { StoreLC } from '../../src/types/redux-store';
import { createInitState } from '../utils/create-init-state';

let reduxStore: Store | null;

const renderActivities = (initialState?: StoreLC) => {
  const store = getStore(initialState);
  reduxStore = store;

  return render(
    <Provider store={store}>
      <ActivitiesWidget />
    </Provider>,
  );
};

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  reduxStore = null;
});

describe('Список мероприятий', () => {
  test('рендерится без ошибок', () => {
    renderActivities();
  });

  test('Поисковая строка принимает и выводит введенное значение', () => {
    const { container } = renderActivities();

    const search = container.getElementsByTagName('input')[0];

    if (search) {
      const searchString = 'Геодезия';

      expect(search.value).toBe('');

      fireEvent.change(search, { target: { value: searchString } });

      expect(search.value).toBe(searchString);
    }
  });

  test('Мероприятия можно скрыть и раскрыть', () => {
    const { container } = renderActivities();

    const button = container.querySelector('.ActivitiesWidget__Switch');
    const activities = container.querySelector('.ActivitiesWidget');

    if (button instanceof HTMLElement && activities instanceof HTMLElement) {
      expect(activities).toBeInTheDocument();
      expect(button).toBeInTheDocument();

      expect(activities.hidden).toBe(false);

      fireEvent.click(button);

      expect(activities.hidden).toBe(true);

      fireEvent.click(button);

      expect(activities.hidden).toBe(false);
    }
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
      },
    });

    const { container } = renderActivities(initialState);

    const element = container.querySelector('.VegaTree__TreeNode');

    if (element) {
      fireEvent.dragStart(element);

      expect(reduxStore?.getState().activities.draggingElements).toHaveLength(1);

      fireEvent.dragEnd(element);

      expect(reduxStore?.getState().activities.draggingElements).toHaveLength(0);
    }
  });
});
