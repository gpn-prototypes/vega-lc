import createReducer from '../../utils/create-reducer';

import { ActivitiesActionTypes } from './action-types';
import initialState from './initial-state';

import { ActivitiesState } from '@/types/redux-store';

const setActivitiesNodeListStrategy = (
  state: ActivitiesState,
  { nodeList = [] },
): ActivitiesState => ({
  ...state,
  nodeList,
});

const setSearchStringStrategy = (
  state: ActivitiesState,
  { searchString = '' },
): ActivitiesState => ({
  ...state,
  searchString,
});

const setIsAutoFocusStrategy = (
  state: ActivitiesState,
  { autoFocus = false },
): ActivitiesState => ({
  ...state,
  autoFocus,
});

const setActivitiesRefStrategy = (
  state: ActivitiesState,
  { activitiesRef = null },
): ActivitiesState => ({
  ...state,
  activitiesRef,
});

const setDraggingElementsStrategy = (
  state: ActivitiesState,
  { draggingElements = [] },
): ActivitiesState => ({
  ...state,
  draggingElements,
});

const setIsDroppingOnExistingStepStrategy = (
  state: ActivitiesState,
  { isDroppingOnExistingStep = false },
): ActivitiesState => ({
  ...state,
  isDroppingOnExistingStep,
});

const strategyMap = {
  [ActivitiesActionTypes.SET_ACTIVITIES_LIST]: setActivitiesNodeListStrategy,
  [ActivitiesActionTypes.SET_SEARCH_STRING]: setSearchStringStrategy,
  [ActivitiesActionTypes.SET_IS_AUTO_FOCUS]: setIsAutoFocusStrategy,
  [ActivitiesActionTypes.SET_ACTIVITIES_REF]: setActivitiesRefStrategy,
  [ActivitiesActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
  [ActivitiesActionTypes.SET_IS_DROPPING_ON_EXISTING_STEP]: setIsDroppingOnExistingStepStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default activitiesReducer;
