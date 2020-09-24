import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunkMiddleware from 'redux-thunk';

import activitiesReducer from './activities/reducer';

const rootReducer = combineReducers({ activities: activitiesReducer });

const getStore = (initialState?: any): Store =>
  createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware.withExtraArgument({}))),
  );

export default getStore;
