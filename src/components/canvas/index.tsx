import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Canvas, CanvasUpdate, Change, useInterval } from '@gpn-prototypes/vega-ui';

import {
  setDebouncedCanvasElements,
  syncCanvasState,
} from '../../redux-store/logic-constructor/actions';
import { getCanvasElements } from '../../redux-store/logic-constructor/selectors';

import './index.css';

type CanvasWidgetProps = {
  parentRef: React.RefObject<HTMLElement>;
};

export const CanvasWidget: React.FC<CanvasWidgetProps> = (props) => {
  const { parentRef } = props;
  const [changes, setChanges] = useState<CanvasUpdate[]>([]);

  const canvasElements = useSelector(getCanvasElements);

  const dispatch = useDispatch();

  useInterval(2000, () => {
    if (changes.length) {
      if (canvasElements) {
        dispatch(syncCanvasState(canvasElements, changes[changes.length - 1]));

        setChanges([]);
      }
    }
  });

  const updateTree = (change: Change): void => {
    dispatch(setDebouncedCanvasElements(change.state));
    setChanges([...changes, change.update]);
  };

  return <Canvas parentRef={parentRef} state={canvasElements} onChange={updateTree} />;
};
