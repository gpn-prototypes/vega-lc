import { TreeItem } from '@gpn-prototypes/vega-tree';

const initialState = {
  nodeList: [] as TreeItem[],
  searchString: '',
  autoFocus: false,
  activitiesRef: null,
  draggingElements: [],
};

export default initialState;
