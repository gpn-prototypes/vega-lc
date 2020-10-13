import { ActionTypes } from '../../types/redux-store';
import { applyActionTypesNames } from '../../utils/apply-action-types-names';

const LogicConstructorActionTypes: ActionTypes = {
  SET_SCENARIO_LIST: '',
  SET_CANVAS_ELEMENTS: '',
  ADD_CANVAS_ELEMENT: '',
  CREATE_STEP: '',
  UPDATE_STEP: '',
  SYNC_CANVAS_STATE: '',
};

applyActionTypesNames(LogicConstructorActionTypes, 'LogicConstructor');

export { LogicConstructorActionTypes };
