import { applyActionTypesNames } from '@/utils/apply-action-types-names';

export type ClearActions = 'LC_CLEAR_STORES';

const ClearActionTypes: Record<ClearActions, string> = {
  LC_CLEAR_STORES: '',
};

applyActionTypesNames(ClearActionTypes, 'Clear');

export { ClearActionTypes };
