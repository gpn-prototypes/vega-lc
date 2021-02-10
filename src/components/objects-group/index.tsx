import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconAdd, IconAlert, TargetData, Tree } from '@gpn-prototypes/vega-ui';

import { cnObjectGroup } from './cn-objects-group';
import { CircleSvg, SquareSvg } from './icons';
import { ObjectsGroupDialog } from './ObjectsGroupDialog';

import './index.css';

import { ComponentHeader } from '@/components/components-header';
import {
  setGroupObjectsDraggingElements,
  toggleDialog,
  updateGroupObject,
} from '@/redux-store/group-objects/actions';
import { getGroupObjectsNodeList } from '@/redux-store/group-objects/selectors';
import { setNotification } from '@/redux-store/notifications/actions';
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
        dispatch(
          setNotification({
            message: `Группа объектов с id "${receivingId}" не найдена`,
            status: 'alert',
            icon: IconAlert,
          }),
        );
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
      <ComponentHeader title="Группы объектов" />

      {objectGroupList?.length ? (
        <Tree
          icons={icons}
          nodeList={objectGroupList}
          showIndentGuides={false}
          onPasteItem={handlePaste}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <div className={cnObjectGroup('NoStructure')}>
          <p>Для создания группы нажмите на кнопку Добавить группу</p>
        </div>
      )}

      <div className={cnObjectGroup('GroupCreator')}>
        <Button
          width="full"
          type="button"
          className={cnObjectGroup('AddGroupBtn').toString()}
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
