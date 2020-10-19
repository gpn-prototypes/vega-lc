import { ActivitiesState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { ActivitiesActionTypes } from './action-types';
import initialState from './initial-state';

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

const strategyMap = {
  [ActivitiesActionTypes.SET_ACTIVITIES_LIST]: setActivitiesNodeListStrategy,
  [ActivitiesActionTypes.SET_SEARCH_STRING]: setSearchStringStrategy,
  [ActivitiesActionTypes.SET_IS_AUTO_FOCUS]: setIsAutoFocusStrategy,
  [ActivitiesActionTypes.SET_ACTIVITIES_REF]: setActivitiesRefStrategy,
  [ActivitiesActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default activitiesReducer;
