import { gql } from '@apollo/client';

export const ADD_CANVAS_ELEMENT = gql`
  mutation addCanvasElement(
    $title: String!
    $width: Float
    $nodeType: String!
    $id: UUID!
    $x: Float
    $y: Float
    $version: Int!
  ) {
    logic {
      canvas {
        create(
          title: $title
          width: $width
          nodeType: $nodeType
          vid: $id
          position: [$x, $y]
          version: $version
        ) {
          __typename
          ... on CanvasNode {
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

export const SYNC_CANVAS_STATE = gql`
  mutation syncCanvasState(
    $vid: UUID!
    $position: [Float!]
    $childrenVids: [UUID!]
    $version: Int!
  ) {
    logic {
      canvas {
        update(vid: $vid, position: $position, childrenVids: $childrenVids, version: $version) {
          __typename
          ... on CanvasNode {
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

export const CREATE_STEP = gql`
  mutation($version: Int!, $activity: UUID!, $name: String, $objectGroup: UUID) {
    logic {
      scenarioStep {
        create(activity: $activity, version: $version, name: $name, objectGroup: $objectGroup) {
          result {
            vid
          }
        }
      }
    }
  }
`;
