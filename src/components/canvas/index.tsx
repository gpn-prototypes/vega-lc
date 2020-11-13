import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Canvas, CanvasUpdate, Change, useInterval } from '@gpn-prototypes/vega-ui';

import {
  addGroupObjectsToCanvasElement,
  setCanvasElements,
  syncCanvasState,
  toggleStepEditor,
} from '../../redux-store/logic-constructor/actions';
import { getCanvasElements } from '../../redux-store/logic-constructor/selectors';
import { canvasActionsForImmediateSync } from '../../utils/constants/canvas-actions-to-sync';
import { getCanvasTreeById } from '../../utils/get-canvas-tree-by-id';

import { cnCanvasWidget } from './cn-canvas';

import './index.css';

export const CanvasWidget: React.FC = () => {
  const [changes, setChanges] = useState<CanvasUpdate[]>([]);

  const dispatch = useDispatch();

  const canvasElements = useSelector(getCanvasElements);

  useInterval(1600, () => {
    if (changes.length) {
      dispatch(syncCanvasState(changes[changes.length - 1]));

      setChanges([]);
    }
  });

  const updateTree = (change: Change): void => {
    const { state, update } = change;
    const { type } = update;

    dispatch(setCanvasElements(state));

    if (
      update.type === 'select' &&
      update.selected?.type === 'item' &&
      update.selected?.ids.length === 1 &&
      canvasElements
    ) {
      const id = update.selected.ids[0];

      const tree = getCanvasTreeById(canvasElements, id);

      const isStepEditorOpened = tree?.getData().type === 'step';

      dispatch(toggleStepEditor(isStepEditorOpened));

      return;
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
      dispatch(addGroupObjectsToCanvasElement(update.intersectionId));

      return;
    }

    setChanges([...changes, update]);
  };

  return (
    <div className={cnCanvasWidget()}>
      <Canvas state={canvasElements} onChange={updateTree} />
    </div>
  );
};
