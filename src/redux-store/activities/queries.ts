import { gql } from '@apollo/client';

export const ACTIVITY_LIST = gql`
  query ACTIVITY_LIST {
    activityList {
      __typename
      ... on Activity {
        vid
        code
        createdAt
        editedAt
        name
        title
        description
        category {
          vid
          code
          name
          parent {
            vid
            code
            name
          }
        }
      }
    }
  }
`;
