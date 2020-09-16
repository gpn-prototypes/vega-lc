import { NodeItem } from '@gpn-prototypes/vega-tree';

import getHeaders from '../../utils/headers';

import { ActivitiesActionTypes } from './action-types';

const setActivitiesList = (nodeList: NodeItem[]) => ({
  type: ActivitiesActionTypes.SET_ACTIVITIES_LIST,
  nodeList,
});

const fetchActivitiesList = () => async (dispatch: any, getState: any) => {
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
          collection[name] = {};
          collection[name].name = name;
          collection[name].id = activity.category.vid;
          collection[name].nodeList = [];
        }

        collection[name].nodeList.push({ name: activity.name, id: activity.vid });
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
