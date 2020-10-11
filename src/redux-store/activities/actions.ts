import React, { Dispatch } from 'react';
import { TreeItem } from '@gpn-prototypes/vega-tree';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { StoreLC } from '../../types/redux-store';
import getHeaders from '../../utils/headers';

import { ActivitiesActionTypes } from './action-types';

type SetIsAutoFocus = { type: typeof ActivitiesActionTypes.SET_IS_AUTO_FOCUS; autoFocus: boolean };

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
  try {
    const response = await fetch(`graphql`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          `{activityList{` +
          `vid,` +
          `code,` +
          `createdAt,` +
          `editedAt,` +
          `name,` +
          `title,` +
          `description,` +
          `category{` +
          `vid,` +
          `code,` +
          `name,` +
          `parent{` +
          `vid,` +
          `code,` +
          `name}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { activityList } = body.data;
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
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchActivitiesList, setSearchString, setIsAutoFocus, setActivitiesRef };
