import _ from 'lodash';

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

const setVersionErrorsStrategy = (
  state: VersionState,
  { errors }: { errors: string[] },
): VersionState => ({
  ...state,
  errors: state.errors ? _.uniq([...state.errors, ...errors]) : errors,
});

const deleteVersionErrorStrategy = (
  state: VersionState,
  { index }: { index: number },
): VersionState => {
  const newErrors = state.errors.filter((value, idx) => idx !== index);
  return {
    ...state,
    errors: newErrors,
  };
};

const strategyMap = {
  [VersionActionTypes.SET_VERSION_SUCCESS]: setVersionSuccessStrategy,
  [VersionActionTypes.SET_VERSION_ERRORS]: setVersionErrorsStrategy,
  [VersionActionTypes.DELETE_VERSION_ERROR]: deleteVersionErrorStrategy,
};

const activitiesReducer = createReducer(strategyMap, initialState);

export default activitiesReducer;
