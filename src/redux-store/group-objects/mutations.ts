import { gql } from '@apollo/client';

export const UPDATE_GROUP_OBJECT = gql`
  mutation updateGroupProject($vid: UUID!, $objects: [UUID], $version: Int!) {
    domain {
      objectGroup {
        update(vid: $vid, objects: $objects, version: $version) {
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
  mutation createGroupProject($name: String!, $version: Int!) {
    domain {
      objectGroup {
        create(name: $name, version: $version) {
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
