import { TreeItem } from '@gpn-prototypes/vega-tree';

import getHeaders from '../../utils/headers';

import { ActivitiesActionTypes } from './action-types';

const setActivitiesList = (nodeList: TreeItem[]) => ({
  type: ActivitiesActionTypes.SET_ACTIVITIES_LIST,
  nodeList,
});

const fetchActivitiesList = () => async (dispatch: any) => {
  try {
    const response = await fetch(`graphql`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          '{activityList{' +
          'vid,' +
          'code,' +
          'createdAt,' +
          'editedAt,' +
          'name,' +
          'title,' +
          'description,' +
          'category{' +
          'vid,' +
          'code,' +
          'name,' +
          'parent{' +
          'vid,' +
          'code,' +
          'name}}}}',
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

export { fetchActivitiesList };
