import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type VersionActions = 'SET_VERSION_SUCCESS';

const VersionActionTypes: Record<VersionActions, string> = {
  SET_VERSION_SUCCESS: '',
};

applyActionTypesNames(VersionActionTypes, 'Version');

export { VersionActionTypes };
