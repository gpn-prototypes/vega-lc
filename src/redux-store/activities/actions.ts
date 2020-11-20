import React, { Dispatch } from 'react';
import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Query } from '../../generated/graphql';
import { StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';

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
  graphQlRequest({
    body: {
      query: ACTIVITY_LIST,
    },
  })
    .then((response) => {
      const { activityList } = response as Query;
      const collection: { [x: string]: any } = {};

      if (activityList) {
        activityList.forEach((activity: any) => {
          const { name } = activity.category;

          if (!collection[name]) {
            collection[name] = {
              name,
              id: activity.category.vid,
              nodeList: [],
            };
          }
        });
      }
      const nodeList = Object.values(collection);

      dispatch(setActivitiesList(nodeList));
    })
    .catch((err) => {
      console.error(err);
    });
};

export {
  fetchActivitiesList,
  setActivitiesList,
  setSearchString,
  setIsAutoFocus,
  setActivitiesRef,
  setActivitiesDraggingElements,
};
