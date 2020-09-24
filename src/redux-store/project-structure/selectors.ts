const getCurrentState = (state: any) => state.projectStructure;

export const getProjectStructureNodeList = (state: any) => getCurrentState(state).nodeList;
