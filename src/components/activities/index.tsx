import React from 'react';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';

import { cnActivities } from './cn-activities';
import { BlueLineSvg } from './icons';

import './index.css';

const icons = {
  'blue-line': BlueLineSvg,
};

type ActivitiesProps = {
  activities: TreeItem[];
};

export const ActivitiesWidget: React.FC<ActivitiesProps> = ({ activities }): React.ReactElement => {
  return (
    <div className={cnActivities()}>
      <Tree
        icons={icons}
        withVisibilitySwitcher={false}
        nodeList={activities}
        showIndentGuides={false}
      />
    </div>
  );
};
