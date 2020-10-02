import { GroupObjectsState, StoreLC } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { GroupObjectsActionTypes } from './action-types';
import initialState from './initial-state';

const setGroupObjectsNodeListStrategy = (state: StoreLC, { nodeList = [] }): GroupObjectsState => ({
  ...state,
  nodeList,
});

const strategyMap = {
  [GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST]: setGroupObjectsNodeListStrategy,
};

const groupObjectsReducer = createReducer(strategyMap, initialState);

export default groupObjectsReducer;
