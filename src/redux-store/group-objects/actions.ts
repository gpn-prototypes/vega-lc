import { TreeItem } from '@gpn-prototypes/vega-tree';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { NewGroupParams, StoreLC } from '../../types/redux-store';
import getHeaders from '../../utils/headers';

import { GroupObjectsActionTypes } from './action-types';

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
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `query {domain{objectGroupList{
          vid,
          name,
          objects{
          vid,
          name,
          ...on LicensingRound_A_Type{
          name,
          vid}}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { domain } = body.data;
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
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `mutation($vid: UUID!,$vids: [UUID]){domain{objectGroup{update(vid: $vid,vids: $vids){ok, name, vids}}}}`,
        variables: { vids, vid: groupObjectId },
      }),
    });

    if (response.ok) {
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
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `mutation {domain{objectGroup{create(name: "${name}"){vid,ok,vids}}}}`,
      }),
    });

    if (response.ok) {
      dispatch(fetchGroupObjectList());
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchGroupObjectList, createNewGroup, toggleDialog, setNewGroupParams, updateGroupObject };
