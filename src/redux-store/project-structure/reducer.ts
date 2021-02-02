import { ProjectStructureQuery, ProjectStructureState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';
import { ClearActionTypes } from '../clear/action-types';

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

const setProjectStructureQuerySuccessStrategy = (
  state: ProjectStructureState,
  { projectStructureQuery }: { projectStructureQuery: ProjectStructureQuery },
): ProjectStructureState => ({
  ...state,
  projectStructureQuery,
});

const clearStoreStrategy = (): ProjectStructureState => ({
  ...initialState,
});

const strategyMap = {
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST]: setProjectStructureNodeListStrategy,
  [ProjectStructureActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY]: setProjectStructureQuerySuccessStrategy,
  [ClearActionTypes.CLEAR_STORES]: clearStoreStrategy,
};

const projectStructureReducer = createReducer(strategyMap, initialState);

export default projectStructureReducer;
