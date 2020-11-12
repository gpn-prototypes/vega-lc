import React, { Dispatch } from 'react';
import { TargetData, TreeItem } from '@gpn-prototypes/vega-tree';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import client from '../../client';
import { StoreLC } from '../../types/redux-store';

import { ActivitiesActionTypes } from './action-types';
import { ACTIVITY_LIST } from './queries';

type SetIsAutoFocus = { type: typeof ActivitiesActionTypes.SET_IS_AUTO_FOCUS; autoFocus: boolean };

type SetDraggingElements = {
  type: typeof ActivitiesActionTypes.SET_DRAGGING_ELEMENTS;
  draggingElements: TargetData[];
};

type SetActivitiesRef = {
  type: typeof ActivitiesActionTypes.SET_ACTIVITIES_REF;
  activitiesRef: React.RefObject<HTMLElement>;
};

type SetActivitiesList = {
  type: typeof ActivitiesActionTypes.SET_ACTIVITIES_LIST;
  nodeList: TreeItem[];
};

const setActivitiesList = (nodeList: TreeItem[]): SetActivitiesList => ({
  type: ActivitiesActionTypes.SET_ACTIVITIES_LIST,
  nodeList,
});

const setIsAutoFocus = (autoFocus: boolean): SetIsAutoFocus => ({
  type: ActivitiesActionTypes.SET_IS_AUTO_FOCUS,
  autoFocus,
});

const setActivitiesRef = (activitiesRef: React.RefObject<HTMLElement>): SetActivitiesRef => ({
  type: ActivitiesActionTypes.SET_ACTIVITIES_REF,
  activitiesRef,
});

const setActivitiesDraggingElements = (draggingElements: TargetData[]): SetDraggingElements => ({
  type: ActivitiesActionTypes.SET_DRAGGING_ELEMENTS,
  draggingElements,
});

const setSearchString = (searchString: string | null) => (
  dispatch: Dispatch<unknown>,
  getState: () => StoreLC,
): void => {
  const { activities } = getState();

  if (!activities.autoFocus) {
    dispatch(setIsAutoFocus(true));
  }

  dispatch({ type: ActivitiesActionTypes.SET_SEARCH_STRING, searchString });
};

const fetchActivitiesList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client
    .query({
      query: ACTIVITY_LIST,
      fetchPolicy: 'network-only',
    })
    .then((response) => {
      if (!response.loading) {
        const { activityList } = response.data;
        const collection: { [x: string]: any } = {};

        activityList.forEach((activity: any) => {
          const { name } = activity.category;

          if (!collection[name]) {
            collection[name] = {
              name,
              id: activity.category.vid,
              nodeList: [],
              isDropZone: false,
              isDraggable: false,
            };
          }

          collection[name].nodeList.push({
            name: activity.name,
            id: activity.vid,
            iconId: 'blue-line',
            nodeList: [],
          });
        });

        const nodeList = Object.values(collection);

        dispatch(setActivitiesList(nodeList));
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export {
  fetchActivitiesList,
  setSearchString,
  setIsAutoFocus,
  setActivitiesRef,
  setActivitiesDraggingElements,
};
