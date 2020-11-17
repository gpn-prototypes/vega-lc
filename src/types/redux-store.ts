import React from 'react';
import { CanvasData, CanvasTree, TargetData, TreeItem } from '@gpn-prototypes/vega-ui';

type NodeList = TreeItem[];

export declare type Content = {
  type: string;
  id: string;
  name: string;
};
export declare type Event = {
  id: string;
  name: string;
  content: Content[];
};
export declare type StepData = {
  id: string;
  name: string;
  events: Event[];
};

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

export type CanvasElements = {
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
  draggingElements?: TargetData[] | [];
};

export type LogicConstructorState = {
  scenarioList?: Step[];
  canvasElements?: CanvasTree[];
  isStepEditorOpened?: boolean;
};

export type NewGroupParams = {
  isDynamic: boolean;
  name: string;
};

export type GroupObjectsState = {
  nodeList?: NodeList;
  isDialogOpened?: boolean;
  newGroupParams?: NewGroupParams;
  draggingElements?: TargetData[] | [];
};

export type ProjectStructureState = {
  nodeList?: NodeList;
  draggingElements?: TargetData[] | [];
};

export type VersionState = {
  version?: number;
};

export type StoreLC = {
  activities: ActivitiesState;
  groupObjects: GroupObjectsState;
  projectStructure: ProjectStructureState;
  logicConstructor: LogicConstructorState;
};
