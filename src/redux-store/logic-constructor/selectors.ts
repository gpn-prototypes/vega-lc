import { CanvasTree } from '@gpn-prototypes/vega-ui';

import { CanvasViewEntity, LogicConstructorState, Step, StoreLC } from '@/types/redux-store';

const getCurrentState = (state: StoreLC): LogicConstructorState => state.logicConstructor;

export const getScenarioList = (state: StoreLC): Step[] | undefined =>
  getCurrentState(state).scenarioList;

export const getCanvasElements = (state: StoreLC): CanvasTree[] | undefined =>
  getCurrentState(state).canvasElements;

export const getIsStepEditorOpened = (state: StoreLC): boolean | undefined =>
  getCurrentState(state).isStepEditorOpened;

export const getCanvasViewRef = (
  state: StoreLC,
): React.MutableRefObject<CanvasViewEntity | null> | undefined =>
  getCurrentState(state).canvasViewRef;
