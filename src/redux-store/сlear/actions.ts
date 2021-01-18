import { ClearActionTypes } from './action-types';

type ClearStores = {
  type: typeof ClearActionTypes.CL_CLEAR_STORES;
};

export const clearStores = (): ClearStores => {
  return {
    type: ClearActionTypes.CL_CLEAR_STORES,
  };
};
