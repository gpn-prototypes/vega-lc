import { ActionTypes } from '../../types/redux-store';
import { applyActionTypesNames } from '../../utils/apply-action-types-names';

const ActivitiesActionTypes: ActionTypes = {
  SET_ACTIVITIES_LIST: '',
  SET_SEARCH_STRING: '',
  SET_IS_AUTO_FOCUS: '',
  SET_ACTIVITIES_REF: '',
  SET_DRAGGING_ELEMENTS: '',
};

applyActionTypesNames(ActivitiesActionTypes, 'Activities');

export { ActivitiesActionTypes };
