import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { StoreLC } from '../../types/redux-store';
import getHeaders from '../../utils/headers';
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
    const response = await fetch(`graphql`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
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
      }),
    });
    const body = await response.json();

    if (response.status === 200) {
      setCurrentVersion(body.data?.project.version);
      dispatch(SetVersionSuccess(body.data?.project.version));
    } else {
      console.log(body.message);
    }
  } catch (e) {
    console.log(e);
  }
};

export { fetchVersion };
