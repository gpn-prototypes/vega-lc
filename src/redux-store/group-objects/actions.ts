import { TreeItem } from '@gpn-prototypes/vega-tree';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import client, { projectLink } from '../../client';
import { Mutation, Query } from '../../generated/graphql-project';
import { NewGroupParams, StoreLC } from '../../types/redux-store';

import { GroupObjectsActionTypes } from './action-types';
import { CREATE_NEW_GROUP, UPDATE_GROUP_OBJECT } from './mutations';
import { OBJECT_GROUP_LIST } from './queries';

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
      variables: { objects, vid: groupObjectId },
    })
    .then(() => {
      dispatch(fetchGroupObjectList());
    })
    .catch((error) => {
      console.error(error);
    });
};

const createNewGroup = (name: string): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client.setLink(projectLink);

  client
    .mutate<Mutation>({
      mutation: CREATE_NEW_GROUP,
      variables: { name },
    })
    .then(() => {
      dispatch(fetchGroupObjectList());
    })
    .catch((error) => {
      console.error(error);
    });
};

export { fetchGroupObjectList, createNewGroup, toggleDialog, setNewGroupParams, updateGroupObject };
