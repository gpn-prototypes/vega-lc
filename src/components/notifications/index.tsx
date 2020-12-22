import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Item } from '@consta/uikit/SnackBar';
import { SnackBar } from '@gpn-prototypes/vega-ui';

import { cnNotifications } from './cn-notifications';

import './index.css';

import { deleteNotification } from '@/redux-store/notifications/actions';
import { Notification, StoreLC } from '@/types/redux-store';

export const Notifications = (): React.ReactElement => {
  const dispatch = useDispatch();

  const notifications = useSelector<StoreLC, Notification[]>((state) => state.notifications.list);

  const items = notifications.map(
    (notification, index) =>
      ({
        key: index,
        message: notification.message,
        status: notification.status,
        icon: notification.icon,
        onClose: () => {
          dispatch(deleteNotification(index));
        },
      } as Item),
  );

  return (
    <div className={cnNotifications()}>
      <SnackBar className={cnNotifications('SnackBar')} items={items} />
    </div>
  );
};
