import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconSearch } from '@gpn-design/uikit/IconSearch';
import { Text } from '@gpn-design/uikit/Text';
import { TextField, TextFieldOnChangeArguments } from '@gpn-design/uikit/TextField';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';

import { setSearchString } from '../../redux-store/activities/actions';
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
  const ref = useRef<HTMLInputElement>(null);

  const autoFocus = useSelector(getIsAutoFocus);
  const searchString = useSelector(getSearchStringValue);

  const handleSearch = (args: TextFieldOnChangeArguments): void => {
    dispatch(setSearchString(args.value));
  };

  return (
    <div className={cnActivities()}>
      <Text className={cnActivities('Title').toString()}>Мероприятия</Text>
      <TextField
        autoFocus={autoFocus}
        className={cnActivities('Search').toString()}
        leftSide={IconSearch}
        size="s"
        inputRef={ref}
        type="input"
        onChange={handleSearch}
        value={searchString}
        placeholder="Поиск"
      />
      <Tree
        icons={icons}
        withVisibilitySwitcher={false}
        nodeList={activities}
        showIndentGuides={false}
      />
    </div>
  );
};
