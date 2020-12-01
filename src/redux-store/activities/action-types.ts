import { applyActionTypesNames } from '@/utils/apply-action-types-names';

export type ActivitiesActions =
  | 'SET_ACTIVITIES_LIST'
  | 'SET_SEARCH_STRING'
  | 'SET_IS_AUTO_FOCUS'
  | 'SET_ACTIVITIES_REF'
  | 'SET_DRAGGING_ELEMENTS'
  | 'SET_IS_DROPPING_ON_EXISTING_STEP';

const ActivitiesActionTypes: Record<ActivitiesActions, string> = {
  SET_ACTIVITIES_LIST: '',
  SET_SEARCH_STRING: '',
  SET_IS_AUTO_FOCUS: '',
  SET_ACTIVITIES_REF: '',
  SET_DRAGGING_ELEMENTS: '',
  SET_IS_DROPPING_ON_EXISTING_STEP: '',
};

applyActionTypesNames(ActivitiesActionTypes, 'Activities');

export { ActivitiesActionTypes };
