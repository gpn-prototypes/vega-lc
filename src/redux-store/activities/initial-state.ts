import { TreeItem } from '@gpn-prototypes/vega-ui';

import { ActivitiesState } from '@/types/redux-store';

const initialState: ActivitiesState = {
  nodeList: [] as TreeItem[],
  searchString: '',
  autoFocus: false,
  activitiesRef: null,
  draggingElements: [],
  isDroppingOnExistingStep: false,
  isActivitiesPanelOpen: false,
};

export default initialState;
