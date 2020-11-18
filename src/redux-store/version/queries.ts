import { gql } from '@apollo/client';

export const FETCH_PROJECT_VERSION = gql`
  query fetchProjectVersion($vid: UUID!) {
    project(vid: $vid) {
      __typename
      ... on Project {
        version
      }
      ... on Error {
        code
        message
      }
    }
  }
`;
