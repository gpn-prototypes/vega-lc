import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { GeologicalExploration } from '../components/geological-exploration';
import { fetchVersion } from '../redux-store/version/actions';

import './App.css';
import '../styles/colors.css';

export const AppView = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVersion());
  }, [dispatch]);

  return (
    <Theme className="App" preset={presetGpnDark}>
      <Switch>
        <Route exact component={GeologicalExploration} path="/" />
      </Switch>
    </Theme>
  );
};
