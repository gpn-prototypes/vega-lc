import { SplitPanesGridSize, SplitPanesGridState, StoreLC } from '@/types/redux-store';

const getCurrentState = (state: StoreLC): SplitPanesGridState => state.splitPanesGrid;

export const getSplitPanesGridSize = (state: StoreLC): SplitPanesGridSize =>
  getCurrentState(state).gridSize;
