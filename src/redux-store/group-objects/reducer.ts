import createReducer from '../../utils/create-reducer';
import { ClearActionTypes } from '../clear/action-types';

import { GroupObjectsActionTypes } from './action-types';
import initialState from './initial-state';

import { GroupObjectsState } from '@/types/redux-store';

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

const setDraggingElementsStrategy = (
  state: GroupObjectsState,
  { draggingElements = [] },
): GroupObjectsState => ({
  ...state,
  draggingElements,
});

const clearStoreStrategy = (): GroupObjectsState => ({
  ...initialState,
});

const strategyMap = {
  [GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST]: setGroupObjectsNodeListStrategy,
  [GroupObjectsActionTypes.TOGGLE_DIALOG]: toggleDialogStrategy,
  [GroupObjectsActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
  [ClearActionTypes.CLEAR_STORES]: clearStoreStrategy,
};

const groupObjectsReducer = createReducer(strategyMap, initialState);

export default groupObjectsReducer;
