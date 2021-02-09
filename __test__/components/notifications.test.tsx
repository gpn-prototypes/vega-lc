import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Store } from 'redux';
import configureMockStore from 'redux-mock-store';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { Notifications } from '../../src/components/notifications';
import { VersionActionTypes } from '../../src/redux-store/notifications/action-types';
import initialState from '../../src/redux-store/notifications/initial-state';
import { Notification } from '../../src/types/redux-store';

const mockStore = configureMockStore();

const renderComponent = (store: Store) => {
  return render(
    <Provider store={store}>
      <Notifications />
    </Provider>,
  );
};

describe('Notifications', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const storeData = {
      notifications: { ...initialState },
    };

    const store = mockStore(storeData);

    const dom = renderer
      .create(
        <Provider store={store}>
          <Notifications />
        </Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('отображаются нотификации', () => {
    const mockNotifications: Notification[] = [
      {
        message: 'mock notification 1',
        status: 'normal',
      },
      {
        message: 'mock notifications 2',
        status: 'normal',
      },
    ];

    const storeData = {
      notifications: { ...initialState, list: mockNotifications },
    };

    const store = mockStore(storeData);

    const component = renderComponent(store);

    const notifications = component.container.querySelectorAll('.SnackBar-Item');
    expect(notifications.length).toBe(2);

    const firstNotification = component.queryByText('mock notification 1');
    expect(firstNotification).toBeDefined();

    const secondNotification = component.queryByText('mock notification 2');
    expect(secondNotification).toBeDefined();
  });

  test('корректный статус у отображаемой нотификации', () => {
    const mockNotifications: Notification[] = [
      {
        message: 'normal notification',
        status: 'normal',
      },
      {
        message: 'alert notification',
        status: 'alert',
      },
      {
        message: 'success notification',
        status: 'success',
      },
    ];

    const storeData = {
      notifications: { ...initialState, list: mockNotifications },
    };

    const store = mockStore(storeData);

    const component = renderComponent(store);

    const notifications = component.container.querySelectorAll('.SnackBar-Item');
    expect(notifications.length).toBe(3);

    expect(notifications[0]).toHaveClass('SnackBar-Item_status_normal');
    expect(notifications[1]).toHaveClass('SnackBar-Item_status_alert');
    expect(notifications[2]).toHaveClass('SnackBar-Item_status_success');
  });

  test('вызывается функция удаления нотификации', async () => {
    const mockNotifications: Notification[] = [
      {
        message: 'normal notification',
        status: 'normal',
      },
    ];

    const storeData = {
      notifications: { ...initialState, list: mockNotifications },
    };

    const store = mockStore(storeData);

    const component = renderComponent(store);

    const notifications = component.container.querySelectorAll('.SnackBar-Item');
    expect(notifications.length).toBe(1);

    const closeButton = component.container.querySelector('.SnackBar-CloseButton') as HTMLElement;
    fireEvent.click(closeButton);

    const action = {
      type: VersionActionTypes.DELETE_NOTIFICATION,
      index: 0,
    };

    await waitFor(() => expect(store.getActions()).toContainEqual(action));
  });
});
