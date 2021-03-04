import React from 'react';
import { Provider } from 'react-redux';
import { Canvas, Change } from '@gpn-prototypes/vega-ui';
import { CanvasView } from '@gpn-prototypes/vega-ui/dist/components/canvas/entities';
import { act, render, waitFor } from '@testing-library/react';
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

    test('не вызывает добавление canvasViewRef если он уже установлен', () => {
      const store = getStore();
      renderCanvas(store);

      const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
      const { canvasViewAccessor } = mockedCanvas.mock.calls[0][0];

      const mockCanvasView: CanvasView = CanvasView.of(mockViewData);
      canvasViewAccessor(mockCanvasView);

      expect(store.getState().logicConstructor.canvasViewRef?.current).toEqual(mockCanvasView);

      const mockSetCanvasRef = jest.fn();
      jest.spyOn(lcActions, 'setCanvasViewRef').mockImplementation(mockSetCanvasRef);

      canvasViewAccessor(mockCanvasView);

      expect(mockSetCanvasRef).toHaveBeenCalledTimes(0);
    });
  });

  describe('Update Tree', () => {
    test('срабатывает select event', () => {
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
    });

    test('срабатывает select item', () => {
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
    });

    test('срабатывает unselect', () => {
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
    });

    test('срабатывает drop-event', () => {
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

      test('синхронизирует canvas state по таймеру после произведения изменений', async () => {
        const mockСanvasSync = jest.fn().mockImplementation(() => ({
          type: 'mock type',
        }));
        jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);
        jest.useFakeTimers();

        const store = getStore(
          createInitState({
            logicConstructor: {
              isStepEditorOpened: true,
            },
          }),
        );

        const mockChange: Change = {
          update: {
            type: 'change',
            id: 'mock id',
            changes: {},
          },
          state: [],
        };

        act(() => {
          renderCanvas(store);

          const mockedCanvas = Canvas as jest.MockedFunction<typeof Canvas>;
          const { onChange } = mockedCanvas.mock.calls[0][0];

          onChange(mockChange);

          jest.runTimersToTime(2000);
        });

        await waitFor(() => expect(mockСanvasSync).toHaveBeenCalledTimes(1));
        expect(mockСanvasSync).toHaveBeenCalledWith(mockChange.update);

        jest.useRealTimers();
      });

      test('не вызывает синхронизацию canvas state по таймеру если не было изменений', async () => {
        const mockСanvasSync = jest.fn().mockImplementation(() => ({
          type: 'mock type',
        }));
        jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);
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

          jest.runTimersToTime(2000);
        });

        await waitFor(() => expect(mockСanvasSync).toHaveBeenCalledTimes(0));

        jest.useRealTimers();
      });

      test('не вызывает синхронизацию canvas state по таймеру если не было изменений', async () => {
        const mockСanvasSync = jest.fn().mockImplementation(() => ({
          type: 'mock type',
        }));
        jest.spyOn(lcActions, 'syncCanvasState').mockImplementation(mockСanvasSync);
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

          jest.runTimersToTime(2000);
        });

        await waitFor(() => expect(mockСanvasSync).toHaveBeenCalledTimes(0));

        jest.useRealTimers();
      });
    });
  });
});
