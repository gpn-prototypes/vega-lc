import _ from 'lodash';

import { Notification, NotificationState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { VersionActionTypes } from './action-types';
import initialState from './initial-state';

const setNotificationStrategy = (
  state: NotificationState,
  { notification }: { notification: Notification },
): NotificationState => {
  return {
    ...state,
    list: state.list.length ? _.uniqWith([...state.list, notification], _.isEqual) : [notification],
  };
};

const deleteNotificationStrategy = (
  state: NotificationState,
  { index }: { index: number },
): NotificationState => ({
  ...state,
  list: state.list.filter((value, idx) => idx !== index),
});

const flushNotificationsStrategy = (state: NotificationState): NotificationState => ({
  ...state,
  list: [],
});

const strategyMap = {
  [VersionActionTypes.SET_NOTIFICATION]: setNotificationStrategy,
  [VersionActionTypes.DELETE_NOTIFICATION]: deleteNotificationStrategy,
  [VersionActionTypes.FLUSH_NOTIFICATIONS]: flushNotificationsStrategy,
};

const notificationsReducer = createReducer(strategyMap, initialState);

export default notificationsReducer;
