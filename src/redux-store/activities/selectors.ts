import { TreeItem } from '@gpn-prototypes/vega-ui';

import { ActivitiesState, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): ActivitiesState => state.activities;

export const getActivitiesNodeList = (state: StoreLC): TreeItem[] | undefined =>
  getCurrentState(state).nodeList;
export const getSearchStringValue = (state: StoreLC): string | null | undefined =>
  getCurrentState(state).searchString;
export const getIsAutoFocus = (state: StoreLC): boolean | undefined =>
  getCurrentState(state).autoFocus;
