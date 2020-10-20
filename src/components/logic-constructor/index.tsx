import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CanvasData } from '@gpn-prototypes/vega-ui';

import {
  getActivitiesDraggingElements,
  getActivitiesRef,
} from '../../redux-store/activities/selectors';
import { addCanvasElement } from '../../redux-store/logic-constructor/actions';
import { ActivitiesWidget } from '../activities';
import { CanvasWidget } from '../canvas';

import { cnLogicConstructor } from './cn-lc';

import './index.css';

export const LogicConstructorWidget: React.FC = () => {
  const dispatch = useDispatch();
  const activitiesRef = useSelector(getActivitiesRef);
  const activitiesDraggingElements = useSelector(getActivitiesDraggingElements);

  const parentRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent): void => {
    const isCreatingStep = activitiesDraggingElements?.length;

    if (isCreatingStep) {
      const isAccessibleForDrop =
        e.target instanceof HTMLElement && !activitiesRef?.current?.contains(e.target);

      if (isAccessibleForDrop && parentRef.current instanceof HTMLElement) {
        const boundingClientRect = parentRef.current.getBoundingClientRect();
        const { left, top } = boundingClientRect;

        const canvasData: CanvasData = {
          position: { x: e.clientX - left, y: e.clientY - top },
          type: 'step',
          title: 'Шаг',
          width: 250,
        };

        dispatch(addCanvasElement(canvasData));
      }
    }
  };

  return (
    <div
      onDragOver={(e): void => e.preventDefault()}
      onDrop={handleDrop}
      ref={parentRef}
      className={cnLogicConstructor()}
    >
      <ActivitiesWidget />
      <CanvasWidget parentRef={parentRef} />
    </div>
  );
};
