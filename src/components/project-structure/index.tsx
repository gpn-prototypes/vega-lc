import React from 'react';
import { useSelector } from 'react-redux';
import { Tree } from '@gpn-prototypes/vega-tree';

import { getProjectStructureNodeList } from '../../redux-store/project-structure/selectors';

import { BlueLineSvg, OrangeLineSvg, RedLineSvg } from './icons';

const icons = {
  'blue-line': BlueLineSvg,
  'orange-line': OrangeLineSvg,
  'red-line': RedLineSvg,
};

export const ProjectStructureWidget: React.FC = (): React.ReactElement => {
  const projectStructure = useSelector(getProjectStructureNodeList);

  return <Tree icons={icons} isContextMenuEnable nodeList={projectStructure || []} />;
};
