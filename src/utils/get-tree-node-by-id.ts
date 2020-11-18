import { TreeItem } from '@gpn-prototypes/vega-ui';

export const getTreeNodeById = (id: string, nodeList: Array<TreeItem>): TreeItem | undefined => {
  let result;

  const searchObj = (list: TreeItem[]): void => {
    list.forEach((node: TreeItem) => {
      if (node.id === id) {
        result = node;
      }

      if (node.nodeList) {
        searchObj(node.nodeList);
      }
    });
  };

  searchObj(nodeList);

  return result;
};
