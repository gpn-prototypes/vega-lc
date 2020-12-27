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

export const GroupObjectListFragment = gql`
  fragment GroupObjectList on ProjectInner {
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

export const CanvasItemsFragment = gql`
  fragment CanvasItems on Logic {
    canvas {
      vid
      title
      position
      nodeRef
      nodeType
      width
      children {
        vid
      }
      parents {
        vid
      }
    }
  }
`;

export const StepListFragment = gql`
  fragment StepList on Logic {
    stepList {
      vid
      name
      itemList {
        activity {
          activityType {
            vid
          }
          name
        }
        object {
          vid
          name
        }
      }
    }
  }
`;

export const GROUP_OBJECT_LIST_QUERY = gql`
  ${GroupObjectListFragment}

  {
    project {
      ...GroupObjectList
    }
  }
`;

export const CANVAS_ITEMS_QUERY = gql`
  ${CanvasItemsFragment}
  ${StepListFragment}

  {
    project {
      logic {
        ...CanvasItems
        ...StepList
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

export const OBJECT_GROUP_UPDATE_MUTATION = gql`
  ${GroupObjectListFragment}

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
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            vid
            version
            ...GroupObjectListFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...GroupObjectListFragment
          }
        }
      }
    }
  }
`;

export const OBJECT_GROUP_CREATE_MUTATION = gql`
  ${GroupObjectListFragment}

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
      ... on UpdateProjectInnerDiff {
        remoteProject {
          ... on ProjectInner {
            vid
            version
            ...GroupObjectListFragment
          }
        }
        localProject {
          ... on ProjectInner {
            vid
            version
            ...GroupObjectListFragment
          }
        }
      }
    }
  }
`;

export const SCENARIO_STEP_CREATE_MUTATION = gql`
  ${StepListFragment}

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
      ... on UpdateProjectInnerDiff {
        remoteProject {
          logic {
            ...StepList
          }
        }
        localProject {
          logic {
            ...StepList
          }
        }
      }
    }
  }
`;

export const SCENARIO_STEP_UPDATE_MUTATION = gql`
  ${StepListFragment}

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
      ... on UpdateProjectInnerDiff {
        remoteProject {
          vid
          version
          logic {
            ...StepList
          }
        }
        localProject {
          vid
          version
          logic {
            ...StepList
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_CREATE_MUTATION = gql`
  ${CanvasItemsFragment}

  mutation(
    $title: String
    $nodeType: String!
    $width: Float
    $position: [Float]
    $nodeRef: UUID
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
      ... on UpdateProjectInnerDiff {
        remoteProject {
          vid
          version
          logic {
            ...CanvasItems
          }
        }
        localProject {
          vid
          version
          logic {
            ...CanvasItems
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_UPDATE_MUTATION = gql`
  ${CanvasItemsFragment}

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
              version: $version
            ) {
              result {
                vid
              }
            }
          }
        }
      }
      ... on UpdateProjectInnerDiff {
        remoteProject {
          vid
          version
          logic {
            ...CanvasItems
          }
        }
        localProject {
          vid
          version
          logic {
            ...CanvasItems
          }
        }
      }
    }
  }
`;

export const CANVAS_NODE_DELETE_MUTATION = gql`
  ${CanvasItemsFragment}

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
      ... on UpdateProjectInnerDiff {
        remoteProject {
          vid
          version
          logic {
            ...CanvasItems
          }
        }
        localProject {
          vid
          version
          logic {
            ...CanvasItems
          }
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
