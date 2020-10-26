import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type GroupObjectsActions = 'SET_GROUP_OBJECTS_LIST' | 'TOGGLE_DIALOG' | 'SET_NEW_GROUP_PARAMS';

const GroupObjectsActionTypes: Record<GroupObjectsActions, string> = {
  SET_GROUP_OBJECTS_LIST: '',
  TOGGLE_DIALOG: '',
  SET_NEW_GROUP_PARAMS: '',
};

applyActionTypesNames(GroupObjectsActionTypes, 'GroupObjects');

export { GroupObjectsActionTypes };
