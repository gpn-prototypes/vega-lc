import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconSearch, TargetData, Text, TextField, Tree } from '@gpn-prototypes/vega-ui';

import {
  setActivitiesDraggingElements,
  setActivitiesRef,
  setSearchString,
} from '../../redux-store/activities/actions';
import {
  getActivitiesNodeList,
  getIsAutoFocus,
  getSearchStringValue,
} from '../../redux-store/activities/selectors';

import { cnActivities } from './cn-activities';
import { BlueLineSvg } from './icons';

import './index.css';

const icons = {
  'blue-line': BlueLineSvg,
};

export const ActivitiesWidget: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();

  const activitiesRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(setActivitiesRef(activitiesRef));
  }, [dispatch, activitiesRef]);

  const searchString = useSelector(getSearchStringValue);
  const activities = useSelector(getActivitiesNodeList(searchString));
  const autoFocus = useSelector(getIsAutoFocus);

  const handleSearch = (args: { value: string | null }): void => {
    dispatch(setSearchString(args.value));
  };

  const handleDragStart = (transferringElems: TargetData[]): void => {
    dispatch(setActivitiesDraggingElements(transferringElems));
  };

  const handleDragEnd = (): void => {
    dispatch(setActivitiesDraggingElements([]));
  };

  return (
    <div ref={activitiesRef} className={cnActivities()}>
      <div className={cnActivities('Head')}>
        <Text className={cnActivities('Title').toString()}>Мероприятия</Text>

        <TextField
          autoFocus={autoFocus}
          className={cnActivities('Search').toString()}
          leftSide={IconSearch}
          size="s"
          inputRef={inputRef}
          type="input"
          onChange={handleSearch}
          value={searchString}
          placeholder="Поиск"
        />
      </div>

      <Tree
        icons={icons}
        nodeList={activities || []}
        withVisibilitySwitcher={false}
        withDropZoneIndicator={false}
        showIndentGuides={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};
