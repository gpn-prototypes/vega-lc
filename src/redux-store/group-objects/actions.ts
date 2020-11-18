import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import client, { projectLink } from '../../client';
import { Mutation, Query } from '../../generated/graphql-project';
import { NewGroupParams, StoreLC } from '../../types/redux-store';
import { getCurrentVersion, incrementVersion } from '../../utils/version';

import { GroupObjectsActionTypes } from './action-types';
import { UPDATE_GROUP_OBJECT } from './mutations';
import { OBJECT_GROUP_LIST } from './queries';

type SetDraggingElements = {
  type: typeof GroupObjectsActionTypes.SET_DRAGGING_ELEMENTS;
  draggingElements: TargetData[];
};

type SetGroupObjectsList = {
  type: typeof GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST;
  nodeList: TreeItem[];
};

type ToggleDialog = {
  type: typeof GroupObjectsActionTypes.TOGGLE_DIALOG;
  isDialogOpened: boolean;
};

type SetNewGroupParams = {
  type: typeof GroupObjectsActionTypes.SET_NEW_GROUP_PARAMS;
  newGroupParams: NewGroupParams;
};

const setGroupObjectsList = (nodeList: TreeItem[]): SetGroupObjectsList => ({
  type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST,
  nodeList,
});

const toggleDialog = (isDialogOpened: boolean): ToggleDialog => ({
  type: GroupObjectsActionTypes.TOGGLE_DIALOG,
  isDialogOpened,
});

const setNewGroupParams = (newGroupParams: NewGroupParams): SetNewGroupParams => ({
  type: GroupObjectsActionTypes.SET_NEW_GROUP_PARAMS,
  newGroupParams,
});

const setGroupObjectsDraggingElements = (draggingElements: TargetData[]): SetDraggingElements => ({
  type: GroupObjectsActionTypes.SET_DRAGGING_ELEMENTS,
  draggingElements,
});

const fetchGroupObjectList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client.setLink(projectLink);

  client
    .query<Query>({
      query: OBJECT_GROUP_LIST,
      fetchPolicy: 'network-only',
    })
    .then((response) => {
      if (!response.loading) {
        const { domain } = response.data;

        const objectGroupList = domain?.objectGroupList;

        const collection: { [x: string]: any } = {};

        if (objectGroupList) {
          objectGroupList.forEach((objectsGroup: any) => {
            const { vid } = objectsGroup;

            if (!collection[vid]) {
              collection[vid] = {
                name: objectsGroup.name,
                id: objectsGroup.vid,
                nodeList: [],
                iconId: 'square',
              };
            }

            objectsGroup.objects.forEach((object: any) => {
              collection[vid].nodeList.push({
                name: object.name,
                id: object.vid,
                iconId: 'circle',
                nodeList: [],
                isDropZone: false,
                isDraggable: false,
              });
            });
          });
        }

        const nodeList = Object.values(collection);

        dispatch(setGroupObjectsList(nodeList));
      } else {
        dispatch(setGroupObjectsList([]));
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const updateGroupObject = (
  groupObjectId: string,
  objectsId: string[],
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState): Promise<void> => {
  let isAlreadyExists = false;

  const { nodeList } = getState().groupObjects;
  const existingObjectsNodeList = nodeList?.find((object) => groupObjectId === object.id)?.nodeList;
  const existingObjectsIds: string[] | undefined = existingObjectsNodeList?.map(
    (object) => object.id,
  );

  if (existingObjectsIds?.length) {
    isAlreadyExists = objectsId.some((id: string) => existingObjectsIds.includes(id));
  }

  if (isAlreadyExists) {
    return;
  }

  const objects = existingObjectsIds?.length ? [...existingObjectsIds, ...objectsId] : objectsId;

  client.setLink(projectLink);
  client
    .mutate<Mutation>({
      mutation: UPDATE_GROUP_OBJECT,
      variables: {
        objects,
        vid: groupObjectId,
        version: getCurrentVersion(),
      },
    })
    .then((response) => {
      if (response.data?.domain?.objectGroup?.update?.__typename !== 'Error') {
        incrementVersion();
        dispatch(fetchGroupObjectList());
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const createNewGroup = (name: string): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client.setLink(projectLink);
  client
    .mutate<Mutation>({
      mutation: UPDATE_GROUP_OBJECT,
      variables: {
        name,
        version: getCurrentVersion(),
      },
    })
    .then((response) => {
      if (response.data?.domain?.objectGroup?.create?.__typename !== 'Error') {
        incrementVersion();
        dispatch(fetchGroupObjectList());
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export {
  fetchGroupObjectList,
  setGroupObjectsList,
  createNewGroup,
  toggleDialog,
  setNewGroupParams,
  updateGroupObject,
  setGroupObjectsDraggingElements,
};
