import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware from 'redux-thunk';

import activitiesReducer from './activities/reducer';
import groupObjectsReducer from './group-objects/reducer';
import ProjectStructureReducer from './project-structure/reducer';

const rootReducer = combineReducers({
  activities: activitiesReducer,
  groupObjects: groupObjectsReducer,
  projectStructure: ProjectStructureReducer,
});

const getStore = (initialState?: any): Store =>
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument({}))),
  );

export default getStore;
