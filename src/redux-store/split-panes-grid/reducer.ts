import { persistReducer } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage/session';

import { SplitPanesGridActionsTypes } from '@/redux-store/split-panes-grid/action-types';
import initialState from '@/redux-store/split-panes-grid/initial-state';
import { SplitPanesGridSize, SplitPanesGridState } from '@/types/redux-store';
import createReducer from '@/utils/create-reducer';

const persistConfig: PersistConfig<unknown> = {
  key: 'splitPanesGrid',
  storage,
  whitelist: ['gridSize'],
};

const setGridSizeStrategy = (
  state: SplitPanesGridState,
  { gridSize }: { gridSize: SplitPanesGridSize },
): SplitPanesGridState => ({
  ...state,
  gridSize,
});

const strategyMap = {
  [SplitPanesGridActionsTypes.SET_GRID_SIZE]: setGridSizeStrategy,
};

const splitPanesGridReducer = createReducer(strategyMap, initialState);

export default persistReducer(persistConfig, splitPanesGridReducer);
