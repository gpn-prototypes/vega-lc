import React from 'react';
import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';

import { ActivitiesState, StoreLC } from '../../types/redux-store';

const getCurrentState = (state: StoreLC): ActivitiesState => state.activities;

export const getSearchStringValue = (state: StoreLC): string | null | undefined =>
  getCurrentState(state).searchString;

export const getIsAutoFocus = (state: StoreLC): boolean | undefined =>
  getCurrentState(state).autoFocus;

export const getActivitiesRef = (state: StoreLC): React.RefObject<HTMLElement> | null | undefined =>
  getCurrentState(state).activitiesRef;

export const getActivitiesDraggingElements = (state: StoreLC): TargetData[] | undefined =>
  getCurrentState(state).draggingElements;

export const getIsDroppingOnExistingStep = (state: StoreLC): boolean | undefined =>
  getCurrentState(state).isDroppingOnExistingStep;

export const getIsActivitiesPanelOpen = (state: StoreLC): boolean =>
  getCurrentState(state).isActivitiesPanelOpen;

export const getActivitiesNodeList = (searchString: string | null | undefined) => (
  state: StoreLC,
): TreeItem[] | undefined => {
  let { nodeList } = getCurrentState(state);

  if (searchString && nodeList) {
    const regexp = new RegExp(`${searchString}`, 'i');

    const filteredNodeList: TreeItem[] = [];

    nodeList.forEach((n: TreeItem) => {
      const obj = { ...n, isExpanded: true };
      const newNodeList: TreeItem[] = [];

      obj.nodeList.forEach((node: TreeItem) => {
        if (regexp.test(node.name)) {
          newNodeList.push(node);
        }
      });

      const isMatchedSubNodes = newNodeList.length > 0;

      if (isMatchedSubNodes) {
        obj.nodeList = newNodeList;
      }

      if (regexp.test(n.name) || isMatchedSubNodes) {
        filteredNodeList.push(obj);
      }
    });

    nodeList = filteredNodeList;

    return nodeList;
  }

  return nodeList;
};
