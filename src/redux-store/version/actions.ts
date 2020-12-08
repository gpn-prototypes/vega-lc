import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ProjectStructureQuery, StoreLC } from '../../types/redux-store';
import { setCurrentVersion } from '../../utils/version';
import { ProjectStructureActionTypes } from '../project-structure/action-types';

import { VersionActionTypes } from './action-types';

import { projectQuery } from '@/utils/graphql-request';

interface SetVersionSuccessType {
  type: typeof VersionActionTypes.SET_VERSION_SUCCESS;
  version: number;
}

interface SetVersionErrorsType {
  type: typeof VersionActionTypes.SET_VERSION_ERRORS;
  errors: string[];
}

interface DeleteVersionErrorType {
  type: typeof VersionActionTypes.DELETE_VERSION_ERROR;
  index: number;
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

const SetVersionSuccess = (version: number): SetVersionSuccessType => ({
  type: VersionActionTypes.SET_VERSION_SUCCESS,
  version,
});

const SetVersionErrors = (errors: string[]): SetVersionErrorsType => ({
  type: VersionActionTypes.SET_VERSION_ERRORS,
  errors,
});

const DeleteVersionError = (index: number): DeleteVersionErrorType => ({
  type: VersionActionTypes.DELETE_VERSION_ERROR,
  index,
});

const SetProjectStructureQuery = (projectStructureQuery: ProjectStructureQuery) => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY,
  projectStructureQuery,
});

function buildStructureQuery(entityImages: EntityImage[]): ProjectStructureQuery {
  if (!entityImages.length) return { query: '', tree: [] };

  const image = entityImages.find((ei) => ei.name === 'GeoEconomicAppraisalProject');
  let query = `{ domain { geoEconomicAppraisalProjectList { typename:__typename vid name `;
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

  query += '} } }';

  return {
    query,
    tree,
  };
}

const fetchVersion = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  try {
    const response = await projectQuery();

    if (response?.data) {
      setCurrentVersion(response.data?.project.version);

      const structureQuery = buildStructureQuery(response.data?.project.domainSchema.entityImages);

      dispatch(SetVersionSuccess(response.data?.project.version));
      dispatch(SetProjectStructureQuery(structureQuery));
    } else {
      dispatch(SetVersionErrors(['Response has no data']));
      console.error('Response has no data', response);
    }
  } catch (e) {
    if (Array.isArray(e)) {
      dispatch(SetVersionErrors(e.map((error) => error.message)));
    } else {
      dispatch(SetVersionErrors([e.message]));
    }
    console.error(e);
  }
};

export { fetchVersion, DeleteVersionError };
