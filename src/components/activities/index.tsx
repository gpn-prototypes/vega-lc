import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tree } from '@gpn-prototypes/vega-tree';

import { fetchActivitiesList } from '../../redux-store/activities/actions';
import { getActivitiesNodeList } from '../../redux-store/activities/selectors';

import { cnActivities } from './cn-activities';
import { BlueLineSvg } from './icons';

import './index.css';

const icons = {
  'blue-line': BlueLineSvg,
};

export const ActivitiesWidget = (): React.ReactElement => {
  const dispatch = useDispatch();

  const activities = useSelector(getActivitiesNodeList);

  useEffect(() => {
    dispatch(fetchActivitiesList());
  }, [dispatch]);

  return (
    <div className={cnActivities()}>
      <Tree
        icons={icons}
        withVisibilitySwitcher={false}
        nodeList={activities}
        showIndentGuides={false}
      />
    </div>
  );
};
