import { TreeItem } from '@gpn-prototypes/vega-tree';

import getHeaders from '../../utils/headers';

import { ProjectStructureActionTypes } from './action-types';

const setProjectStructureList = (nodeList: TreeItem[]) => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST,
  nodeList,
});

const fetchProjectStructureList = () => async (dispatch: any) => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          '{geoEconomicAppraisalProjectList{' +
          'vid,' +
          'name,' +
          'licensingRounds{' +
          '__typename,' +
          '...on LicensingRound_A_Type{' +
          '__typename,' +
          'name,' +
          'vid}}}}',
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { geoEconomicAppraisalProjectList } = body.data;

      const collection: { [x: string]: any } = {};

      geoEconomicAppraisalProjectList.forEach((project: any) => {
        const { vid } = project;

        if (!collection[vid]) {
          collection[vid] = {
            name: project.name,
            id: project.vid,
            nodeList: [],
            iconId: 'blue-line',
            isDropZone: false,
            isDraggable: false,
          };
        }

        if (Array.isArray(project.licensingRounds)) {
          project.licensingRounds.forEach((object: any) => {
            collection[vid].nodeList.push({
              name: object.name,
              id: object.vid,
              iconId: 'orange-line',
              nodeList: [],
            });
          });
        }
      });

      const nodeList = Object.values(collection);

      dispatch(setProjectStructureList(nodeList));
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchProjectStructureList, setProjectStructureList };
