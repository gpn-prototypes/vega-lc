import { gql } from '@apollo/client';

export const ADD_CANVAS_ELEMENT = gql`
  mutation addCanvasElement($title: String!, $width: Float, $id: UUID!, $x: Float, $y: Float) {
    logic {
      canvas {
        create(
          title: $title
          width: $width
          nodeType: "domainObject"
          vid: $id
          position: [$x, $y]
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
  mutation syncCanvasState($vid: UUID!, $position: [Float!], $childrenVids: [UUID!]) {
    logic {
      canvas {
        update(vid: $vid, position: $position, childrenVids: $childrenVids) {
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
  mutation createStep($activityId: UUID!, $name: String!) {
    logic {
      scenarioStep {
        create(activity: $activityId, name: $name) {
          result {
            vid
            name
            ok
          }
        }
      }
    }
  }
`;
