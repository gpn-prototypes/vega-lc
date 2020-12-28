import createReducer from '../../utils/create-reducer';

import { ProjectStructureActionTypes } from './action-types';
import initialState from './initial-state';

import { ProjectStructureQuery, ProjectStructureState } from '@/types/redux-store';

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

const strategyMap = {
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST]: setProjectStructureNodeListStrategy,
  [ProjectStructureActionTypes.SET_DRAGGING_ELEMENTS]: setDraggingElementsStrategy,
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY]: setProjectStructureQuerySuccessStrategy,
};

const projectStructureReducer = createReducer(strategyMap, initialState);

export default projectStructureReducer;
