import { ActionTypes } from '../../types/redux-store';
import { applyActionTypesNames } from '../../utils/apply-action-types-names';

const ProjectStructureActionTypes: ActionTypes = {
  SET_PROJECT_STRUCTURE_LIST: '',
  SET_DRAGGING_ELEMENTS: '',
};

applyActionTypesNames(ProjectStructureActionTypes, 'ProjectStructure');

export { ProjectStructureActionTypes };
