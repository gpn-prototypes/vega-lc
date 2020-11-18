import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CanvasData } from '@gpn-prototypes/vega-ui';
import { v4 as uuidv4 } from 'uuid';

import {
  getActivitiesDraggingElements,
  getActivitiesRef,
} from '../../redux-store/activities/selectors';
import { addCanvasElement } from '../../redux-store/logic-constructor/actions';
import { getIsStepEditorOpened } from '../../redux-store/logic-constructor/selectors';
import { ActivitiesWidget } from '../activities';
import { CanvasWidget } from '../canvas';
import StepEditor from '../step-editor';

import { cnLogicConstructor } from './cn-lc';

import './index.css';

export const LogicConstructorWidget: React.FC = () => {
  const dispatch = useDispatch();
  const activitiesRef = useSelector(getActivitiesRef);
  const activitiesDraggingElements = useSelector(getActivitiesDraggingElements);
  const isStepEditorOpened = useSelector(getIsStepEditorOpened);

  const parentRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent): void => {
    if (activitiesDraggingElements?.length) {
      const isAccessibleForDrop =
        e.target instanceof HTMLElement && !activitiesRef?.current?.contains(e.target);

      if (isAccessibleForDrop && parentRef.current instanceof HTMLElement) {
        const boundingClientRect = parentRef.current.getBoundingClientRect();
        const { top, left } = boundingClientRect;

        const targetRef = activitiesDraggingElements[0].ref?.current;

        const canvasData: CanvasData = {
          position: { x: e.clientX - left, y: e.clientY - top * 6 },
          type: 'step',
          title: 'Шаг',
          width: 250,
          stepData: {
            id: uuidv4(),
            name: 'Шаг',
            events: [
              {
                id: targetRef?.id || '1',
                name: targetRef?.innerText || 'Мероприятие',
                content: [],
              },
            ],
          },
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
      <CanvasWidget />

      {isStepEditorOpened && <StepEditor />}
    </div>
  );
};
