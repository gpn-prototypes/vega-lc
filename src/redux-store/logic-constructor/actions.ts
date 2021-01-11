import { NetworkStatus } from '@apollo/client';
import {
  CanvasData,
  CanvasTree,
  CanvasUpdate,
  entities,
  TargetData,
  TreeItem,
} from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';

import { LogicConstructorActionTypes } from './action-types';

import { setIsDroppingOnExistingStep } from '@/redux-store/activities/actions';
import {
  CanvasElement,
  CanvasElements,
  CanvasViewEntity,
  Step,
  StepData,
  StoreLC,
} from '@/types/redux-store';
import { clearArrayFromDuplicates } from '@/utils/clear-array-from-duplicates';
import { composeDomainObjectsArray } from '@/utils/compose-domain-objects-array';
import { canvasNodeTypes } from '@/utils/constants/canvas-node-types';
import { debounce, DebounceFunction } from '@/utils/debounce';
import { getCanvasTreeById } from '@/utils/get-canvas-tree-by-id';
import { getTreeNodeById } from '@/utils/get-tree-node-by-id';
import { logicConstructorService } from '@/utils/lc-service';
import { CANVAS_ITEMS_QUERY } from '@/utils/queries';
import { getStepDataFromScenarioStep } from '@/utils/step-data';

const CANVAS_BASE_ELEMENTS_WIDTH = 67;
const CANVAS_STEP_WIDTH = 250;
const SET_CANVAS_ELEMENTS_DEBOUNCE_TIME = 500;

type SetScenarioList = {
  type: typeof LogicConstructorActionTypes.SET_SCENARIO_LIST;
  scenarioList: Step[];
};

type SetCanvasElements = {
  type: typeof LogicConstructorActionTypes.SET_CANVAS_ELEMENTS;
  canvasElements: CanvasTree[];
};

const setScenarioList = (scenarioList: Step[]): SetScenarioList => ({
  type: LogicConstructorActionTypes.SET_SCENARIO_LIST,
  scenarioList,
});

const setCanvasElements = (canvasElements: CanvasTree[]): SetCanvasElements => ({
  type: LogicConstructorActionTypes.SET_CANVAS_ELEMENTS,
  canvasElements,
});

const setCanvasViewRef = (
  canvasViewRef: React.MutableRefObject<CanvasViewEntity | null>,
): ThunkAction<void, StoreLC, unknown, AnyAction> => (dispatch, getState): void => {
  const viewRef = getState().logicConstructor.canvasViewRef;

  if (viewRef?.current) return;

  dispatch({
    type: LogicConstructorActionTypes.SET_CANVAS_VIEW_REF,
    canvasViewRef,
  });
};

const toggleStepEditor = (
  isStepEditorOpened: boolean,
): ThunkAction<void, StoreLC, unknown, AnyAction> => (dispatch, getState): void => {
  const isOpen = getState().logicConstructor.isStepEditorOpened;

  if (isOpen === isStepEditorOpened) return;

  dispatch({
    type: LogicConstructorActionTypes.TOGGLE_STEP_EDITOR,
    isStepEditorOpened,
  });
};

let debouncedSetCanvasElements: DebounceFunction<CanvasTree[]>;
export const setDebouncedCanvasElements = (
  canvasElements: CanvasTree[],
): ThunkAction<void, StoreLC, unknown, AnyAction> => (dispatch): void => {
  if (!debouncedSetCanvasElements) {
    debouncedSetCanvasElements = debounce(
      (args: CanvasTree[]) => dispatch(setCanvasElements(args)),
      SET_CANVAS_ELEMENTS_DEBOUNCE_TIME,
    );
  }

  debouncedSetCanvasElements(canvasElements);
};

const createScenarioStep = async (
  activityId?: string,
  objectsGroupId?: string,
  objects?: string[],
): Promise<any> => {
  try {
    return await logicConstructorService.scenarioStepCreateMutation({
      activity: activityId,
      objectGroup: objectsGroupId,
      objects,
      name: 'Шаг',
    });
  } catch (e) {
    return undefined;
  }
};

const updateScenarioStep = async (
  scenarioStepId: string,
  activityId?: string,
  objectGroupId?: string,
  objects?: string[],
): Promise<any> => {
  try {
    return await logicConstructorService.scenarioStepUpdateMutation({
      vid: scenarioStepId,
      activity: activityId !== '0' ? activityId : undefined,
      objectGroup: objectGroupId,
      objects,
    });
  } catch (e) {
    return undefined;
  }
};

