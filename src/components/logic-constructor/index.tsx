import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import { getActivitiesNodeList } from '../../redux-store/activities/selectors';
import { ActivitiesWidget } from '../activities';
import { CanvasWidget } from '../canvas';

import { cnLogicConstructor } from './cn-lc';

import './index.css';

export const LogicConstructorWidget: React.FC = () => {
  const activities = useSelector(getActivitiesNodeList);

  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={parentRef} className={cnLogicConstructor()}>
      <ActivitiesWidget activities={activities || []} />
      <CanvasWidget parentRef={parentRef} />
    </div>
  );
};
