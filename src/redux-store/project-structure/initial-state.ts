import { TreeItem } from '@gpn-prototypes/vega-ui';

import { ProjectStructureState } from '@/types/redux-store';

const initialState: ProjectStructureState = {
  nodeList: [] as TreeItem[],
  draggingElements: [],
};

export default initialState;
