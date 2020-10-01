import React from 'react';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';

import { cnObjectGroup } from './cn-objects-group';
import { CircleSvg, SquareSvg } from './icons';

import './index.css';

const icons = {
  square: SquareSvg,
  circle: CircleSvg,
};

type ObjectsGroupProps = {
  objectsGroup: TreeItem[];
};

export const ObjectsGroupWidget: React.FC<ObjectsGroupProps> = ({
  objectsGroup,
}): React.ReactElement => {
  return (
    <div className={cnObjectGroup()}>
      <Tree icons={icons} nodeList={objectsGroup} showIndentGuides={false} />
    </div>
  );
};
