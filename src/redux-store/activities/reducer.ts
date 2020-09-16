import createReducer from '../../utils/create-reducer';

import { ActivitiesActionTypes } from './action-types';
import initialState from './initial-state';

const setActivitiesNodeListStrategy = (state: any, { nodeList = [] }) => ({
  ...state,
  nodeList,
});

const strategyMap = {
  [ActivitiesActionTypes.SET_ACTIVITIES_LIST as any]: setActivitiesNodeListStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default activitiesReducer;
