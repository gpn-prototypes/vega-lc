import React from 'react';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';

import { BlueLineSvg, OrangeLineSvg, RedLineSvg } from './icons';

const icons = {
  'blue-line': BlueLineSvg,
  'orange-line': OrangeLineSvg,
  'red-line': RedLineSvg,
};

type ProjectStructureProps = {
  projectStructure: TreeItem[];
};

export const ProjectStructureWidget: React.FC<ProjectStructureProps> = ({
  projectStructure,
}): React.ReactElement => {
  return <Tree icons={icons} isContextMenuEnable nodeList={projectStructure} />;
};
