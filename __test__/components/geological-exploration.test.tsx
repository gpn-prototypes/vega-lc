import React from 'react';
import * as ReactRedux from 'react-redux';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { GeologicalExploration } from '../../src/components/geological-exploration';
import { ProjectContext } from '../../src/react-context/providers';
import { store } from '../../src/redux-store';

jest.mock('../../src/components/logic-constructor', () => {
  return {
    LogicConstructorWidget: () => {
      return <div />;
    },
  };
});

jest.mock('../../src/components/objects-group', () => {
  return {
    ObjectsGroupWidget: () => {
      return <div />;
    },
  };
});

jest.mock('../../src/components/project-structure', () => {
  return {
    ProjectStructureWidget: () => {
      return <div />;
    },
  };
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => {
  const originalModule = jest.requireActual('react-redux');

  return {
    ...originalModule,
    useDispatch: () => mockDispatch,
  };
});

beforeEach(() => {
  mockDispatch.mockClear();
});

const renderComponent = (projectId = '', initialized = false) => {
  return render(
    <ReactRedux.Provider store={store}>
      <ProjectContext.Provider value={{ projectId, initialized }}>
        <GeologicalExploration />
      </ProjectContext.Provider>
    </ReactRedux.Provider>,
  );
};

describe('Geological Exploration', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer
      .create(
        <ReactRedux.Provider store={store}>
          <GeologicalExploration />
        </ReactRedux.Provider>,
      )
      .toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('вызов fetch при initialized = true', async () => {
    renderComponent('', true);

    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });

  test('отсутствие вызова fetch при initialized = false', () => {
    renderComponent('', false);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
