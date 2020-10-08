import { TreeItem } from '@gpn-prototypes/vega-tree';

const initialState = {
  nodeList: [] as TreeItem[],
  isDialogOpened: false,
  newGroupParams: {
    isDynamic: false,
    name: '',
  },
};

export default initialState;
