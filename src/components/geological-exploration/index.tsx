import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IconProcessing, SplitPanes } from '@gpn-prototypes/vega-ui';

import { LogicConstructorWidget } from '../logic-constructor';
import { ObjectsGroupWidget } from '../objects-group';
import { ProjectStructureWidget } from '../project-structure';

import { cnGeologicalExploration } from './cn-geoexploration';

import './index.css';

import { ProjectContext } from '@/react-context/providers';
import { fetchActivitiesList } from '@/redux-store/activities/actions';
import { fetchGroupObjectList } from '@/redux-store/group-objects/actions';
import { fetchCanvasItemsData } from '@/redux-store/logic-constructor/actions';
import { setNotification } from '@/redux-store/notifications/actions';
import { fetchProjectStructureList } from '@/redux-store/project-structure/actions';

export const GeologicalExploration = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { projectId, initialized } = useContext(ProjectContext);

  useEffect(() => {
    if (projectId) {
      dispatch(
        setNotification({
          message: 'Раздел находится в разработке',
          status: 'warning',
          icon: IconProcessing,
        }),
      );
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (initialized) {
      dispatch(fetchActivitiesList());
      dispatch(fetchGroupObjectList());
      dispatch(fetchProjectStructureList());
      dispatch(fetchCanvasItemsData());
    }
  }, [dispatch, initialized]);

  return (
    <div className={cnGeologicalExploration()}>
      <SplitPanes split="vertical">
        <SplitPanes.Pane aria-label="trees" initialSize="260px" min="24px" max="260px">
          <SplitPanes split="horizontal">
            <SplitPanes.Pane aria-label="project-structure" min="50px">
              <ProjectStructureWidget />
            </SplitPanes.Pane>
            <SplitPanes.Pane aria-label="objects-groups" min="140px">
              <ObjectsGroupWidget />
            </SplitPanes.Pane>
          </SplitPanes>
        </SplitPanes.Pane>
        <SplitPanes.Pane aria-label="logic-constructor">
          <LogicConstructorWidget />
        </SplitPanes.Pane>
      </SplitPanes>
    </div>
  );
};
