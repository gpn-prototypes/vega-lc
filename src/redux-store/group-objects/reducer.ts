import { GroupObjectsState, StoreLC } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { GroupObjectsActionTypes } from './action-types';
import initialState from './initial-state';

const setGroupObjectsNodeListStrategy = (state: StoreLC, { nodeList = [] }): GroupObjectsState => ({
  ...state,
  nodeList,
});

const toggleDialogStrategy = (state: StoreLC, { isDialogOpened = false }): GroupObjectsState => ({
  ...state,
  isDialogOpened,
});

const setNewGroupParamsStrategy = (
  state: StoreLC,
  {
    newGroupParams = {
      isDynamic: false,
      name: '',
    },
  },
): GroupObjectsState => ({
  ...state,
  newGroupParams,
});

const strategyMap = {
  [GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST]: setGroupObjectsNodeListStrategy,
  [GroupObjectsActionTypes.TOGGLE_DIALOG]: toggleDialogStrategy,
  [GroupObjectsActionTypes.SET_NEW_GROUP_PARAMS]: setNewGroupParamsStrategy,
};

const groupObjectsReducer = createReducer(strategyMap, initialState);

export default groupObjectsReducer;
