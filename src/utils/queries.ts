import { gql } from '@apollo/client';

export const ACTIVITY_LIST_QUERY = gql`
  {
    activityList {
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
`;

export const GROUP_OBJECT_LIST_QUERY = gql`
  {
    project {
      domain {
        objectGroupList {
          vid
          name
          objects {
            vid
            name
          }
        }
      }
    }
  }
`;

export const OBJECT_GROUP_UPDATE_MUTATION = gql`
  mutation($vid: UUID!, $vids: [UUID], $version: Int!) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        domain {
          objectGroup {
            update(vid: $vid, vids: $vids) {
              ok
              name
              vids
            }
          }
        }
      }
    }
  }
`;

export const OBJECT_GROUP_CREATE_MUTATION = gql`
  mutation($version: Int!, $name: String!) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        domain {
          objectGroup {
            create(name: $name) {
              vid
              ok
              vids
            }
          }
        }
      }
    }
  }
`;

export const SCENARIO_STEP_CREATE_MUTATION = gql`
  mutation($version: Int!, $activity: UUID, $name: String, $objectGroup: UUID, $objects: [UUID]) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        logic {
          scenarioStep {
            create(activity: $activity, name: $name, objectGroup: $objectGroup, objects: $objects) {
              result {
                vid
              }
            }
          }
        }
      }
    }
  }
`;

export const SCENARIO_STEP_UPDATE_MUTATION = gql`
  mutation($vid: UUID!, $version: Int!, $activity: UUID, $objectGroup: UUID, $objects: [UUID]) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        logic {
          scenarioStep {
            update(vid: $vid, activity: $activity, objectGroup: $objectGroup, objects: $objects) {
              result {
                vid
              }
            }
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_CREATE_MUTATION = gql`
  mutation(
    $nodeType: String!
    $nodeRef: UUID
    $version: Int!
    $title: String
    $width: Float
    $x: Float
    $y: Float
  ) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        logic {
          canvas {
            create(
              title: $title
              width: $width
              nodeType: $nodeType
              nodeRef: $nodeRef
              position: [$x, $y]
            ) {
              result {
                vid
              }
            }
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_UPDATE_MUTATION = gql`
  mutation(
    $vid: UUID!
    $title: String
    $nodeType: String
    $width: Float
    $position: [Float]
    $nodeRef: UUID
    $childrenVids: [UUID]
    $parentVids: [UUID]
    $version: Int!
  ) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        logic {
          canvas {
            update(
              vid: $vid
              title: $title
              width: $width
              nodeType: $nodeType
              nodeRef: $nodeRef
              position: $position
              childrenVids: $childrenVids
              parentVids: $parentVids
            ) {
              result {
                vid
              }
            }
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_DELETE_MUTATION = gql`
  mutation($vid: UUID!, $version: Int!) {
    project(version: $version) {
      __typename
      ... on Error {
        code
        message
      }
      ... on ProjectMutation {
        logic {
          canvas {
            delete(vid: $vid) {
              ok
            }
          }
        }
      }
    }
  }
`;

export const PROJECT_QUERY = gql`
  query($projectId: UUID!) {
    project(vid: $projectId) {
      __typename
      ... on Project {
        version
        rootEntity
        domainSchema {
          entityImages {
            vid
            name
            entity {
              vid
              name
            }
            attributes {
              title
              name
              attrType
              unit
              description
              entity {
                vid
                name
              }
            }
          }
        }
      }
      ... on Error {
        code
        message
      }
    }
  }
`;
