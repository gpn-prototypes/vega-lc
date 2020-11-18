import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import client, { mainLink } from '../../client';
import { Project, Query } from '../../generated/graphql';
import { StoreLC } from '../../types/redux-store';
import { getProjectId } from '../../utils/project-id';
import { setCurrentVersion } from '../../utils/version';

import { VersionActionTypes } from './action-types';
import { FETCH_PROJECT_VERSION } from './queries';

type SetVersionSuccess = { type: typeof VersionActionTypes.SET_VERSION_SUCCESS; version: number };

const SetVersionSuccess = (version: number): SetVersionSuccess => ({
  type: VersionActionTypes.SET_VERSION_SUCCESS,
  version,
});

const fetchVersion = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client.setLink(mainLink);
  client
    .query<Query>({
      query: FETCH_PROJECT_VERSION,
      variables: {
        vid: getProjectId(),
      },
    })
    .then((response) => {
      if (response.data?.project?.__typename !== 'Error') {
        const project = response.data?.project as Project;

        if (project.version) {
          setCurrentVersion(project.version);
          dispatch(SetVersionSuccess(project.version));
        }
      } else {
        console.error(response.data?.project);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export { fetchVersion };
