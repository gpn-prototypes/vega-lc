import { ActivitiesState, StoreLC } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { ActivitiesActionTypes } from './action-types';
import initialState from './initial-state';

const setActivitiesNodeListStrategy = (state: StoreLC, { nodeList = [] }): ActivitiesState => ({
  ...state,
  nodeList,
});

const setSearchStringStrategy = (state: StoreLC, { searchString = '' }): ActivitiesState => ({
  ...state,
  searchString,
});

const setIsAutoFocusStrategy = (state: StoreLC, { autoFocus = false }): ActivitiesState => ({
  ...state,
  autoFocus,
});

const strategyMap = {
  [ActivitiesActionTypes.SET_ACTIVITIES_LIST]: setActivitiesNodeListStrategy,
  [ActivitiesActionTypes.SET_SEARCH_STRING]: setSearchStringStrategy,
  [ActivitiesActionTypes.SET_IS_AUTO_FOCUS]: setIsAutoFocusStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default activitiesReducer;
