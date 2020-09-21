import createReducer from '../../utils/create-reducer';

import { GroupObjectsActionTypes } from './action-types';
import initialState from './initial-state';

const setGroupObjectsNodeListStrategy = (state: any, { nodeList = [] }): any => ({
  ...state,
  nodeList,
});

const strategyMap = {
  [GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST as any]: setGroupObjectsNodeListStrategy,
};

const groupObjectsReducer = createReducer(strategyMap, initialState);

export default groupObjectsReducer;
