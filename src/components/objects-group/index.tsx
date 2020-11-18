import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconAdd } from '@gpn-prototypes/vega-icons';
import { Button, TargetData, Tree } from '@gpn-prototypes/vega-ui';

import {
  setGroupObjectsDraggingElements,
  toggleDialog,
  updateGroupObject,
} from '../../redux-store/group-objects/actions';
import { getGroupObjectsNodeList } from '../../redux-store/group-objects/selectors';
import { getProjectStructureDraggingElements } from '../../redux-store/project-structure/selectors';

import { cnObjectGroup } from './cn-objects-group';
import { CircleSvg, SquareSvg } from './icons';
import { ObjectsGroupDialog } from './ObjectsGroupDialog';

import './index.css';

const icons = {
  square: SquareSvg,
  circle: CircleSvg,
};

export const ObjectsGroupWidget: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();

  const objectGroup = useSelector(getGroupObjectsNodeList);
  const projectStructureDraggingElements = useSelector(getProjectStructureDraggingElements);

  const handleOpenDialog = (): void => {
    dispatch(toggleDialog(true));
  };

  const handlePaste = (transferringIds: string[], receivingId: string): void => {
    if (projectStructureDraggingElements?.length) {
      const ids = projectStructureDraggingElements.reduce((acc: string[], element: TargetData) => {
        if (element.isDraggable) {
          acc.push(element.id);

          return acc;
        }

        return acc;
      }, []);

      dispatch(updateGroupObject(receivingId, ids));
    }
  };

  const handleDragStart = (transferringElems: TargetData[]): void => {
    dispatch(setGroupObjectsDraggingElements(transferringElems));
  };

  const handleDragEnd = (): void => {
    dispatch(setGroupObjectsDraggingElements([]));
  };

  return (
    <div className={cnObjectGroup()}>
      <Tree
        icons={icons}
        nodeList={objectGroup || []}
        showIndentGuides={false}
        onPasteItem={handlePaste}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      <div className={cnObjectGroup('GroupCreator')}>
        <Button
          width="full"
          type="button"
          view="ghost"
          size="l"
          iconSize="s"
          iconLeft={IconAdd}
          onClick={handleOpenDialog}
          label="Добавить группу"
        />
      </div>

      <ObjectsGroupDialog />
    </div>
  );
};
