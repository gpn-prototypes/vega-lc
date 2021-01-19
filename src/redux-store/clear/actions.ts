import { ClearActionTypes } from './action-types';

type ClearStores = {
  type: typeof ClearActionTypes.LC_CLEAR_STORES;
};

export const clearStores = (): ClearStores => {
  return {
    type: ClearActionTypes.LC_CLEAR_STORES,
  };
};
