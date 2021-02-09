import { CanvasData, entities } from '@gpn-prototypes/vega-ui';

import { getCanvasTreeById } from '../../src/utils/get-canvas-tree-by-id';

describe('Функция получения Канвас-экземпляра по ID', () => {
  test('Находит канвас дерево по id', () => {
    const { Tree } = entities;
    const mockedCanvasState = Tree.of<CanvasData>({
      id: 'test-id',
      data: {
        position: {
          x: 1,
          y: 1,
        },
        type: 'root',
        title: 'test',
        width: 250,
      },
    });

    let canvasTree = getCanvasTreeById([mockedCanvasState], 'test-id');

    expect(canvasTree?.getId()).toEqual('test-id');

    canvasTree = getCanvasTreeById([mockedCanvasState], 'non-existent-id');

    expect(canvasTree).toBeUndefined();
  });
});
