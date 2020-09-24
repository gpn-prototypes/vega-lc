import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tree } from '@gpn-prototypes/vega-tree';

import { fetchProjectStructureList } from '../../redux-store/project-structure/actions';
import { getProjectStructureNodeList } from '../../redux-store/project-structure/selectors';

import { BlueLineSvg, OrangeLineSvg, RedLineSvg } from './icons';

const icons = {
  'blue-line': BlueLineSvg,
  'orange-line': OrangeLineSvg,
  'red-line': RedLineSvg,
};

export const ProjectStructureWidget = (): React.ReactElement => {
  const dispatch = useDispatch();

  const projectStructure = useSelector(getProjectStructureNodeList);

  useEffect(() => {
    dispatch(fetchProjectStructureList());
  }, [dispatch]);

  return <Tree icons={icons} isContextMenuEnable nodeList={projectStructure} />;
};
