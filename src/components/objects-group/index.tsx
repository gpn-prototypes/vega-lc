import React from 'react';
import { useDispatch } from 'react-redux';
import { IconAdd } from '@gpn-prototypes/vega-icons';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';
import { Button } from '@gpn-prototypes/vega-ui';

import { toggleDialog } from '../../redux-store/group-objects/actions';

import { cnObjectGroup } from './cn-objects-group';
import { CircleSvg, SquareSvg } from './icons';
import { ObjectsGroupDialog } from './ObjectsGroupDialog';

import './index.css';

const icons = {
  square: SquareSvg,
  circle: CircleSvg,
};

type ObjectsGroupProps = {
  objectsGroup?: TreeItem[];
};

export const ObjectsGroupWidget: React.FC<ObjectsGroupProps> = ({
  objectsGroup = [],
}): React.ReactElement => {
  const dispatch = useDispatch();

  const handleOpenDialog = (): void => {
    dispatch(toggleDialog(true));
  };

  return (
    <div className={cnObjectGroup()}>
      <Tree icons={icons} nodeList={objectsGroup} showIndentGuides={false} />
      {objectsGroup?.length > 0 && (
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
      )}

      <ObjectsGroupDialog />
    </div>
  );
};
