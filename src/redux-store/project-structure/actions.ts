import { gql } from '@apollo/client';
import { TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { clearStores } from '../clear/actions';
import { setNotification } from '../notifications/actions';

import { ProjectStructureActionTypes } from './action-types';

import { ProjectStructureQuery, StoreLC } from '@/types/redux-store';
import { logicConstructorService } from '@/utils/lc-service';

interface DomainObject {
  vid: string;
  name: string;
  // eslint-disable-next-line no-underscore-dangle
  typename: string;

  [key: string]: DomainObject[] | string;
}

interface Entity {
  name: string;
  vid: string;
}

interface EntityImageAttribute {
  name: string;
  attrType: string;
  entity: Entity;
}

interface EntityImage {
  vid: string;
  name: string;
  attributes: EntityImageAttribute[];
  entity: Entity;
}

export type SetProjectStructureList = {
  type: typeof ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_LIST;
  nodeList: TreeItem[];
};

export type SetDraggingElements = {
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

const setProjectStructureQuery = (projectStructureQuery: ProjectStructureQuery) => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY,
  projectStructureQuery,
});

const DEFAULT_QUERY = `{
  project {
    vid
    domain{
      geoEconomicAppraisalProjectList{
        vid name
      }
    }
  }
}`;

const DEFAULT_TREE = ['geoEconomicAppraisalProjectList'];

// TODO: make maps with entities
const ICONS_MAP: { [key: string]: string } = {
  Trap_Type: 'red-line',
  OilPool_Type: 'orange-line',
};

function buildTree(current: DomainObject, tree: string[], level: number): TreeItem[] {
  const key = tree[level];
  const items: DomainObject[] = current[key] as DomainObject[];
  return items.map((item) => {
    const iconId = ICONS_MAP[item.typename] || 'blue-line';
    return {
      name: item.name,
      id: item.vid,
      iconId,
      nodeList: level + 1 < tree.length ? buildTree(item, tree, level + 1) : [],
    };
  });
}

const fetchProjectStructureList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();

    const query = gql(state.projectStructure.projectStructureQuery?.query || DEFAULT_QUERY);
    const tree = state.projectStructure.projectStructureQuery?.tree || DEFAULT_TREE;

    const response = await logicConstructorService.client
      ?.watchQuery({
        query,
        context: {
          uri: logicConstructorService.getGraphQlUri(),
        },
      })
      .result();

    if (response?.data) {
      const { domain } = response.data.project;

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

function buildStructureQuery(entityImages: EntityImage[]): ProjectStructureQuery {
  if (!entityImages.length) return { query: '', tree: [] };

  const image = entityImages.find((ei) => ei.name === 'GeoEconomicAppraisalProject');
  let query = `{ project { vid domain { geoEconomicAppraisalProjectList { typename:__typename vid name `;
  const tree = ['geoEconomicAppraisalProjectList'];
  const loadedImages: string[] = [];

  function buildAttributeQuery(attr: EntityImageAttribute | undefined): string {
    if (!attr) {
      return '';
    }
    const found = entityImages.find(
      (ei) => ei.entity.vid === attr.entity.vid && loadedImages.indexOf(ei.vid) < 0,
    );
    if (found) {
      tree.push(attr.name);
      loadedImages.push(found.vid);
      const attributeFound = found.attributes.find((i) => i.attrType === '[*]');

      return `${attr.name} { typename:__typename ... on ${
        found.name
      }_Type { vid name ${buildAttributeQuery(attributeFound)} } }`;
    }

    return '';
  }

  if (image) {
    const attributeFound = image.attributes.find((i) => i.attrType === '[*]');
    query += buildAttributeQuery(attributeFound);
  }

  query += '} } } }';

  return {
    query,
    tree,
  };
}

const fetchProjectSchema = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  dispatch(clearStores());

  try {
    const response = await logicConstructorService.projectStructureQuery();

    if (response?.data) {
      const structureQuery = buildStructureQuery(response.data?.project.domainSchema.entityImages);

      dispatch(setProjectStructureQuery(structureQuery));
    } else {
      dispatch(setNotification({ message: 'Пустой ответ сервера', status: 'alert' }));
    }
  } catch (e) {
    if (e.networkError?.result) {
      const { errors } = e.networkError?.result;
      if (
        Array.isArray(errors) &&
        errors.find((error) => error.message === 'badly formed hexadecimal UUID string')
      ) {
        const message = 'В url не корректный UUID проекта';
        dispatch(setNotification({ message, status: 'alert' }));
      }
    }
  }
};

export {
  fetchProjectSchema,
  fetchProjectStructureList,
  setProjectStructureList,
  setProjectStructureDraggingElements,
};
