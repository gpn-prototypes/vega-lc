import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type LogicConstructorActions =
  | 'SET_SCENARIO_LIST'
  | 'SET_CANVAS_ELEMENTS'
  | 'ADD_CANVAS_ELEMENT'
  | 'CREATE_STEP'
  | 'UPDATE_STEP'
  | 'SYNC_CANVAS_STATE'
  | 'TOGGLE_STEP_EDITOR'
  | 'SET_CANVAS_VIEW_REF';

const LogicConstructorActionTypes: Record<LogicConstructorActions, string> = {
  SET_SCENARIO_LIST: '',
  SET_CANVAS_ELEMENTS: '',
  ADD_CANVAS_ELEMENT: '',
  CREATE_STEP: '',
  UPDATE_STEP: '',
  SYNC_CANVAS_STATE: '',
  TOGGLE_STEP_EDITOR: '',
  SET_CANVAS_VIEW_REF: '',
};

applyActionTypesNames(LogicConstructorActionTypes, 'LogicConstructor');

export { LogicConstructorActionTypes };
