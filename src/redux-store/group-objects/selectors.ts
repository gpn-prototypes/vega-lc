import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';

import { GroupObjectsState, NewGroupParams, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): GroupObjectsState => state.groupObjects;

export const getGroupObjectsNodeList = (state: StoreLC): TreeItem[] => [];
export const getIsDialogOpened = (state: StoreLC): boolean => getCurrentState(state).isDialogOpened;
export const getNewGroupParams = (state: StoreLC): NewGroupParams =>
  getCurrentState(state).newGroupParams;
export const getGroupObjectsDraggingElements = (state: StoreLC): TargetData[] =>
  getCurrentState(state).draggingElements;
