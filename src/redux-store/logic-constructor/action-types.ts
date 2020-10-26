import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type LogicConstructorActions =
  | 'SET_SCENARIO_LIST'
  | 'SET_CANVAS_ELEMENTS'
  | 'ADD_CANVAS_ELEMENT'
  | 'CREATE_STEP'
  | 'UPDATE_STEP'
  | 'SYNC_CANVAS_STATE';

const LogicConstructorActionTypes: Record<LogicConstructorActions, string> = {
  SET_SCENARIO_LIST: '',
  SET_CANVAS_ELEMENTS: '',
  ADD_CANVAS_ELEMENT: '',
  CREATE_STEP: '',
  UPDATE_STEP: '',
  SYNC_CANVAS_STATE: '',
};

applyActionTypesNames(LogicConstructorActionTypes, 'LogicConstructor');

export { LogicConstructorActionTypes };
