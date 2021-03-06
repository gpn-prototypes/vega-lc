import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '@gpn-prototypes/vega-ui';

import { cnApp } from './cn-app';

import './App.css';
import '../styles/colors.css';

import { GeologicalExploration } from '@/components/geological-exploration';
import { Notifications } from '@/components/notifications';
import { ProjectContext } from '@/react-context/providers';
import { fetchProjectSchema } from '@/redux-store/project-structure/actions';
import { StoreLC } from '@/types/redux-store';

export const AppView = (): React.ReactElement => {
  const dispatch = useDispatch();

  const { initialized } = useContext(ProjectContext);

  const isLoading = useSelector<StoreLC, boolean>(
    (state) => !state.projectStructure.projectStructureQuery,
  );

  useEffect(() => {
    if (initialized) {
      dispatch(fetchProjectSchema());
    }
  }, [dispatch, initialized]);

  return (
    <div className={cnApp('App')}>
      {isLoading ? <Loader size="m" /> : <GeologicalExploration />}
      <Notifications />
    </div>
  );
};
