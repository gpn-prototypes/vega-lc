import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Query } from '../../generated/graphql-project';
import { StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';

import { ProjectStructureActionTypes } from './action-types';
import { FETCH_PROJECT_STRUCTURE_LIST } from './queries';

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
  graphQlRequest({
    body: {
      query: FETCH_PROJECT_STRUCTURE_LIST,
    },
    appendProjectId: true,
  })
    .then((response) => {
      const geoEconomicAppraisalProjectList = (response as Query).domain
        ?.geoEconomicAppraisalProjectList;

      const collection: { [x: string]: any } = {};

      if (geoEconomicAppraisalProjectList) {
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
      }

      const nodeList = Object.values(collection);

      dispatch(setProjectStructureList(nodeList));
    })
    .catch((err) => {
      console.error(err);
    });
};

export { fetchProjectStructureList, setProjectStructureList, setProjectStructureDraggingElements };
