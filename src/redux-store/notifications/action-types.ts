import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type NotificationsActions = 'SET_NOTIFICATION' | 'DELETE_NOTIFICATION' | 'FLUSH_NOTIFICATIONS';

const VersionActionTypes: Record<NotificationsActions, string> = {
  SET_NOTIFICATION: '',
  DELETE_NOTIFICATION: '',
  FLUSH_NOTIFICATIONS: '',
};

applyActionTypesNames(VersionActionTypes, 'Notification');

export { VersionActionTypes };
