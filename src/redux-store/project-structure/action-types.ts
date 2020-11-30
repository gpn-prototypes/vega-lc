import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type ProjectStructureActions =
  | 'SET_PROJECT_STRUCTURE_LIST'
  | 'SET_DRAGGING_ELEMENTS'
  | 'SET_PROJECT_STRUCTURE_QUERY';

const ProjectStructureActionTypes: Record<ProjectStructureActions, string> = {
  SET_PROJECT_STRUCTURE_LIST: '',
  SET_DRAGGING_ELEMENTS: '',
  SET_PROJECT_STRUCTURE_QUERY: '',
};

applyActionTypesNames(ProjectStructureActionTypes, 'ProjectStructure');

export { ProjectStructureActionTypes };
