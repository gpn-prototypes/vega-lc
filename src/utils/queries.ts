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
`;

export const OBJECT_GROUP_UPDATE_MUTATION = gql`
  mutation($vid: UUID!, $vids: [UUID], $version: Int!) {
    domain {
      objectGroup {
        update(vid: $vid, vids: $vids, version: $version) {
          ok
          name
          vids
        }
      }
    }
  }
`;

export const OBJECT_GROUP_CREATE_MUTATION = gql`
  mutation($version: Int!, $name: String!) {
    domain {
      objectGroup {
        create(name: $name, version: $version) {
          vid
          ok
          vids
        }
      }
    }
  }
`;

export const SCENARIO_STEP_CREATE_MUTATION = gql`
  mutation($version: Int!, $activity: UUID, $name: String, $objectGroup: UUID, $objects: [UUID]) {
    logic {
      scenarioStep {
        create(
          activity: $activity
          version: $version
          name: $name
          objectGroup: $objectGroup
          objects: $objects
        ) {
          result {
            vid
          }
        }
      }
    }
  }
`;

export const SCENARIO_STEP_UPDATE_MUTATION = gql`
  mutation($vid: UUID!, $version: Int!, $activity: UUID, $objectGroup: UUID, $objects: [UUID]) {
    logic {
      scenarioStep {
        update(
          vid: $vid
          activity: $activity
          version: $version
          objectGroup: $objectGroup
          objects: $objects
        ) {
          result {
            vid
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_CREATE_MUTATION = gql`
  mutation(
    $title: String
    $nodeType: String!
    $width: Float
    $position: [Float]
    $nodeRef: UUID
    $version: Int!
  ) {
    logic {
      canvas {
        create(
          title: $title
          width: $width
          nodeType: $nodeType
          nodeRef: $nodeRef
          position: $position
          version: $version
        ) {
          result {
            vid
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
          version: $version
        ) {
          result {
            vid
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_DELETE_MUTATION = gql`
  mutation($vid: UUID!, $version: Int!) {
    logic {
      canvas {
        delete(vid: $vid, version: $version) {
          ok
        }
      }
    }
  }
`;

export const SCENARIO_STEP_DELETE_MUTATION = gql`
  mutation($vid: UUID!, $version: Int!) {
    logic {
      scenarioStep {
        delete(vid: $vid, version: $version) {
          ok
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
