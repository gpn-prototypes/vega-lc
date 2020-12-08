import { applyActionTypesNames } from '../../utils/apply-action-types-names';

type VersionActions = 'SET_VERSION_SUCCESS' | 'SET_VERSION_ERRORS' | 'DELETE_VERSION_ERROR';

const VersionActionTypes: Record<VersionActions, string> = {
  SET_VERSION_SUCCESS: '',
  SET_VERSION_ERRORS: '',
  DELETE_VERSION_ERROR: '',
};

applyActionTypesNames(VersionActionTypes, 'Version');

export { VersionActionTypes };
