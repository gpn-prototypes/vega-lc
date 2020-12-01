import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { NewGroupParams, StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';
import { getCurrentVersion } from '../../utils/version';

import { GroupObjectsActionTypes } from './action-types';

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
  try {
    const response = await graphQlRequest({
      body: {
        query: `query {domain{objectGroupList{
          vid,
          name,
          objects{
          vid,
          name
        }}}}`,
      },
      appendProjectId: true,
    });

    if (response.data) {
      const { domain } = response.data;
      const { objectGroupList } = domain;

      const collection: { [x: string]: any } = {};

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

      const nodeList = Object.values(collection);

      dispatch(setGroupObjectsList(nodeList));
    } else {
      dispatch(setGroupObjectsList([]));
    }
  } catch (e) {
    console.error(e);
  }
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

  const vids = existingObjectsIds?.length ? [...existingObjectsIds, ...objectsId] : objectsId;

  try {
    const version = getCurrentVersion();
    const requestBody = {
      query: `mutation($vid: UUID!,$vids: [UUID], $version: Int!){domain{objectGroup{update(vid: $vid,vids: $vids, version: $version){ok, name, vids}}}}`,
      variables: { vids, vid: groupObjectId, version },
    };

    const response = await graphQlRequest({
      body: requestBody,
      appendProjectId: true,
      isMutation: true,
    });

    if (response.data) {
      dispatch(fetchGroupObjectList());
    }
  } catch (e) {
    console.error(e);
  }
};

const createNewGroup = (name: string): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  try {
    const version = getCurrentVersion();
    const requestBody = {
      query: `mutation ($version: Int!, $name: String!) {domain{objectGroup{create(name: $name, version: $version){vid,ok,vids}}}}`,
      variables: {
        name,
        version,
      },
    };

    const response = await graphQlRequest({
      body: requestBody,
      appendProjectId: true,
      isMutation: true,
    });

    if (response.data) {
      dispatch(fetchGroupObjectList());
    }
  } catch (e) {
    console.error(e);
  }
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
