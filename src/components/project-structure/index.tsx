import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TargetData, Tree } from '@gpn-prototypes/vega-ui';

import { cnProjectStructure } from './cn-project-structure';
import { BlueLineSvg, OrangeLineSvg, RedLineSvg } from './icons';

import './index.css';

import { ComponentHeader } from '@/components/components-header';
import { ProjectContext } from '@/react-context/providers';
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

  const { projectId } = useContext(ProjectContext);

  const handleDragStart = (transferringElems: TargetData[]): void => {
    dispatch(setProjectStructureDraggingElements(transferringElems));
  };

  const handleDragEnd = (): void => {
    dispatch(setProjectStructureDraggingElements([]));
  };

  return (
    <div className={cnProjectStructure()}>
      <>
        <ComponentHeader title="Структура проекта" />

        {!projectStructure?.length ? (
          <div className={cnProjectStructure('NoStructure')}>
            <p>Структура проекта отсутствует</p>
          </div>
        ) : (
          <Tree
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            icons={icons}
            isContextMenuEnable
            nodeList={projectStructure}
            projectId={projectId}
          />
        )}
      </>
    </div>
  );
};
