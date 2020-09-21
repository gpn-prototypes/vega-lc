import React from 'react';
import styled from '@emotion/styled';

import { ActivitiesWidget } from '../activities';
import { ObjectsGroupWidget } from '../objects-group';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
`;

export const GeologicalExploration = (): React.ReactElement => {
  return (
    <Container>
      <ActivitiesWidget />
      <ObjectsGroupWidget />
    </Container>
  );
};
