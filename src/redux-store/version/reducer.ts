import { VersionState } from '../../types/redux-store';
import createReducer from '../../utils/create-reducer';

import { VersionActionTypes } from './action-types';
import initialState from './initial-state';

const setVersionSuccessStrategy = (
  state: VersionState,
  { version }: { version: number },
): VersionState => ({
  ...state,
  version,
});

const strategyMap = {
  [VersionActionTypes.SET_VERSION_SUCCESS]: setVersionSuccessStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default activitiesReducer;
