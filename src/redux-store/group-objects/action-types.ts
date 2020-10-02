import { ActionTypes } from '../../types/redux-store';
import { applyActionTypesNames } from '../../utils/apply-action-types-names';

const GroupObjectsActionTypes: ActionTypes = {
  SET_GROUP_OBJECTS_LIST: '',
};

applyActionTypesNames(GroupObjectsActionTypes, 'GroupObjects');

export { GroupObjectsActionTypes };
