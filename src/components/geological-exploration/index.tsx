import React from 'react';
import styled from '@emotion/styled';

import { ActivitiesWidget } from '../activities';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
`;

export const GeologicalExploration = (): React.ReactElement => {
  return (
    <Container>
      <ActivitiesWidget />
    </Container>
  );
};
