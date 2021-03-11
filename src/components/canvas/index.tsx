import React, { useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Canvas, CanvasUpdate, Change, useTimeout } from '@gpn-prototypes/vega-ui';
import { CanvasView as CanvasViewEntity } from '@gpn-prototypes/vega-ui/dist/components/canvas/entities/CanvasView';

import './index.css';

import { cnCanvasWidget } from '@/components/canvas/cn-canvas';
import { ProjectContext } from '@/react-context/providers';
import {
  mapDropEventToRelatedAction,
  setCanvasElements,
  setCanvasViewRef,
  syncCanvasState,
  toggleStepEditor,
} from '@/redux-store/logic-constructor/actions';
import { getCanvasElements } from '@/redux-store/logic-constructor/selectors';
import { canvasActionsForImmediateSync } from '@/utils/constants/canvas-actions-to-sync';

export const CanvasWidget: React.FC = () => {
  const [changes, setChanges] = useState<CanvasUpdate[]>([]);

  const { projectId } = useContext(ProjectContext);

  const canvasViewRef = useRef<CanvasViewEntity | null>(null);

  const canvasElements = useSelector(getCanvasElements);

  const dispatch = useDispatch();

  const canvasViewRefSetter = (view: CanvasViewEntity): void => {
    if (canvasViewRef.current) return;

    canvasViewRef.current = view;

    dispatch(setCanvasViewRef(canvasViewRef));
  };

  useTimeout(2000, () => {
    if (changes.length) {
      dispatch(syncCanvasState(changes[changes.length - 1]));

      setChanges([]);
    }
  });

  const updateTree = (change: Change): void => {
    const { state, update } = change;
    const { type } = update;

    dispatch(setCanvasElements(state));

    if (update.type === 'select') {
      if (update.selected?.type === 'event') {
        dispatch(toggleStepEditor(true));

        return;
      }

      if (update.selected?.type === 'item') {
        dispatch(toggleStepEditor(false));

        return;
      }
    }

    if (type === 'unselect') {
      dispatch(toggleStepEditor(false));

      return;
    }

    if (canvasActionsForImmediateSync[type]) {
      dispatch(syncCanvasState(update));

      return;
    }

    if (update.type === 'drop-event') {
      const { intersectionId, position } = update;

      dispatch(mapDropEventToRelatedAction({ intersectionId, position }));

      return;
    }

    setChanges([...changes, update]);
  };

  return (
    <div className={cnCanvasWidget()}>
      <Canvas
        canvasViewAccessor={canvasViewRefSetter}
        state={canvasElements}
        onChange={updateTree}
        savedScreenId={projectId}
      />
    </div>
  );
};
