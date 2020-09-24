import React from 'react';
import styled from '@emotion/styled';
import { GridState, GridUpdate, Layout, LayoutWidget } from '@gpn-prototypes/vega-layout';
import { LayoutWidgetsOverrides } from '@gpn-prototypes/vega-layout/dist/src/LayoutDataView';

import { ActivitiesWidget } from '../activities';
import { ObjectsGroupWidget } from '../objects-group';

const widgets: LayoutWidget[] = [
  { name: 'Мероприятия', component: 'vega-activities' },
  {
    name: 'Группа объектов',
    component: 'vega-group-objects',
  },
];
const widgetsOverrides: LayoutWidgetsOverrides = {
  'vega-activities': () => <ActivitiesWidget />,
  'vega-group-objects': () => <ObjectsGroupWidget />,
};

const state: GridState = {
  0: {
    type: 'branch',
    data: {
      splitDirection: 'right',
      breakpoint: 50,
    },
  },
  1: {
    type: 'leaf',
    data: {
      widget: 'vega-activities',
      context: {},
    },
  },
  2: {
    type: 'leaf',
    data: {
      widget: 'vega-group-objects',
      context: {},
    },
  },
};

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
`;

export const GeologicalExploration = (): React.ReactElement => {
  function action(change: { update: GridUpdate; state: GridState }) {
    console.log(change);
  }

  return (
    <Container>
      <Layout
        state={state}
        widgets={widgets}
        widgetsOverrides={widgetsOverrides}
        onChange={action}
      />
    </Container>
  );
};
