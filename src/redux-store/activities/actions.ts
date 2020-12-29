import React, { Dispatch } from 'react';
import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ActivitiesActionTypes } from './action-types';

import { StoreLC } from '@/types/redux-store';
import { logicConstructorService } from '@/utils/lc-service';

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

type SetIsDroppingOnExisting = {
  type: typeof ActivitiesActionTypes.SET_IS_DROPPING_ON_EXISTING_STEP;
  isDroppingOnExistingStep: boolean;
};

type SetActivitiesPanelOpen = {
  type: typeof ActivitiesActionTypes.SET_ACTIVITIES_PANEL_OPEN;
  isActivitiesPanelOpen: boolean;
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

const setIsDroppingOnExistingStep = (
  isDroppingOnExistingStep: boolean,
): SetIsDroppingOnExisting => ({
  type: ActivitiesActionTypes.SET_IS_DROPPING_ON_EXISTING_STEP,
  isDroppingOnExistingStep,
});

const setActivitiesPanelOpen = (isActivitiesPanelOpen: boolean): SetActivitiesPanelOpen => ({
  type: ActivitiesActionTypes.SET_ACTIVITIES_PANEL_OPEN,
  isActivitiesPanelOpen,
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
    const response = await logicConstructorService.activityListQuery();

    if (response?.data) {
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
    } else {
      console.log(response);
    }
  } catch (e) {
    console.error(e);
  }
};

export {
  fetchActivitiesList,
  setActivitiesList,
  setSearchString,
  setIsAutoFocus,
  setActivitiesRef,
  setIsDroppingOnExistingStep,
  setActivitiesDraggingElements,
  setActivitiesPanelOpen,
};
