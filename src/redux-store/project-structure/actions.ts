import { TreeItem } from '@gpn-prototypes/vega-tree';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { StoreLC } from '../../types/redux-store';
import getHeaders from '../../utils/headers';

import { ProjectStructureActionTypes } from './action-types';

type SetProjectStructureList = {
  type: typeof ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST;
  nodeList: TreeItem[];
};

const setProjectStructureList = (nodeList: TreeItem[]): SetProjectStructureList => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST,
  nodeList,
});

const fetchProjectStructureList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
) => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          `{domain{geoEconomicAppraisalProjectList{` +
          `vid,` +
          `name,` +
          `licensingRounds{` +
          `__typename,` +
          `...on LicensingRound_A_Type{` +
          `__typename,` +
          `name,` +
          `vid}}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { domain } = body.data;
      const { geoEconomicAppraisalProjectList } = domain;

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
