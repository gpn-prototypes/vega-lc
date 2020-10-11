import React from 'react';
import { CanvasData, TreeItem } from '@gpn-prototypes/vega-ui';

type NodeList = TreeItem[];

export type StepContent = {
  activity?: {
    vid: string;
    name: string;
  };
  objects?: {
    vid: string;
    name: string;
  };
};

export type Step = {
  name: string;
  vid: string;
  itemList: StepContent[];
};

export type CanvasElement = {
  id?: string;
  parentIds?: string[];
  childrenIds?: string[];
  data: CanvasData;
};

export type CanvasItemData = {
  vid: string;
  children?: { vid: string }[];
  parents?: { vid: string }[];
  position: [number, number];
  nodeRef?: string | null;
  nodeType: 'root' | 'end' | 'domainObject';
  title?: string;
  width?: number;
};

export type ActivitiesState = {
  nodeList?: NodeList;
  searchString?: string | null;
  autoFocus?: boolean;
  activitiesRef?: React.RefObject<HTMLElement> | null;
};

export type LogicConstructorState = {
  scenarioList?: Step[];
  canvasItemsData?: CanvasItemData[];
};

export type NewGroupParams = {
  isDynamic: boolean;
  name: string;
};

export type GroupObjectsState = {
  nodeList?: NodeList;
  isDialogOpened?: boolean;
  newGroupParams?: NewGroupParams;
};

export type ProjectStructureState = {
  nodeList?: NodeList;
};

export type StoreLC = {
  activities: ActivitiesState;
  groupObjects: GroupObjectsState;
  projectStructure: ProjectStructureState;
  logicConstructor: LogicConstructorState;
};

export type ActionTypes = { [id: string]: string };
