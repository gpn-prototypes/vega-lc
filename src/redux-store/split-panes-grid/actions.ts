import { SplitPanesGridActionsTypes } from '@/redux-store/split-panes-grid/action-types';
import { SplitPanesGridSize } from '@/types/redux-store';

type SetGridSize = {
  type: typeof SplitPanesGridActionsTypes.SET_GRID_SIZE;
  gridSize: SplitPanesGridSize;
};

export const setGridSize = (gridSize: SplitPanesGridSize): SetGridSize => ({
  type: SplitPanesGridActionsTypes.SET_GRID_SIZE,
  gridSize,
});
