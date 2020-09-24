import createReducer from '../../utils/create-reducer';

import { ProjectStructureActionTypes } from './action-types';
import initialState from './initial-state';

const setProjectStructureNodeListStrategy = (state: any, { nodeList = [] }): any => ({
  ...state,
  nodeList,
});

const strategyMap = {
  [ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST as any]: setProjectStructureNodeListStrategy,
};

const ProjectStructureReducer = createReducer(strategyMap, initialState);

export default ProjectStructureReducer;
