import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { presetGpnDark, Theme } from '@gpn-prototypes/vega-ui';

import { Grr } from './components/grr/Grr';
import { Header } from './components/Header/Header';
import { Logic } from './components/logic/Logic';
import { Navigation } from './components/Navigation/Navigation';

import './App.css';
import './styles/colors.css';

export const App = (): React.ReactElement => {
  return (
    <Theme className="App" preset={presetGpnDark}>
      <Header />
      <Navigation />
      <Switch>
        <Route exact component={Grr} path="/" />
        <Route exact component={Logic} path="/logic" />
        {/* <Route component={Logic} path="*"/> */}
      </Switch>
    </Theme>
  );
};
