import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware from 'redux-thunk';

import { StoreLC } from '../types/redux-store';

import activitiesReducer from './activities/reducer';
import groupObjectsReducer from './group-objects/reducer';
import logicConstructorReducer from './logic-constructor/reducer';
import projectStructureReducer from './project-structure/reducer';

const rootReducer = combineReducers({
  activities: activitiesReducer,
  groupObjects: groupObjectsReducer,
  projectStructure: projectStructureReducer,
  logicConstructor: logicConstructorReducer,
});

const getStore = (initialState?: StoreLC): Store =>
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument({}))),
  );

export default getStore;
