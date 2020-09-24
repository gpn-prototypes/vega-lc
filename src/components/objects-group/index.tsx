import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tree } from '@gpn-prototypes/vega-tree';

import { fetchGroupObjectList } from '../../redux-store/group-objects/actions';
import { getGroupObjectsNodeList } from '../../redux-store/group-objects/selectors';

import { cnObjectGroup } from './cn-objects-group';
import { CircleSvg, SquareSvg } from './icons';

import './index.css';

const icons = {
  square: SquareSvg,
  circle: CircleSvg,
};

export const ObjectsGroupWidget = (): React.ReactElement => {
  const dispatch = useDispatch();

  const groupObjects = useSelector(getGroupObjectsNodeList);

  useEffect(() => {
    dispatch(fetchGroupObjectList());
  }, [dispatch]);

  return (
    <div className={cnObjectGroup()}>
      <Tree icons={icons} nodeList={groupObjects} showIndentGuides={false} />
    </div>
  );
};
