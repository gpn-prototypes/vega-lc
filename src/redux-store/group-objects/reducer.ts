import { GroupObjectsState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';
import { ClearActionTypes } from '../сlear/action-types';

import { GroupObjectsActionTypes } from './action-types';
import initialState from './initial-state';

const setGroupObjectsNodeListStrategy = (
  state: GroupObjectsState,
  { nodeList = [] },
): GroupObjectsState => ({
  ...state,
  nodeList,
});

const toggleDialogStrategy = (
  state: GroupObjectsState,
  { isDialogOpened = false },
): GroupObjectsState => ({
  ...state,
  isDialogOpened,
});

const setNewGroupParamsStrategy = (
  state: GroupObjectsState,
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

const setDraggingElementsStrategy = (
  state: GroupObjectsState,
  { draggingElements = [] },
): GroupObjectsState => ({
  ...state,
  draggingElements,
});

const setClearStoreStrategy = (): GroupObjectsState => ({
  ...initialState,
});

const strategyMap = {
  [GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST]: setGroupObjectsNodeListStrategy,
  [GroupObjectsActionTypes.TOGGLE_DIALOG]: toggleDialogStrategy,
  [GroupObjectsActionTypes.SET_NEW_GROUP_PARAMS]: setNewGroupParamsStrategy,
  [GroupObjectsActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
  [ClearActionTypes.CL_CLEAR_STORES]: setClearStoreStrategy,
};

const groupObjectsReducer = createReducer(strategyMap, initialState);

export default groupObjectsReducer;