const addCanvasElement = (
  canvasDataTree: CanvasData,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState): Promise<void> => {
  const { activities } = getState();
  const { isDroppingOnExistingStep } = activities;

  if (isDroppingOnExistingStep) {
    dispatch(setIsDroppingOnExistingStep(false));

    return;
  }

  const { Tree } = entities;
  const { position, width, stepData, type } = canvasDataTree;
  const nodeType = canvasNodeTypes[type];

  let nodeRef;

  if (nodeType === 'domainObject' && stepData?.events.length) {
    const scenarioStepData = await createScenarioStep(stepData.events[0].id);

    if (scenarioStepData) {
      nodeRef = scenarioStepData.data.project?.logic?.scenarioStep?.create?.result?.vid;
    }
  }

  const response = await logicConstructorService.canvasNodeCreateMutation({
    title: stepData?.name,
    width,
    nodeType,
    nodeRef,
    position: [position.x, position.y],
  });

  if (response?.data) {
    const canvasData: CanvasData = nodeRef
      ? ({
          ...canvasDataTree,
          stepData: { ...canvasDataTree.stepData, id: nodeRef },
        } as CanvasData)
      : canvasDataTree;

    const canvasElement = Tree.of<CanvasData>({
      id: response.data.project?.logic?.canvas?.create?.result?.vid,
      data: canvasData,
    });

    dispatch({
      type: LogicConstructorActionTypes.ADD_CANVAS_ELEMENT,
      canvasElement,
    });
  }
};

