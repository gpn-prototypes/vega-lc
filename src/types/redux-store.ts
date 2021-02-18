import React from 'react';
import { CanvasData, CanvasTree, TargetData, TreeItem } from '@gpn-prototypes/vega-ui';
import { CanvasView } from '@gpn-prototypes/vega-ui/dist/components/canvas/entities/CanvasView';

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

export type SplitPanesGridParams = {
  width: string;
  height?: string;
};

export type CanvasViewEntity = CanvasView;

export type StepContent = {
  activity?: {
    activityType: {
      vid: string;
    };
    name: string;
  };
  object?: {
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
  nodeList: NodeList;
  searchString: string | null;
  autoFocus: boolean;
  activitiesRef?: React.RefObject<HTMLElement> | null;
  draggingElements: TargetData[] | [];
  isDroppingOnExistingStep?: boolean;
  isActivitiesPanelOpen: boolean;
};

export type LogicConstructorState = {
  scenarioList?: Step[];
  canvasElements?: CanvasTree[];
  isStepEditorOpened?: boolean;
  canvasViewRef?: React.MutableRefObject<CanvasViewEntity | null>;
};

export type NewGroupParams = {
  isDynamic: boolean;
  name: string;
};

export type GroupObjectsState = {
  nodeList: NodeList;
  isDialogOpened: boolean;
  newGroupParams: NewGroupParams;
  draggingElements: TargetData[] | [];
};

export interface ProjectStructureQuery {
  query: string;
  tree: string[];
}

export type ProjectStructureState = {
  nodeList: NodeList;
  draggingElements: TargetData[] | [];
  projectStructureQuery?: ProjectStructureQuery;
};

export type VersionState = {
  version?: number;
};

export type StoreLC = {
  activities: ActivitiesState;
  groupObjects: GroupObjectsState;
  projectStructure: ProjectStructureState;
  logicConstructor: LogicConstructorState;
  version: VersionState;
  notifications: NotificationState;
};

export type NotificationStatus = 'alert' | 'normal' | 'system' | 'success' | 'warning' | undefined;

export type Notification = {
  message: string;
  status?: NotificationStatus;
  autoClose?: boolean;
  icon?: React.FC<any>;
};

export type NotificationState = {
  list: Notification[];
};
