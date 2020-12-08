import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Item } from '@consta/uikit/SnackBar';
import { IconAlert, SnackBar } from '@gpn-prototypes/vega-ui';

import { cnProjectErrors } from './cn-project-errors';

import './index.css';

import { DeleteVersionError } from '@/redux-store/version/actions';
import { StoreLC } from '@/types/redux-store';

export const ProjectErrors = (): React.ReactElement => {
  const dispatch = useDispatch();

  const errors = useSelector<StoreLC, string[]>((state) => state.version.errors, shallowEqual);

  const items = errors.map(
    (error, index) =>
      ({
        key: index,
        message: error,
        icon: IconAlert,
        status: 'alert',
        onClose: () => {
          dispatch(DeleteVersionError(index));
        },
      } as Item),
  );

  return (
    <div className={cnProjectErrors()}>
      <SnackBar className={cnProjectErrors('SnackBar')} items={items} />
    </div>
  );
};
