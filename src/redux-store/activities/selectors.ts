const getCurrentState = (state: any) => state.activities;

export const getActivitiesNodeList = (state: any) => getCurrentState(state).nodeList;
