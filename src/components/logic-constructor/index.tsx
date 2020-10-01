import React, { useRef } from 'react';
import { TreeItem } from '@gpn-prototypes/vega-ui';

import { ActivitiesWidget } from '../activities';
import { CanvasWidget } from '../canvas';

import { cnLogicConstructor } from './cn-lc';

import './index.css';

type LogicConstructorProps = {
  activities: TreeItem[];
  searchString: string;
};

export const LogicConstructorWidget: React.FC<LogicConstructorProps> = (props) => {
  const { activities, searchString } = props;
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={parentRef} className={cnLogicConstructor()}>
      <ActivitiesWidget searchString={searchString} activities={activities} />
      <CanvasWidget parentRef={parentRef} />
    </div>
  );
};
