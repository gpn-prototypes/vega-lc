import { CanvasTree } from '@gpn-prototypes/vega-ui';

import { LogicConstructorState, Step, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): LogicConstructorState => state.logicConstructor;

export const getScenarioList = (state: StoreLC): Step[] | undefined =>
  getCurrentState(state).scenarioList;

export const getCanvasElements = (state: StoreLC): CanvasTree[] | undefined =>
  getCurrentState(state).canvasElements;
