import React from 'react';
import styled from '@emotion/styled';
import { GridState, GridUpdate, Layout, LayoutWidget } from '@gpn-prototypes/vega-layout';
import { LayoutWidgetsOverrides } from '@gpn-prototypes/vega-layout/dist/src/LayoutDataView';

import { ActivitiesWidget } from '../activities';
import { CanvasWidget } from '../canvas';
import { ObjectsGroupWidget } from '../objects-group';
import { ProjectStructureWidget } from '../project-structure';

const widgets: LayoutWidget[] = [
  { name: 'Мероприятия', component: 'vega-activities' },
  {
    name: 'Группа объектов',
    component: 'vega-group-objects',
  },
  {
    name: 'Структура проекта',
    component: 'vega-project-structure',
  },
  {
    name: 'Канвас',
    component: 'vega-canvas',
  },
];

const widgetsOverrides: LayoutWidgetsOverrides = {
  'vega-activities': () => <ActivitiesWidget />,
  'vega-group-objects': () => <ObjectsGroupWidget />,
  'vega-project-structure': () => <ProjectStructureWidget />,
  'vega-canvas': () => <CanvasWidget />,
};

const state: GridState = {
  0: {
    type: 'branch',
    data: {
      splitDirection: 'right',
      breakpoint: 15,
    },
  },
  1: {
    type: 'branch',
    data: {
      splitDirection: 'down',
      breakpoint: 51,
    },
  },
  2: {
    type: 'branch',
    data: {
      splitDirection: 'right',
      breakpoint: 60,
    },
  },
  3: {
    type: 'leaf',
    data: {
      widget: 'vega-project-structure',
      context: {},
    },
  },
  4: {
    type: 'leaf',
    data: {
      widget: 'vega-group-objects',
      context: {},
    },
  },
  5: {
    type: 'leaf',
    data: {
      widget: 'vega-canvas',
      context: {},
    },
  },
  6: {
    type: 'leaf',
    data: {
      widget: 'vega-activities',
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
