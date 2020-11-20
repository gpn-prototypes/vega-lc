import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Project, Query } from '../../generated/graphql';
import { StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';
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
  graphQlRequest({
    body: {
      query: FETCH_PROJECT_VERSION,
      variables: {
        vid: getProjectId(),
      },
    },
  })
    .then((response) => {
      const project = (response as Query).project as Project;
      if (project && project.version) {
        setCurrentVersion(project.version);

        dispatch(SetVersionSuccess(project.version));
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export { fetchVersion };
