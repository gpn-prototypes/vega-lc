import { ActionTypes } from '../../types/redux-store';
import { applyActionTypesNames } from '../../utils/apply-action-types-names';

const VersionActionTypes: ActionTypes = {
  SET_VERSION_SUCCESS: '',
};

applyActionTypesNames(VersionActionTypes, 'Version');

export { VersionActionTypes };
