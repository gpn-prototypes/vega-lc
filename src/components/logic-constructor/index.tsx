import React from 'react';
import { useSelector } from 'react-redux';

import { ActivitiesWidget } from '../activities';
import { CanvasWidget } from '../canvas';
import StepEditor from '../step-editor';

import { cnLogicConstructor } from './cn-lc';

import './index.css';

import { InProgress } from '@/components/in-progress';

import { getIsStepEditorOpened } from '@/redux-store/logic-constructor/selectors';

export const LogicConstructorWidget: React.FC = () => {
  const isStepEditorOpened = useSelector(getIsStepEditorOpened);

  return (
    <div className={cnLogicConstructor()}>
      <ActivitiesWidget />
      <CanvasWidget />

      {isStepEditorOpened && <StepEditor />}
      <InProgress />
    </div>
  );
};
