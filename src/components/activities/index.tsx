import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  IconArrowDown,
  IconArrowUp,
  IconSearch,
  TargetData,
  Text,
  TextField,
  Tree,
  useMount,
} from '@gpn-prototypes/vega-ui';

import { cnActivities } from './cn-activities';
import { BlueLineSvg } from './icons';

import './index.css';

import {
  setActivitiesDraggingElements,
  setActivitiesPanelOpen,
  setActivitiesRef,
  setSearchString,
} from '@/redux-store/activities/actions';
import {
  getActivitiesNodeList,
  getIsActivitiesPanelOpen,
  getIsAutoFocus,
  getSearchStringValue,
} from '@/redux-store/activities/selectors';

const icons = {
  'blue-line': BlueLineSvg,
};

export const ActivitiesWidget: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();

  const isActivitiesPanelOpen = useSelector(getIsActivitiesPanelOpen);
  const [optionsWrapperWidth, setOptionsWrapperWidth] = useState(0);

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

  const switchActivitiesVisibility = (): void => {
    dispatch(setActivitiesPanelOpen(!isActivitiesPanelOpen));
  };

  useMount(() => {
    const optionsWrapper = document.querySelector('.VegaCanvas__OptionsPanelWrapper');
    if (optionsWrapper) {
      setOptionsWrapperWidth(optionsWrapper.getBoundingClientRect().width);
    }
  });

  return (
    <>
      <div ref={activitiesRef} className={cnActivities()} hidden={!isActivitiesPanelOpen}>
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
      <Button
        style={{ right: `calc(${optionsWrapperWidth}px + var(--space-m) + var(--space-xl))` }}
        label="Мероприятия"
        className={cnActivities('Switch').toString()}
        view={!isActivitiesPanelOpen ? 'ghost' : 'primary'}
        onClick={switchActivitiesVisibility}
        iconRight={!isActivitiesPanelOpen ? IconArrowDown : IconArrowUp}
        iconSize="xs"
      />
    </>
  );
};
