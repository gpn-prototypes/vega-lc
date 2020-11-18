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
  mutation createStep($activityId: UUID!, $name: String, $version: Int!) {
    logic {
      scenarioStep {
        create(activity: $activityId, name: $name, version: $version) {
          __typename
          ... on ScenarioStep {
            vid
            code
            name
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
