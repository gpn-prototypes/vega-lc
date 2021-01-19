import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

import createReducer from '../../utils/create-reducer';
import { ClearActionTypes } from '../сlear/action-types';

import { ActivitiesActionTypes } from './action-types';
import initialState from './initial-state';

import { ActivitiesState } from '@/types/redux-store';

const persistConfig = {
  key: 'activities',
  storage,
  whitelist: ['isActivitiesPanelOpen'],
};

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

const setActivitiesPanelOpenStrategy = (
  state: ActivitiesState,
  { isActivitiesPanelOpen = false },
): ActivitiesState => ({
  ...state,
  isActivitiesPanelOpen,
});

const setClearStoreStrategy = (state: ActivitiesState): ActivitiesState => ({
  ...initialState,
  isActivitiesPanelOpen: state.isActivitiesPanelOpen,
});

const strategyMap = {
  [ActivitiesActionTypes.SET_ACTIVITIES_LIST]: setActivitiesNodeListStrategy,
  [ActivitiesActionTypes.SET_SEARCH_STRING]: setSearchStringStrategy,
  [ActivitiesActionTypes.SET_IS_AUTO_FOCUS]: setIsAutoFocusStrategy,
  [ActivitiesActionTypes.SET_ACTIVITIES_REF]: setActivitiesRefStrategy,
  [ActivitiesActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
  [ActivitiesActionTypes.SET_IS_DROPPING_ON_EXISTING_STEP]: setIsDroppingOnExistingStepStrategy,
  [ActivitiesActionTypes.SET_ACTIVITIES_PANEL_OPEN]: setActivitiesPanelOpenStrategy,
  [ClearActionTypes.LC_CLEAR_STORES]: setClearStoreStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default persistReducer(persistConfig, activitiesReducer);
