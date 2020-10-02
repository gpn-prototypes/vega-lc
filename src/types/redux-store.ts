import { TreeItem } from '@gpn-prototypes/vega-ui';

type NodeList = TreeItem[];

export type ActivitiesState = {
  nodeList?: NodeList;
  searchString?: string | null;
  autoFocus?: boolean;
};

export type GroupObjectsState = {
  nodeList?: NodeList;
};

export type ProjectStructureState = {
  nodeList?: NodeList;
};

export type StoreLC = {
  activities: ActivitiesState;
  groupObjects: GroupObjectsState;
  projectStructure: ProjectStructureState;
};

export type ActionTypes = { [id: string]: string };
