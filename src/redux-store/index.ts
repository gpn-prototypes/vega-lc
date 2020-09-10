import { createStore, applyMiddleware, compose, combineReducers, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import exp from "constants";

let composeEnhancers;

if (window.location.host !== 'vega.gazprom-neft.ru') {
  // @ts-ignore
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

composeEnhancers = composeEnhancers || compose;

const rootReducer = combineReducers({});

const getStore = (initialState?): Store =>
  createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware.withExtraArgument({}))),
  );

export default getStore;
