import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  GridState,
  GridUpdate,
  Layout,
  LayoutWidget,
  LayoutWidgetsOverrides,
} from '@gpn-prototypes/vega-ui';

import { LogicConstructorWidget } from '../logic-constructor';
import { ObjectsGroupWidget } from '../objects-group';
import { ProjectStructureWidget } from '../project-structure';

import { cnGeologicalExploration } from './cn-geoexploration';

import './index.css';

import { fetchActivitiesList } from '@/redux-store/activities/actions';
import { fetchGroupObjectList } from '@/redux-store/group-objects/actions';
import { fetchCanvasItemsData } from '@/redux-store/logic-constructor/actions';
import { fetchProjectStructureList } from '@/redux-store/project-structure/actions';

export const GeologicalExploration = (): React.ReactElement => {
  function action(change: { update: GridUpdate; state: GridState }): void {
    console.log(change);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchActivitiesList());
    dispatch(fetchGroupObjectList());
    dispatch(fetchProjectStructureList());
    dispatch(fetchCanvasItemsData());
  }, [dispatch]);

  const widgets: LayoutWidget[] = [
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
    'vega-group-objects': () => <ObjectsGroupWidget />,
    'vega-project-structure': () => <ProjectStructureWidget />,
    'vega-canvas': () => <LogicConstructorWidget />,
  };

  const state: GridState = {
    0: {
      type: 'branch',
      data: {
        splitDirection: 'right',
        breakpoint: 14,
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
      type: 'leaf',
      data: {
        widget: 'vega-canvas',
        context: {},
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
  };

  return (
    <div className={cnGeologicalExploration()}>
      <Layout
        state={state}
        widgets={widgets}
        widgetsOverrides={widgetsOverrides}
        onChange={action}
      />
    </div>
  );
};
