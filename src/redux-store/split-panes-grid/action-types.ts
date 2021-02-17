import { applyActionTypesNames } from '@/utils/apply-action-types-names';

type GridActions = 'SET_GRID_SIZE';

const SplitPanesGridActionsTypes: Record<GridActions, string> = {
  SET_GRID_SIZE: '',
};

applyActionTypesNames(SplitPanesGridActionsTypes, 'SplitPanesGrid');

export { SplitPanesGridActionsTypes };
