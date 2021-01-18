import { VersionActionTypes } from './action-types';

import { Notification } from '@/types/redux-store';

type SetNotification = {
  type: typeof VersionActionTypes.SET_NOTIFICATION;
  notification: Notification;
};

type DeleteNotification = {
  type: typeof VersionActionTypes.DELETE_NOTIFICATION;
  index: number;
};

const setNotification = (notification: Notification): SetNotification => ({
  type: VersionActionTypes.SET_NOTIFICATION,
  notification,
});

const deleteNotification = (index: number): DeleteNotification => ({
  type: VersionActionTypes.DELETE_NOTIFICATION,
  index,
});

export { setNotification, deleteNotification };
