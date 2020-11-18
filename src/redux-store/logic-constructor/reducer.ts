import { CanvasTree } from '@gpn-prototypes/vega-ui';

import { LogicConstructorState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { LogicConstructorActionTypes } from './action-types';
import initialState from './initial-state';

const setScenarioListStrategy = (
  state: LogicConstructorState,
  { scenarioList = [] },
): LogicConstructorState => ({
  ...state,
  scenarioList,
});

const setCanvasElementsStrategy = (
  state: LogicConstructorState,
  { canvasElements = [] },
): LogicConstructorState => ({
  ...state,
  canvasElements,
});

const addCanvasElementStrategy = (
  state: LogicConstructorState,
  { canvasElement }: { canvasElement: CanvasTree },
): LogicConstructorState => {
  const { canvasElements } = state;

  return {
    ...state,
    canvasElements: canvasElements ? [...canvasElements, canvasElement] : [canvasElement],
  };
};

const toggleStepEditorStrategy = (
  state: LogicConstructorState,
  { isStepEditorOpened = false },
): LogicConstructorState => ({
  ...state,
  isStepEditorOpened,
});

const strategyMap = {
  [LogicConstructorActionTypes.SET_SCENARIO_LIST]: setScenarioListStrategy,
  [LogicConstructorActionTypes.SET_CANVAS_ELEMENTS]: setCanvasElementsStrategy,
  [LogicConstructorActionTypes.ADD_CANVAS_ELEMENT]: addCanvasElementStrategy,
  [LogicConstructorActionTypes.TOGGLE_STEP_EDITOR]: toggleStepEditorStrategy,
};

const logicConstructorReducer = createReducer(strategyMap, initialState);

export default logicConstructorReducer;
