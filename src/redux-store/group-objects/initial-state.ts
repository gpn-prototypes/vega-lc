import { TreeItem } from '@gpn-prototypes/vega-ui';

const initialState = {
  nodeList: [] as TreeItem[],
  isDialogOpened: false,
  newGroupParams: {
    isDynamic: false,
    name: '',
  },
  draggingElements: [],
};

export default initialState;
