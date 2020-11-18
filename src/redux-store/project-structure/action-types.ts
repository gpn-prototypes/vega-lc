import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type ProjectStructureActions = 'SET_PROJECT_STRUCTURE_LIST' | 'SET_DRAGGING_ELEMENTS';

const ProjectStructureActionTypes: Record<ProjectStructureActions, string> = {
  SET_PROJECT_STRUCTURE_LIST: '',
  SET_DRAGGING_ELEMENTS: '',
};

applyActionTypesNames(ProjectStructureActionTypes, 'ProjectStructure');

export { ProjectStructureActionTypes };
