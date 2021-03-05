import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';

import createReducer from '../../utils/create-reducer';
import { ClearActionTypes } from '../clear/action-types';

import { ActivitiesActionTypes } from './action-types';
import {
  SetActivitiesList,
  SetActivitiesPanelOpen,
  SetActivitiesRef,
  SetDraggingElements,
  SetIsAutoFocus,
  SetIsDroppingOnExisting,
} from './actions';
import initialState from './initial-state';

import { ActivitiesState } from '@/types/redux-store';

const persistConfig = {
  key: 'activities',
  storage,
  whitelist: ['isActivitiesPanelOpen'],
};

const setActivitiesNodeListStrategy = (
  state: ActivitiesState,
  { nodeList }: SetActivitiesList,
): ActivitiesState => ({
  ...state,
  nodeList,
});

const setSearchStringStrategy = (
  state: ActivitiesState,
  { searchString }: { searchString: string },
): ActivitiesState => ({
  ...state,
  searchString,
});

const setIsAutoFocusStrategy = (
  state: ActivitiesState,
  { autoFocus }: SetIsAutoFocus,
): ActivitiesState => ({
  ...state,
  autoFocus,
});

const setActivitiesRefStrategy = (
  state: ActivitiesState,
  { activitiesRef }: SetActivitiesRef,
): ActivitiesState => ({
  ...state,
  activitiesRef,
});

const setDraggingElementsStrategy = (
  state: ActivitiesState,
  { draggingElements }: SetDraggingElements,
): ActivitiesState => ({
  ...state,
  draggingElements,
});

const setIsDroppingOnExistingStepStrategy = (
  state: ActivitiesState,
  { isDroppingOnExistingStep }: SetIsDroppingOnExisting,
): ActivitiesState => ({
  ...state,
  isDroppingOnExistingStep,
});

const setActivitiesPanelOpenStrategy = (
  state: ActivitiesState,
  { isActivitiesPanelOpen }: SetActivitiesPanelOpen,
): ActivitiesState => ({
  ...state,
  isActivitiesPanelOpen,
});

const clearStoreStrategy = (state: ActivitiesState): ActivitiesState => ({
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
  [ClearActionTypes.CLEAR_STORES]: clearStoreStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default persistReducer(persistConfig, activitiesReducer);
