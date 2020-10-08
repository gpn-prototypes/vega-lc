import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconAdd } from '@gpn-prototypes/vega-icons';
import { Tree } from '@gpn-prototypes/vega-tree';
import { Button } from '@gpn-prototypes/vega-ui';

import { toggleDialog } from '../../redux-store/group-objects/actions';
import { getGroupObjectsNodeList } from '../../redux-store/group-objects/selectors';

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

  const handleOpenDialog = (): void => {
    dispatch(toggleDialog(true));
  };

  return (
    <div className={cnObjectGroup()}>
      <Tree icons={icons} nodeList={objectGroup || []} showIndentGuides={false} />

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
