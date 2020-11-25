import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { StoreLC } from '../../types/redux-store';
import { graphQlRequest } from '../../utils/graphql-request';
import { getProjectId } from '../../utils/project-id';
import { setCurrentVersion } from '../../utils/version';

import { VersionActionTypes } from './action-types';

type SetVersionSuccess = { type: typeof VersionActionTypes.SET_VERSION_SUCCESS; version: number };

const SetVersionSuccess = (version: number): SetVersionSuccess => ({
  type: VersionActionTypes.SET_VERSION_SUCCESS,
  version,
});

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

      dispatch(SetVersionSuccess(response.data?.project.version));
    } else {
      console.log(response);
    }
  } catch (e) {
    console.error(e);
  }
};

export { fetchVersion };
