import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import classNames from './cn-app';

import './App.css';
import '../styles/colors.css';

import { GeologicalExploration } from '@/components/geological-exploration';
import { fetchVersion } from '@/redux-store/version/actions';

export const AppView = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVersion());
  }, [dispatch]);

  return (
    <div className={classNames('App')}>
      <GeologicalExploration />
    </div>
  );
};
