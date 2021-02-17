import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { setGridSize } from '@/redux-store/split-panes-grid/actions';
import { getSplitPanesGridSize } from '@/redux-store/split-panes-grid/selectors';

export const GeologicalExploration = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { projectId, initialized } = useContext(ProjectContext);

  const splitPanesGridSize = useSelector(getSplitPanesGridSize);

  const leftAngularPane = React.useRef(null);

  const { width: angularPaneWidth, height: angularPaneHeight } = useResizeObserver(leftAngularPane);

  const handleResize = (): void => {
    if (angularPaneWidth && angularPaneHeight)
      dispatch(
        setGridSize({
          height: String(angularPaneHeight),
          width: String(angularPaneWidth),
        }),
      );
  };

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
      <SplitPanes onResize={handleResize} split="vertical">
        <SplitPanes.Pane
          aria-label="trees"
          initialSize={splitPanesGridSize.width ? `${splitPanesGridSize.width}px` : '260px'}
          min="24px"
          max="260px"
        >
          <SplitPanes onResize={handleResize} split="horizontal">
            <SplitPanes.Pane
              initialSize={splitPanesGridSize.height && `${splitPanesGridSize.height}px`}
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
        <SplitPanes.Pane aria-label="logic-constructor">
          <LogicConstructorWidget />
        </SplitPanes.Pane>
      </SplitPanes>
    </div>
  );
};
