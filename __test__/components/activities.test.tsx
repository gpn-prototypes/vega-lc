import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { ActivitiesWidget } from '../../src/components/activities';
import { getStore } from '../../src/redux-store';
import { createInitState } from '../testing-helpers/create-init-state';

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
});
