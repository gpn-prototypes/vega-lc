import { TreeItem } from '@gpn-prototypes/vega-ui';

import { Content as DomainObject } from '@/types/redux-store';
import { getTreeNodeById } from '@/utils/get-tree-node-by-id';

export const composeDomainObjectsArray = (ids: string[], source: TreeItem[]): DomainObject[] => {
  const domainObjects: DomainObject[] = [];

  ids.forEach((id) => {
    const treeNode = getTreeNodeById(id, source);

    if (treeNode) {
      domainObjects.push({
        id: treeNode.id,
        name: treeNode.name,
        type: 'domain',
      });
    }
  });

  return domainObjects;
};
