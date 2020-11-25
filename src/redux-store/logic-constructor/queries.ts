import { gql } from '@apollo/client';

export const FETCH_CANVAS_ITEMS_DATA = gql`
  {
    logic {
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
  }
`;
