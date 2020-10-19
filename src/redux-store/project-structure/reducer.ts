import { ProjectStructureState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { ProjectStructureActionTypes } from './action-types';
import initialState from './initial-state';

const setProjectStructureNodeListStrategy = (
  state: ProjectStructureState,
  { nodeList = [] },
): ProjectStructureState => ({
  ...state,
  nodeList,
});

const setDraggingElementsStrategy = (
  state: ProjectStructureState,
  { draggingElements = [] },
): ProjectStructureState => ({
  ...state,
  draggingElements,
});

const strategyMap = {
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST]: setProjectStructureNodeListStrategy,
  [ProjectStructureActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
};

const projectStructureReducer = createReducer(strategyMap, initialState);

export default projectStructureReducer;
