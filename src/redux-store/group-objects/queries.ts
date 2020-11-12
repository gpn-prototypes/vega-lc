import { gql } from '@apollo/client';

export const OBJECT_GROUP_LIST = gql`
  query {
    domain {
      objectGroupList {
        vid
        name
        objects {
          vid
          name
          ... on LicensingRound_A_Type {
            name
            vid
          }
        }
      }
    }
  }
`;
