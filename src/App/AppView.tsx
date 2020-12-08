import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@gpn-prototypes/vega-ui';

import { cnApp } from './cn-app';

import './App.css';
import '../styles/colors.css';

import { GeologicalExploration } from '@/components/geological-exploration';
import { fetchVersion } from '@/redux-store/version/actions';
import { StoreLC } from '@/types/redux-store';

export const AppView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const isLoading = useSelector<StoreLC, boolean>(
    (state) => !state.projectStructure.projectStructureQuery,
  );

  useEffect(() => {
    dispatch(fetchVersion());
  }, [dispatch]);

  return (
    <div className={cnApp('App')}>
      {isLoading ? <Loader size="m" /> : <GeologicalExploration />}
    </div>
  );
};
