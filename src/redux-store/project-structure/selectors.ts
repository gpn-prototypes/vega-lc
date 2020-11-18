import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';

import { ProjectStructureState, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): ProjectStructureState => state.projectStructure;

export const getProjectStructureNodeList = (state: StoreLC): TreeItem[] | undefined =>
  getCurrentState(state).nodeList;

export const getProjectStructureDraggingElements = (state: StoreLC): TargetData[] | undefined =>
  getCurrentState(state).draggingElements;
