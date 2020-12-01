import { TreeItem } from '@gpn-prototypes/vega-ui';

import { GroupObjectsState } from '@/types/redux-store';

const initialState: GroupObjectsState = {
  nodeList: [] as TreeItem[],
  isDialogOpened: false,
  newGroupParams: {
    isDynamic: false,
    name: '',
  },
  draggingElements: [],
};

export default initialState;
