import { Notification } from '../../types/redux-store';

import { VersionActionTypes } from './action-types';

type SetNotification = {
  type: typeof VersionActionTypes.SET_NOTIFICATION;
  notification: Notification;
};

type DeleteNotification = {
  type: typeof VersionActionTypes.DELETE_NOTIFICATION;
  index: number;
};

type FlushNotifications = {
  type: typeof VersionActionTypes.FLUSH_NOTIFICATIONS;
};

const setNotification = (notification: Notification): SetNotification => ({
  type: VersionActionTypes.SET_NOTIFICATION,
  notification,
});

const deleteNotification = (index: number): DeleteNotification => ({
  type: VersionActionTypes.DELETE_NOTIFICATION,
  index,
});

const flushNotifications = (): FlushNotifications => ({
  type: VersionActionTypes.FLUSH_NOTIFICATIONS,
});

export { setNotification, deleteNotification, flushNotifications };
