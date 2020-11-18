import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';

import { GroupObjectsState, NewGroupParams, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): GroupObjectsState => state.groupObjects;

export const getGroupObjectsNodeList = (state: StoreLC): TreeItem[] | undefined =>
  getCurrentState(state).nodeList;
export const getIsDialogOpened = (state: StoreLC): boolean =>
  getCurrentState(state).isDialogOpened || false;
export const getNewGroupParams = (state: StoreLC): NewGroupParams =>
  getCurrentState(state).newGroupParams || { isDynamic: false, name: '' };
export const getGroupObjectsDraggingElements = (state: StoreLC): TargetData[] | undefined =>
  getCurrentState(state).draggingElements;
