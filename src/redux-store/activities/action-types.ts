import { applyActionTypesNames } from '../../utils/apply-action-types-names';

const ActivitiesActionTypes = {
  SET_ACTIVITIES_LIST: null,
  SET_SEARCH_STRING: null,
  SET_IS_AUTO_FOCUS: null,
};

applyActionTypesNames(ActivitiesActionTypes, 'Activities');

export { ActivitiesActionTypes };
