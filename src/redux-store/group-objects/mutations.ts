import { gql } from '@apollo/client';

export const UPDATE_GROUP_OBJECT = gql`
  mutation($vid: UUID!, $vids: [UUID]) {
    domain {
      objectGroup {
        update(vid: $vid, vids: $vids) {
          __typename
          ... on DomainObjectsGroup {
            vid
          }
          ... on Error {
            code
            message
          }
        }
      }
    }
  }
`;

export const CREATE_NEW_GROUP = gql`
  mutation createGroupProject($name: String!) {
    domain {
      objectGroup {
        create(name: $name) {
          __typename
          ... on DomainObjectsGroup {
            vid
          }
          ... on Error {
            code
            message
          }
        }
      }
    }
  }
`;
