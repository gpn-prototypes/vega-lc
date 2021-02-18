import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { render } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { GeologicalExploration } from '../../src/components/geological-exploration';
import { ProjectContext } from '../../src/react-context/providers';
import { store } from '../../src/redux-store';

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

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
    <ReduxProvider store={store}>
      <ProjectContext.Provider value={{ projectId, initialized }}>
        <GeologicalExploration />
      </ProjectContext.Provider>
    </ReduxProvider>,
  );
};

describe('Geological Exploration', () => {
  test('рендерится без ошибок', () => {
    const { container } = renderComponent();

    const objectGroup = container.querySelector('.GeologicalExploration');

    expect(objectGroup).toBeInTheDocument();
  });

  test('Основные компоненты присутствуют в DOM', () => {
    const { container } = render(
      <ReduxProvider store={store}>
        <GeologicalExploration />
      </ReduxProvider>,
    );

    const mainComponentLabels = ['project-structure', 'objects-groups', 'logic-constructor'];

    mainComponentLabels.forEach((label) =>
      expect(container.querySelector(`[aria-label="${label}"]`)).toBeInTheDocument(),
    );
  });

  test('вызывать загрузку данных проекта если он инициализирован', async () => {
    renderComponent('', true);

    expect(mockDispatch).toHaveBeenCalledTimes(4);
  });

  test('не вызывать загрузку данных проекта если он не инициализирован', () => {
    renderComponent('', false);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