const fetchCanvasItemsData = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  logicConstructorService.client
    ?.query({
      query: CANVAS_ITEMS_QUERY,
      fetchPolicy: logicConstructorService.fetchPolicy,
      context: {
        uri: logicConstructorService.getGraphQlUri(),
      },
    })
    .then(async (response) => {
      if (response.networkStatus === NetworkStatus.ready) {
        const { logic } = response.data.project;
        const { canvas, stepList }: { canvas?: CanvasElements[]; stepList?: Step[] } = logic;

        const getCanvasElements = (): CanvasTree[] => {
          let result: CanvasTree[] = [];
          const canvasElementsMap: { [key: string]: CanvasElement } = {};

          if (canvas) {
            canvas.forEach((item) => {
              if (!canvasElementsMap[item.vid]) {
                canvasElementsMap[item.vid] = {
                  id: item.vid,
                  childrenIds: item.children?.map((child) => child.vid) || [],
                  parentIds: item.parents?.map((parent) => parent.vid) || [],
                  data: {
                    position: {
                      x: item.position[0],
                      y: item.position[1],
                    },
                    type: item.nodeType === 'domainObject' ? 'step' : item.nodeType,
                    title: item.title || '',
                  },
                };

                if (item.nodeType === 'domainObject') {
                  const step = stepList?.find((element) => element.vid === item.nodeRef);
                  canvasElementsMap[item.vid].data = {
                    ...canvasElementsMap[item.vid].data,
                    width: CANVAS_STEP_WIDTH,
                    stepData: step && getStepDataFromScenarioStep(step),
                  };
                } else {
                  canvasElementsMap[item.vid].data.width = CANVAS_BASE_ELEMENTS_WIDTH;
                }
              }
            });
          }

          const canvasElementsData: CanvasElement[] = Object.values(canvasElementsMap);

          if (canvasElementsData.length > 0) {
            const { Tree } = entities;

            result = canvasElementsData.map((elem) => Tree.of<CanvasData>(elem));
          }

          return result;
        };

        const canvasElements = getCanvasElements();

        dispatch(setCanvasElements(canvasElements));
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const syncCanvasState = (
  updateData: CanvasUpdate,
): ThunkAction<void, StoreLC, unknown, AnyAction> => {
  return async (dispatch, getState): Promise<void> => {
    const { canvasElements } = getState().logicConstructor;

    if (!canvasElements) return;

    if (updateData.type === 'change' && 'position' in updateData.changes) {
      const position = [updateData.changes.position?.x, updateData.changes.position?.y];

      await logicConstructorService.canvasNodeUpdateMutation({ vid: updateData.id, position });

      if (logicConstructorService.isMutationConflict) {
        dispatch(fetchCanvasItemsData());

        logicConstructorService.setIsMutationConflictResolved();
      }

      return;
    }

    if (updateData.type === 'change-multiple') {
      const multipleData = updateData.ids.map((id: string, index: number) => {
        const { position: { x, y } = {} } = updateData.changes[index];
        const position = [x, y];
        return { vid: id, position };
      });

      await multipleData.reduce<Promise<any>>((promise, i) => {
        return promise
          .then(() => logicConstructorService.canvasNodeUpdateMutation(i))
          .catch(console.error);
      }, Promise.resolve());

      if (logicConstructorService.isMutationConflict) {
        dispatch(fetchCanvasItemsData());

        logicConstructorService.setIsMutationConflictResolved();
      }

      return;
    }

    if (updateData.type === 'connect-tree' || updateData.type === 'disconnect-tree') {
      const { parentId, childId } = updateData;
      const childVariables = {
        vid: parentId,
        childrenVids: getCanvasTreeById(canvasElements, parentId)?.getChildren(),
      };

      const parentVariables = {
        vid: childId,
        parentVids: getCanvasTreeById(canvasElements, childId)?.getParents(),
      };

      try {
        await logicConstructorService.canvasNodeUpdateMutation(childVariables);
        await logicConstructorService.canvasNodeUpdateMutation(parentVariables);

        if (logicConstructorService.isMutationConflict) {
          dispatch(fetchCanvasItemsData());

          logicConstructorService.setIsMutationConflictResolved();
        }
      } catch (e) {
        console.error(e);
      }

      return;
    }

    if (updateData.type === 'add-tree') {
      const tree = getCanvasTreeById(canvasElements, updateData.id);

      if (tree) {
        const { type, position: pos, title } = tree.getData();
        const nodeType = type === 'step' ? 'domainObject' : type;

        let nodeRef;

        if (nodeType === 'domainObject') {
          const scenarioStepData = await createScenarioStep();

          if (scenarioStepData) {
            nodeRef = scenarioStepData.data.project?.logic?.scenarioStep?.create?.result?.vid;
          }
        }

        const treeWidth = type === 'step' ? CANVAS_STEP_WIDTH : CANVAS_BASE_ELEMENTS_WIDTH;
        // const queryString = `title: $title, nodeType: $nodeType, width: $width, position: $position, nodeRef: $nodeRef`;

        if (nodeRef) {
          tree.setData({ stepData: { id: nodeRef, name: 'Шаг', events: [] } });
        }

        await logicConstructorService.canvasNodeCreateMutation({
          vid: updateData.id,
          title,
          nodeType,
          width: treeWidth,
          position: [pos.x, pos.y],
          nodeRef,
        });

        if (logicConstructorService.isMutationConflict) {
          dispatch(fetchCanvasItemsData());

          logicConstructorService.setIsMutationConflictResolved();
        }
      }

      return;
    }

    if (updateData.type === 'remove-trees') {
      await updateData.ids.reduce<Promise<any>>((promise, vid) => {
        return promise
          .then(() => logicConstructorService.canvasNodeDeleteMutation({ vid }))
          .catch(console.error);
      }, Promise.resolve());

      if (logicConstructorService.isMutationConflict) {
        dispatch(fetchCanvasItemsData());

        logicConstructorService.setIsMutationConflictResolved();
      }
    }
  };
};

const addProjectStructureObjectToCanvasElement = (
  CanvasTreeId: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState) => {
  const { logicConstructor, projectStructure } = getState();
  const {
    nodeList,
    draggingElements,
  }: {
    nodeList?: TreeItem[];
    draggingElements?: TargetData[];
  } = projectStructure;
  const { canvasElements } = logicConstructor;

  if (draggingElements?.length && canvasElements && nodeList) {
    const canvasTree = getCanvasTreeById(canvasElements, CanvasTreeId);
    const treeData = canvasTree?.getData();

    if (treeData?.stepData) {
      const { stepData: existStepData } = treeData;
      const existObjectsIds = existStepData.events[0]?.content.map((item) => item.id) || [];

      if (draggingElements.length === 1 && existObjectsIds.includes(draggingElements[0].id)) return;

      const draggingElementsIds = draggingElements.map((el: TargetData) => el.id);
      const newObjectsIds = composeDomainObjectsArray(draggingElementsIds, nodeList)?.map(
        (object) => object.id,
      );

      if (!newObjectsIds) return; // TODO: process error

      const resultIdsArray = clearArrayFromDuplicates([...existObjectsIds, ...newObjectsIds]);

      const response = await updateScenarioStep(
        existStepData.id,
        existStepData.events[0]?.id,
        undefined,
        resultIdsArray,
      );

      // TODO: process error
      if (!response) return;

      const id = existStepData.events[0]?.id || '0';
      const name = existStepData.events[0]?.name || 'Мероприятие';
      const content = composeDomainObjectsArray(resultIdsArray, nodeList);

      const events = [
        {
          id,
          name,
          content,
        },
      ];

      canvasTree?.setData({ stepData: { ...existStepData, events } });
    }
  }
};

const addGroupObjectsToCanvasElement = (
  CanvasTreeId: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState) => {
  const { logicConstructor, groupObjects } = getState();
  const { nodeList, draggingElements } = groupObjects;
  const { canvasElements } = logicConstructor;

  if (draggingElements?.length && canvasElements && nodeList) {
    const tree = getCanvasTreeById(canvasElements, CanvasTreeId);
    const domainObjects = getTreeNodeById(draggingElements[0].id, nodeList)?.nodeList.map(
      (node) => ({
        id: node.id,
        name: node.name,
        type: 'domain',
      }),
    );

    if (!domainObjects?.length) return;

    const defaultEvent = {
      id: '0',
      name: 'Мероприятие',
      content: domainObjects || [],
    };

    let stepData: StepData = {
      id: '0',
      name: 'Шаг',
      events: [defaultEvent],
    };

    const treeData = tree?.getData();

    if (treeData?.stepData) {
      stepData = { ...treeData.stepData };

      const event = { ...defaultEvent, ...stepData.events[0] };
      event.content = domainObjects || [];

      stepData.events[0] = event;

      // TODO: refactor - default event id and default event name should be in one place
      const response = await updateScenarioStep(
        stepData.id,
        event.id !== '0' ? event.id : undefined,
        draggingElements[0].id,
      );

      // TODO: process error
      if (!response) return;
    }

    if (tree) {
      tree.setData({ stepData });
    }
  }
};

const addActivityToCanvasElement = (
  CanvasTreeId: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState) => {
  dispatch(setIsDroppingOnExistingStep(true));

  const { logicConstructor, activities } = getState();
  const { canvasElements } = logicConstructor;
  const { draggingElements, nodeList: activitiesList } = activities;

  if (draggingElements?.length && canvasElements && activitiesList) {
    const tree = getCanvasTreeById(canvasElements, CanvasTreeId);
    const activity = getTreeNodeById(draggingElements[0].id, activitiesList);
    const treeData = tree?.getData();

    if (!treeData?.stepData && activity?.id) {
      const stepData: StepData = {
        id: '0',
        name: 'Шаг',
        events: [
          {
            id: activity?.id || '0',
            name: activity?.name || 'Мероприятие',
            content: [],
          },
        ],
      };

      let nodeRef;

      const scenarioStepData = await createScenarioStep(activity?.id);

      if (scenarioStepData) {
        nodeRef = scenarioStepData.data.project?.logic?.scenarioStep?.create?.result?.vid;

        stepData.id = nodeRef || '0';
      }

      await logicConstructorService.canvasNodeUpdateMutation({
        vid: CanvasTreeId,
        nodeRef,
      });

      tree?.setData({ stepData });

      return;
    }

    if (treeData?.stepData && activity?.id) {
      const { stepData: existStepData } = treeData;

      const response = await updateScenarioStep(existStepData.id, activity?.id);

      if (!response) {
        return;
      }

      const events = [
        {
          id: activity.id,
          name: activity.name,
          content: existStepData.events[0]?.content?.length
            ? [...existStepData.events[0].content]
            : [],
        },
      ];

      tree?.setData({ stepData: { ...existStepData, events } });
    }
  }
};

const mapDropEventToRelatedAction = ({
  intersectionId,
  position,
}: {
  intersectionId?: string;
  position?: { x: number; y: number };
}): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState) => {
  const { groupObjects, activities, projectStructure } = getState();
  const { draggingElements: groupObjectsDraggingElements } = groupObjects;
  const { draggingElements: activitiesDraggingElements } = activities;
  const { draggingElements: projectStructureDraggingElements } = projectStructure;

  if (groupObjectsDraggingElements?.length && intersectionId) {
    dispatch(addGroupObjectsToCanvasElement(intersectionId));

    return;
  }

  if (activitiesDraggingElements?.length) {
    if (intersectionId) {
      dispatch(addActivityToCanvasElement(intersectionId));

      return;
    }

    if (position?.x && position?.y) {
      const canvasData: CanvasData = {
        position,
        type: 'step',
        title: 'Шаг',
        width: 250,
        stepData: {
          id: uuidv4(),
          name: 'Шаг',
          events: [
            {
              id: activitiesDraggingElements[0]?.ref?.current?.id || '1',
              name: activitiesDraggingElements[0]?.ref?.current?.innerText || 'Мероприятие',
              content: [],
            },
          ],
        },
      };

      dispatch(addCanvasElement(canvasData));
    }
    return;
  }

  if (projectStructureDraggingElements?.length && intersectionId) {
    dispatch(addProjectStructureObjectToCanvasElement(intersectionId));
  }
};

export {
  syncCanvasState,
  setScenarioList,
  toggleStepEditor,
  addCanvasElement,
  setCanvasViewRef,
  setCanvasElements,
  createScenarioStep,
  fetchCanvasItemsData,
  mapDropEventToRelatedAction,
  addGroupObjectsToCanvasElement,
  addProjectStructureObjectToCanvasElement,
};
