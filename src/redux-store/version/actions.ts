import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { clearStores } from '../clear/actions';
import { setNotification } from '../notifications/actions';
import { ProjectStructureActionTypes } from '../project-structure/action-types';

import { VersionActionTypes } from './action-types';

import { ProjectStructureQuery, StoreLC } from '@/types/redux-store';
import { logicConstructorService } from '@/utils/lc-service';

type SetVersionSuccess = {
  type: typeof VersionActionTypes.SET_VERSION_SUCCESS;
  version: number;
};

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

const setVersionSuccess = (version: number): SetVersionSuccess => ({
  type: VersionActionTypes.SET_VERSION_SUCCESS,
  version,
});

const setProjectStructureQuery = (projectStructureQuery: ProjectStructureQuery) => ({
  type: ProjectStructureActionTypes.SET_PROJECT_STRUCTURE_QUERY,
  projectStructureQuery,
});

function buildStructureQuery(entityImages: EntityImage[]): ProjectStructureQuery {
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

const fetchVersion = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  dispatch(clearStores());

  logicConstructorService
    .projectStructureQuery()
    ?.then((response) => {
      if (response?.data) {
        logicConstructorService.setProjectVersion(response.data.project?.version);

        const structureQuery = buildStructureQuery(
          response.data?.project.domainSchema.entityImages,
        );

        dispatch(setVersionSuccess(response.data?.project.version));
        dispatch(setProjectStructureQuery(structureQuery));
      } else {
        dispatch(setNotification({ message: 'Пустой ответ сервера', status: 'alert' }));
      }
    })
    .catch((e) => {
      const { errors } = e.networkError.result;
      if (
        Array.isArray(errors) &&
        errors.find((error) => error.message === 'badly formed hexadecimal UUID string')
      ) {
        const message = 'В url не корректный UUID проекта';
        dispatch(setNotification({ message, status: 'alert' }));
      }
    });
};

export { fetchVersion };
