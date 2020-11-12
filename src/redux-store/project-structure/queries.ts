import { gql } from '@apollo/client';

export const FETCH_PROJECT_STRUCTURE_LIST = gql`
  query {
    domain {
      geoEconomicAppraisalProjectList {
        vid
        name
        licensingRounds {
          __typename
          ... on LicensingRound_A_Type {
            __typename
            name
            vid
          }
        }
      }
    }
  }
`;
