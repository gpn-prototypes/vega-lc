import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IconProcessing, SplitPanes, useResizeObserver } from '@gpn-prototypes/vega-ui';

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
import { resizeSaverService } from '@/utils/resize-saver-service';

export const GeologicalExploration = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { projectId, initialized } = useContext(ProjectContext);

  const leftAngularPane = React.useRef(null);

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

  resizeSaverService.setId(projectId);

  const { width: angularPaneWidth, height: angularPaneHeight } = useResizeObserver(leftAngularPane);

  const { width: initialWidth, height: initialHeight } = resizeSaverService.getGridSize();

  const handleResize = (): void => {
    if (angularPaneWidth && angularPaneHeight)
      resizeSaverService.setGridSize({ width: angularPaneWidth, height: angularPaneHeight });
  };

  return (
    <div className={cnGeologicalExploration()}>
      <SplitPanes onResize={handleResize} split="vertical">
        <SplitPanes.Pane aria-label="trees" initialSize={initialWidth} min="190px" max="260px">
          <SplitPanes onResize={handleResize} split="horizontal">
            <SplitPanes.Pane
              initialSize={initialHeight}
              ref={leftAngularPane}
              aria-label="project-structure"
              min="50px"
            >
              <ProjectStructureWidget />
            </SplitPanes.Pane>
            <SplitPanes.Pane aria-label="objects-groups" min="140px">
              <ObjectsGroupWidget />
            </SplitPanes.Pane>
          </SplitPanes>
        </SplitPanes.Pane>
        <SplitPanes.Pane aria-label="logic-constructor" style={{ overflow: 'auto' }}>
          <LogicConstructorWidget />
        </SplitPanes.Pane>
      </SplitPanes>
    </div>
  );
};
