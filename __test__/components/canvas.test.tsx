import React from 'react';
import { Provider } from 'react-redux';
import { Canvas, CanvasUpdate, Change } from '@gpn-prototypes/vega-ui';
import { CanvasView } from '@gpn-prototypes/vega-ui/dist/components/canvas/entities';
import { act, render } from '@testing-library/react';
import { Store } from 'redux';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { CanvasWidget } from '../../src/components/canvas';
import { getStore } from '../../src/redux-store';
import * as lcActions from '../../src/redux-store/logic-constructor/actions';
import { createInitState } from '../testing-helpers/create-init-state';

jest.mock('@gpn-prototypes/vega-ui', () => {
  const originalModule = jest.requireActual('@gpn-prototypes/vega-ui');
  return {
    ...originalModule,
    Canvas: jest.fn().mockImplementation(() => <div data-testid="canvas" />),
  };
});

const renderCanvas = (store?: Store) => {
  return render(
    <Provider store={store || getStore()}>
      <CanvasWidget />
    </Provider>,
  );
};

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Список мероприятий', () => {
  test('рендерится без ошибок', () => {
    renderCanvas();
  });

  describe('Установка canvasViewRef', () => {
    const mockViewData = {
      state: {
        activeOption: null,
        cursor: 'default',
        activeData: null,
        selectedData: null,
        stageSize: { width: 1, height: 1 },
        linePoints: null,
        contentRect: { x: 0, y: 0, height: 0, width: 0 },
        overlay: false,
        scale: 1,
      },
      stage: null,
      canvas: null,
      horizontalScrollbar: null,
      background: null,
      verticalScrollbar: null,
      layer: null,
      container: null,
    };

    test('добавляет canvasViewRef', () => {
      const store = getStore();
      renderCanvas(store);

      const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
      const { canvasViewAccessor } = mockedCanvas.mock.calls[0][0];

      const mockCanvasView: CanvasView = CanvasView.of(mockViewData);
      canvasViewAccessor(mockCanvasView);

      expect(store.getState().logicConstructor.canvasViewRef?.current).toEqual(mockCanvasView);
    });
  });

  describe('Update Tree', () => {
    const checkCanvasSync = (isCalled: boolean, update?: CanvasUpdate) => {
      const mockСanvasSync = jest.fn().mockImplementation(() => ({
        type: 'mock type',
      }));
      jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);

      act(() => {
        jest.runTimersToTime(2000);
      });

      if (!isCalled) {
        expect(mockСanvasSync).not.toHaveBeenCalled();
      } else {
        expect(mockСanvasSync).toHaveBeenCalledTimes(1);
        expect(mockСanvasSync).toHaveBeenCalledWith(update);
      }
    };

    test('срабатывает select event', () => {
      jest.useFakeTimers();

      const store = getStore({
        logicConstructor: {
          isStepEditorOpened: false,
        },
      });
      renderCanvas(store);
      const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
      const { onChange } = mockedCanvas.mock.calls[0][0];

      const mockChange: Change = {
        update: {
          type: 'select',
          selected: {
            type: 'event',
            itemId: 'mockItemId',
            eventId: 'mockEventId',
          },
        },
        state: [],
      };
      onChange(mockChange);

      expect(store.getState().logicConstructor.isStepEditorOpened).toBeTruthy();

      checkCanvasSync(false);

      jest.useRealTimers();
    });

    test('срабатывает select item', () => {
      jest.useFakeTimers();

      const store = getStore(
        createInitState({
          logicConstructor: {
            isStepEditorOpened: true,
          },
        }),
      );
      renderCanvas(store);
      const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
      const { onChange } = mockedCanvas.mock.calls[0][0];

      const mockChange: Change = {
        update: {
          type: 'select',
          selected: {
            type: 'item',
            ids: ['mockItemId'],
          },
        },
        state: [],
      };

      onChange(mockChange);

      expect(store.getState().logicConstructor.isStepEditorOpened).toBeFalsy();

      checkCanvasSync(false);

      jest.useRealTimers();
    });

    test('срабатывает unselect', () => {
      jest.useFakeTimers();

      const store = getStore(
        createInitState({
          logicConstructor: {
            isStepEditorOpened: true,
          },
        }),
      );
      renderCanvas(store);

      const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
      const { onChange } = mockedCanvas.mock.calls[0][0];

      const mockChange: Change = {
        update: {
          type: 'unselect',
        },
        state: [],
      };
      onChange(mockChange);

      expect(store.getState().logicConstructor.isStepEditorOpened).toBeFalsy();

      checkCanvasSync(false);

      jest.useRealTimers();
    });

    test('срабатывает drop-event', () => {
      jest.useFakeTimers();

      const store = getStore();

      renderCanvas(store);

      const mockMapDropEventToRelatedAction = jest.fn().mockImplementation(() => ({
        type: 'mock type',
      }));
      jest
        .spyOn(lcActions, 'mapDropEventToRelatedAction')
        .mockImplementation(mockMapDropEventToRelatedAction);

      const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
      const { onChange } = mockedCanvas.mock.calls[0][0];

      const mockChange: Change = {
        update: {
          type: 'drop-event',
          intersectionId: 'mockId',
          position: { x: 0, y: 0 },
        },
        state: [],
      };
      onChange(mockChange);

      expect(mockMapDropEventToRelatedAction).toHaveBeenCalledTimes(1);
      expect(mockMapDropEventToRelatedAction).toHaveBeenCalledWith({
        intersectionId: 'mockId',
        position: { x: 0, y: 0 },
      });

      checkCanvasSync(false);

      jest.useRealTimers();
    });

    describe('Синхронизация canvas state', () => {
      test('синхронизирует canvas state при срабатывании action из списка canvasActionsForImmediateSync', () => {
        const store = getStore();

        renderCanvas(store);

        const mockСanvasSync = jest.fn().mockImplementation(() => ({
          type: 'mock type',
        }));
        jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);

        const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
        const { onChange } = mockedCanvas.mock.calls[0][0];

        const mockChange: Change = {
          update: {
            type: 'add-tree',
            id: 'mock id',
          },
          state: [],
        };
        onChange(mockChange);

        expect(mockСanvasSync).toHaveBeenCalledTimes(1);
        expect(mockСanvasSync).toHaveBeenCalledWith(mockChange.update);
      });

      test('синхронизирует state при select с полем selected = null', () => {
        jest.useFakeTimers();

        const mockСanvasSync = jest.fn().mockImplementation(() => ({
          type: 'mock type',
        }));
        jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);

        const store = getStore(
          createInitState({
            logicConstructor: {
              isStepEditorOpened: true,
            },
          }),
        );

        const mockChange: Change = {
          update: {
            type: 'select',
            selected: null,
          },
          state: [],
        };

        act(() => {
          renderCanvas(store);
          const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
          const { onChange } = mockedCanvas.mock.calls[0][0];

          onChange(mockChange);
        });

        expect(store.getState().logicConstructor.isStepEditorOpened).toBeTruthy();

        checkCanvasSync(true, mockChange.update);

        jest.useRealTimers();
      });

      test('синхронизирует canvas state по таймеру после произведения изменений', () => {
        jest.useFakeTimers();

        const mockСanvasSync = jest.fn().mockImplementation(() => ({
          type: 'mock type',
        }));
        jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);

        const mockChange: Change = {
          update: {
            type: 'change',
            id: 'mock id',
            changes: {},
          },
          state: [],
        };

        const store = getStore(
          createInitState({
            logicConstructor: {
              isStepEditorOpened: true,
            },
          }),
        );

        act(() => {
          renderCanvas(store);

          const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
          const { onChange } = mockedCanvas.mock.calls[0][0];

          onChange(mockChange);
        });

        checkCanvasSync(true, mockChange.update);

        jest.useRealTimers();
      });

      test('не вызывает синхронизацию canvas state по таймеру если не было изменений', () => {
        jest.useFakeTimers();

        const store = getStore(
          createInitState({
            logicConstructor: {
              isStepEditorOpened: true,
            },
          }),
        );

        act(() => {
          renderCanvas(store);
        });

        checkCanvasSync(false);

        jest.useRealTimers();
      });
    });
  });
});
