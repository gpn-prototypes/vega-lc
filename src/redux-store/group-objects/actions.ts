import { TreeItem } from '@gpn-prototypes/vega-tree';

import getHeaders from '../../utils/headers';

import { GroupObjectsActionTypes } from './action-types';

const setGroupObjectsList = (nodeList: TreeItem[]) => ({
  type: GroupObjectsActionTypes.SET_GROUP_OBJECTS_LIST,
  nodeList,
});

const fetchGroupObjectList = () => async (dispatch: any) => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          '{objectsGroupList{' +
          'vid,' +
          'name,' +
          'objects{' +
          '...on GeoEconomicAppraisalProject_Type{' +
          '__typename,' +
          'name,' +
          'vid}}}}',
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { objectsGroupList } = body.data;

      const collection: { [x: string]: any } = {};

      objectsGroupList.forEach((objectsGroup: any) => {
        const { vid } = objectsGroup;

        if (!collection[vid]) {
          collection[vid] = {
            name: objectsGroup.name,
            id: objectsGroup.vid,
            nodeList: [],
            iconId: 'square',
            isDropZone: false,
            isDraggable: false,
          };
        }

        objectsGroup.objects.forEach((object: any) => {
          collection[vid].nodeList.push({
            name: object.name,
            id: object.vid,
            iconId: 'circle',
          });
        });
      });

      const nodeList = Object.values(collection);

      dispatch(setGroupObjectsList(nodeList));
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchGroupObjectList };
