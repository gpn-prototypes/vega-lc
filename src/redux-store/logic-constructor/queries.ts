import { gql } from '@apollo/client';

export const FETCH_SCENARIO_LIST = gql`
  query {
    logic {
      ... on Logic {
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
              ... on LicensingRound_A_Type {
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

export const FETCH_CANVAS_ITEMS_DATA = gql`
  query {
    logic {
      ... on Logic {
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
      ... on Error {
        code
        message
      }
    }
  }
`;
