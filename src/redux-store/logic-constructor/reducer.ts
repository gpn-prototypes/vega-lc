import { LogicConstructorState, StoreLC } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { LogicConstructorActionTypes } from './action-types';
import initialState from './initial-state';

const setScenarioListStrategy = (state: StoreLC, { scenarioList = [] }): LogicConstructorState => ({
  ...state,
  scenarioList,
});

const setCanvasElementsStrategy = (
  state: StoreLC,
  { canvasItemsData = [] },
): LogicConstructorState => ({
  ...state,
  canvasItemsData,
});

const strategyMap = {
  [LogicConstructorActionTypes.SET_SCENARIO_LIST]: setScenarioListStrategy,
  [LogicConstructorActionTypes.SET_CANVAS_ITEMS_DATA]: setCanvasElementsStrategy,
};

const logicConstructorReducer = createReducer(strategyMap, initialState);

export default logicConstructorReducer;
