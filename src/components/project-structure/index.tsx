import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TargetData, Tree } from '@gpn-prototypes/vega-ui';

import { BlueLineSvg, OrangeLineSvg, RedLineSvg } from './icons';

import { setProjectStructureDraggingElements } from '@/redux-store/project-structure/actions';
import { getProjectStructureNodeList } from '@/redux-store/project-structure/selectors';

const icons = {
  'blue-line': BlueLineSvg,
  'orange-line': OrangeLineSvg,
  'red-line': RedLineSvg,
};

export const ProjectStructureWidget: React.FC = (): React.ReactElement => {
  const projectStructure = useSelector(getProjectStructureNodeList);
  const dispatch = useDispatch();

  const handleDragStart = (transferringElems: TargetData[]): void => {
    dispatch(setProjectStructureDraggingElements(transferringElems));
  };

  const handleDragEnd = (): void => {
    dispatch(setProjectStructureDraggingElements([]));
  };

  return (
    <Tree
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      icons={icons}
      isContextMenuEnable
      nodeList={projectStructure || []}
    />
  );
};
