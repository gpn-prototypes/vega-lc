import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconSearch } from '@gpn-design/uikit/IconSearch';
import { Text } from '@gpn-design/uikit/Text';
import { TextField, TextFieldOnChangeArguments } from '@gpn-design/uikit/TextField';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';

import { setActivitiesRef, setSearchString } from '../../redux-store/activities/actions';
import { getIsAutoFocus, getSearchStringValue } from '../../redux-store/activities/selectors';

import { cnActivities } from './cn-activities';
import { BlueLineSvg } from './icons';

import './index.css';

const icons = {
  'blue-line': BlueLineSvg,
};

type ActivitiesProps = {
  activities: TreeItem[];
};

export const ActivitiesWidget: React.FC<ActivitiesProps> = ({ activities }): React.ReactElement => {
  const dispatch = useDispatch();

  const activitiesRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(setActivitiesRef(activitiesRef));
  }, [dispatch, activitiesRef]);

  const autoFocus = useSelector(getIsAutoFocus);
  const searchString = useSelector(getSearchStringValue);

  const handleSearch = (args: TextFieldOnChangeArguments): void => {
    dispatch(setSearchString(args.value));
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
        nodeList={activities}
        withVisibilitySwitcher={false}
        showIndentGuides={false}
      />
    </div>
  );
};
