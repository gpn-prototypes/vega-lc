import { TreeItem } from '@gpn-prototypes/vega-ui';

import { GroupObjectsState, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): GroupObjectsState => state.groupObjects;

export const getGroupObjectsNodeList = (state: StoreLC): TreeItem[] | undefined =>
  getCurrentState(state).nodeList;
