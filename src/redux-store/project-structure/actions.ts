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

const DEFAULT_QUERY = `{
  domain{
    geoEconomicAppraisalProjectList{
      vid name
    }
  }
}`;

const DEFAULT_TREE = ['geoEconomicAppraisalProjectList'];

interface DomainObject {
  vid: string;
  name: string;
  [key: string]: DomainObject[] | string;
}

function buildTree(current: DomainObject, tree: string[], level: number): TreeItem[] {
  const key = tree[level];
  const items: DomainObject[] = current[key] as DomainObject[];
  return items.map((item) => ({
    name: item.name,
    id: item.vid,
    iconId: 'blue-line',
    nodeList: level + 1 < tree.length ? buildTree(item, tree, level + 1) : [],
  }));
}

const fetchProjectStructureList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();

    const query = state.projectStructure.projectStructureQuery?.query || DEFAULT_QUERY;
    const tree = state.projectStructure.projectStructureQuery?.tree || DEFAULT_TREE;

    const response = await graphQlRequest({
      body: { query },
      appendProjectId: true,
    });

    if (response.data) {
      const { domain } = response.data;

      const nodeList = buildTree(domain, tree, 0);

      dispatch(setProjectStructureList(nodeList));
    } else {
      // TODO: throw error | show error
      console.error('Response has no data', response);
    }
  } catch (e) {
    // TODO: throw error | show error
    console.error(e);
  }
};

export { fetchProjectStructureList, setProjectStructureList, setProjectStructureDraggingElements };
