/* eslint-disable max-classes-per-file */
import React from 'react';
import styled from '@emotion/styled';
import { GridState, GridUpdate, Layout } from '@gpn-prototypes/vega-layout';

import { ActivitiesWidget } from './ActivitiesWidget';
import { CanvasWidget } from './CanvasWidget';
import { ProjectStructureWidget } from './ProjectStructureWidget';

const widgets = [
  { name: 'vega-widget-canvas', component: CanvasWidget },
  { name: 'vega-widget-project-structure', component: ProjectStructureWidget },
  { name: 'vega-widget-activities', component: ActivitiesWidget },
];

const Container = styled.div`
  width: 100%;
  height: 900px;
  max-height: 900px;
  display: flex;
  box-sizing: border-box;
`;

const state: GridState = {
  0: {
    type: 'branch',
    data: {
      splitDirection: 'right',
      breakpoint: 20,
    },
  },
  1: {
    type: 'leaf',
    data: {
      widget: 'vega-widget-project-structure',
      context: {},
    },
  },
  2: {
    type: 'leaf',
    data: {
      widget: 'vega-widget-canvas',
      context: {},
    },
  },
  3: {
    type: 'leaf',
    data: {
      widget: 'vega-widget-activities',
      context: {},
    },
  },
};

export const Logic = (): React.ReactElement => {
  function action(change: { update: GridUpdate; state: GridState }) {
    console.log(change);
  }

  return (
    <Container>
      <Layout state={state} widgets={widgets} onChange={action} />
    </Container>
  );
};
