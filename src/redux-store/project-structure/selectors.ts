import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';

import { ProjectStructureState, StoreLC } from '@/types/redux-store';

const getCurrentState = (state: StoreLC): ProjectStructureState => state.projectStructure;

export const getProjectStructureNodeList = (state: StoreLC): TreeItem[] =>
  getCurrentState(state).nodeList;

export const getProjectStructureDraggingElements = (state: StoreLC): TargetData[] =>
  getCurrentState(state).draggingElements;
