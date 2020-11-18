import { CanvasTree } from '@gpn-prototypes/vega-ui';

export const getCanvasTreeById = (
  canvasElements: CanvasTree[],
  id: string,
): CanvasTree | undefined =>
  canvasElements.find((tree) => {
    const treeId = tree.getId();

    return treeId === id;
  });
