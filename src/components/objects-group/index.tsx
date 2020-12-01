import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconAdd, TargetData, Tree } from '@gpn-prototypes/vega-ui';

import { cnObjectGroup } from './cn-objects-group';
import { CircleSvg, SquareSvg } from './icons';
import { ObjectsGroupDialog } from './ObjectsGroupDialog';

import './index.css';

import {
  setGroupObjectsDraggingElements,
  toggleDialog,
  updateGroupObject,
} from '@/redux-store/group-objects/actions';
import { getGroupObjectsNodeList } from '@/redux-store/group-objects/selectors';
import { getProjectStructureDraggingElements } from '@/redux-store/project-structure/selectors';

const icons = {
  square: SquareSvg,
  circle: CircleSvg,
};

export const ObjectsGroupWidget: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();

  const objectGroupList = useSelector(getGroupObjectsNodeList);
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

      let found = objectGroupList?.find((group) => group.id === receivingId);
      if (!found) {
        found = objectGroupList?.find((group) => group.nodeList.find((i) => i.id === receivingId));
      }
      if (found) {
        dispatch(updateGroupObject(found.id, ids));
      } else {
        // TODO: show error message
      }
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
        nodeList={objectGroupList || []}
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
