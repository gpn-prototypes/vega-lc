import { ProjectStructureState, StoreLC } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { ProjectStructureActionTypes } from './action-types';
import initialState from './initial-state';

const setProjectStructureNodeListStrategy = (
  state: StoreLC,
  { nodeList = [] },
): ProjectStructureState => ({
  ...state,
  nodeList,
});

const strategyMap = {
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST]: setProjectStructureNodeListStrategy,
};

const ProjectStructureReducer = createReducer(strategyMap, initialState);

export default ProjectStructureReducer;
