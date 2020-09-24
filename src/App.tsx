import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { GeologicalExploration } from './components/geological-exploration';
import Navigation from './components/navigation';

import './App.css';
import './styles/colors.css';

export const App = (): React.ReactElement => {
  return (
    <Theme className="App" preset={presetGpnDark}>
      <Navigation />
      <Switch>
        <Route exact component={GeologicalExploration} path="/" />
      </Switch>
    </Theme>
  );
};
