import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistStore } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';

import { StoreLC } from '../types/redux-store';

import activitiesReducer from './activities/reducer';
import groupObjectsReducer from './group-objects/reducer';
import logicConstructorReducer from './logic-constructor/reducer';
import projectStructureReducer from './project-structure/reducer';
import versionReducer from './version/reducer';

const rootReducer = combineReducers({
  activities: activitiesReducer,
  groupObjects: groupObjectsReducer,
  projectStructure: projectStructureReducer,
  logicConstructor: logicConstructorReducer,
  version: versionReducer,
});

const getStore = (initialState?: StoreLC): Store =>
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument({}))),
  );

export const store = getStore();

export const persistor = persistStore(store);
