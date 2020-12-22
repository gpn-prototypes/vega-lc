import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type NotificationsActions = 'SET_NOTIFICATION' | 'DELETE_NOTIFICATION';

const VersionActionTypes: Record<NotificationsActions, string> = {
  SET_NOTIFICATION: '',
  DELETE_NOTIFICATION: '',
};

applyActionTypesNames(VersionActionTypes, 'Notification');

export { VersionActionTypes };
