import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { ProjectStructureQuery, StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';
import { getProjectId } from '../../utils/project-id';
import { setCurrentVersion } from '../../utils/version';
import { ProjectStructureActionTypes } from '../project-structure/action-types';

import { VersionActionTypes } from './action-types';

interface SetVersionSuccessType {
  type: typeof VersionActionTypes.SET_VERSION_SUCCESS;
  version: number;
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

const SetProjectStructureQuery = (projectStructureQuery: ProjectStructureQuery) => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY,
  projectStructureQuery,
});

function buildStructureQuery(entityImages: EntityImage[]): ProjectStructureQuery {
  const image = entityImages.find((ei) => ei.name === 'GeoEconomicAppraisalProject');
  let query = `{ domain { geoEconomicAppraisalProjectList { vid name `;
  const tree = ['geoEconomicAppraisalProjectList'];

  function buildAttributeQuery(attr: EntityImageAttribute | undefined): string {
    if (!attr) {
      return '';
    }

    const found = entityImages.find((ei) => ei.entity.vid === attr.entity.vid);

    if (found) {
      tree.push(attr.name);

      const attributeFound = found.attributes.find((i) => i.attrType === '[*]');

      return `${attr.name} { ... on ${found.name}_Type { vid name ${buildAttributeQuery(
        attributeFound,
      )} } }`;
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
    const response = await graphQlRequest({
      body: {
        query: `{
            project(vid:"${getProjectId()}") {
              __typename
              ... on Project {
                version
                rootEntity
                domainSchema {
                  entityImages {
                    vid
                    name
                    entity {
                      vid
                      name
                    }
                    attributes {
                      title
                      name
                      attrType
                      unit
                      description
                      entity {
                        vid
                        name
                      }
                    }
                  }
                }
              }
              ... on Error {
                code
                message
              }
            }
          }`,
      },
    });

    if (response.data) {
      setCurrentVersion(response.data?.project.version);

      const structureQuery = buildStructureQuery(response.data?.project.domainSchema.entityImages);

      dispatch(SetVersionSuccess(response.data?.project.version));
      dispatch(SetProjectStructureQuery(structureQuery));
    } else {
      // TODO: throw error | show error
      //
      console.error('Response has no data', response);
    }
  } catch (e) {
    // TODO: throw error | show error
    console.error(e);
  }
};

export { fetchVersion };
