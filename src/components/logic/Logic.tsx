/* eslint-disable max-classes-per-file */
import React from 'react';
import styled from '@emotion/styled';
import { GridState, GridUpdate } from '@gpn-prototypes/vega-layout';

import { CanvasWidget } from './CanvasWidget';
import { ProjectStructureWidget } from './ProjectStructureWidget';

const widgets = [
  { name: 'Widget one', component: 'vega-widget-one' },
  { name: 'Widget two', component: 'vega-widget-two' },
];

class WidgetOne extends HTMLElement {
  static widgetName = 'vega-widget-one';

  connectedCallback(): void {
    this.innerHTML = '<h1>Widget One</h1>';
  }
}

class WidgetTwo extends HTMLElement {
  static widgetName = 'vega-widget-two';

  connectedCallback(): void {
    this.innerHTML = '<h1>Widget Two</h1>';
  }
}

if (window.customElements.get(WidgetOne.widgetName) === undefined) {
  window.customElements.define(WidgetOne.widgetName, WidgetOne);
}

if (window.customElements.get(WidgetTwo.widgetName) === undefined) {
  window.customElements.define(WidgetTwo.widgetName, WidgetTwo);
}

const Container = styled.div`
  width: 100%;
  height: 900px;
  max-height: 900px;
  display: flex;
  box-sizing: border-box;
`;

const LeftContainer = styled.div`
  width: 20%;
`;

const RightContainer = styled.div`
  width: 80%;
  overflow: auto;
`;

const state: GridState = {
  0: {
    type: 'branch',
    data: {
      splitDirection: 'right',
      breakpoint: 20,
    },
  },
  1: {
    type: 'leaf',
    data: {
      widget: 'vega-widget-one',
      context: {},
    },
  },
  2: {
    type: 'leaf',
    data: {
      widget: 'vega-widget-one',
      context: {},
    },
  },
};

export const Logic = (): React.ReactElement => {
  function action(change: { update: GridUpdate; state: GridState }) {
    console.log(change);
  }

  return (
    <Container>
      <LeftContainer>
        <ProjectStructureWidget />
      </LeftContainer>
      <RightContainer>
        <CanvasWidget />
      </RightContainer>
    </Container>
  );
};
