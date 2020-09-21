const getCurrentState = (state: any) => state.groupObjects;

export const getGroupObjectsNodeList = (state: any) => getCurrentState(state).nodeList;
