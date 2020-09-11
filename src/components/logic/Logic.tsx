/* eslint-disable max-classes-per-file */
import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { GridState, GridUpdate, Layout } from '@gpn-prototypes/vega-layout';

import { ActivitiesWidget } from './ActivitiesWidget';
import { CanvasWidget } from './CanvasWidget';
import { ObjectsGroupingWidget } from './ObjectsGroupingWidget';
import { ProjectStructureWidget } from './ProjectStructureWidget';

const widgets = [
  { name: 'Конструктор логики', component: CanvasWidget },
  { name: 'Структура проекта', component: ProjectStructureWidget },
  { name: 'Мероприятия', component: ActivitiesWidget },
  { name: 'Группа объектов', component: ObjectsGroupingWidget },
];

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 55px);
  display: flex;
  box-sizing: border-box;
`;

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
      breakpoint: 75,
    },
  },
  3: {
    type: 'leaf',
    data: {
      widget: 'Структура проекта',
      context: {},
    },
  },
  4: {
    type: 'leaf',
    data: {
      widget: 'Группа объектов',
      context: {},
    },
  },
  5: {
    type: 'leaf',
    data: {
      widget: 'Конструктор логики',
      context: {},
    },
  },
  6: {
    type: 'leaf',
    data: {
      widget: 'Мероприятия',
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
