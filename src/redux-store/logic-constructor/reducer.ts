import { CanvasData, CanvasTree, entities } from '@gpn-prototypes/vega-ui';

import { ClearActionTypes } from '../clear/action-types';

import { LogicConstructorActionTypes } from './action-types';
import initialState from './initial-state';

import { CanvasViewEntity, LogicConstructorState } from '@/types/redux-store';
import createReducer from '@/utils/create-reducer';

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

const setCanvasViewRefStrategy = (
  state: LogicConstructorState,
  { canvasViewRef }: { canvasViewRef: React.MutableRefObject<CanvasViewEntity | null> },
): LogicConstructorState => ({
  ...state,
  canvasViewRef,
});

const clearStoreStrategy = (): LogicConstructorState => ({
  ...initialState,
});

const replaceCanvasElementIdStrategy = (
  state: LogicConstructorState,
  { id, replaceId }: { id: string; replaceId: string },
): LogicConstructorState => {
  const canvasElements = state.canvasElements || [];
  const found = canvasElements.find((i) => i.getId() === id);

  if (!found) return state; // todo: throw error?

  return {
    ...state,
    canvasElements: [
      ...canvasElements.filter((i) => i.getId() !== id),
      entities.Tree.of<CanvasData>({
        id: replaceId,
        childrenIds: found.getChildren(),
        parentIds: found.getParents(),
        data: found.getData(),
      }),
    ],
  };
};

const strategyMap = {
  [LogicConstructorActionTypes.SET_SCENARIO_LIST]: setScenarioListStrategy,
  [LogicConstructorActionTypes.SET_CANVAS_ELEMENTS]: setCanvasElementsStrategy,
  [LogicConstructorActionTypes.REPLACE_CANVAS_ELEMENT_ID]: replaceCanvasElementIdStrategy,
  [LogicConstructorActionTypes.ADD_CANVAS_ELEMENT]: addCanvasElementStrategy,
  [LogicConstructorActionTypes.TOGGLE_STEP_EDITOR]: toggleStepEditorStrategy,
  [LogicConstructorActionTypes.SET_CANVAS_VIEW_REF]: setCanvasViewRefStrategy,
  [ClearActionTypes.CLEAR_STORES]: clearStoreStrategy,
};

const logicConstructorReducer = createReducer(strategyMap, initialState);

export default logicConstructorReducer;
