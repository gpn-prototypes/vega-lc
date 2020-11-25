import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';

import { ProjectStructureActionTypes } from './action-types';

type SetProjectStructureList = {
  type: typeof ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST;
  nodeList: TreeItem[];
};

type SetDraggingElements = {
  type: typeof ProjectStructureActionTypes.SET_DRAGGING_ELEMENTS;
  draggingElements: TargetData[];
};

const setProjectStructureList = (nodeList: TreeItem[]): SetProjectStructureList => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST,
  nodeList,
});

const setProjectStructureDraggingElements = (
  draggingElements: TargetData[],
): SetDraggingElements => ({
  type: ProjectStructureActionTypes.SET_DRAGGING_ELEMENTS,
  draggingElements,
});

const fetchProjectStructureList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
) => {
  try {
    const response = await graphQlRequest({
      body: {
        query: `{domain{geoEconomicAppraisalProjectList{
          vid,
          name,
          licensingRounds{
          __typename,
          ...on LicensingRound_A_Type{
          __typename,
          name,
          vid}}}}}`,
      },
      appendProjectId: true,
    });

    if (response.data) {
      const { domain } = response.data;
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
      console.error(response);
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchProjectStructureList, setProjectStructureList, setProjectStructureDraggingElements };
