import { NetworkStatus } from '@apollo/client';
import { CanvasData, CanvasTree, CanvasUpdate, entities } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { LogicConstructorActionTypes } from './action-types';
import { FETCH_CANVAS_ITEMS_DATA } from './queries';

import { setIsDroppingOnExistingStep } from '@/redux-store/activities/actions';
import { CanvasElement, CanvasElements, Step, StepData, StoreLC } from '@/types/redux-store';
import { getProjectLink, vegaApi } from '@/utils/api-clients/vega-api';
import { canvasNodeTypes } from '@/utils/constants/canvas-node-types';
import { debounce, DebounceFunction } from '@/utils/debounce';
import { getCanvasTreeById } from '@/utils/get-canvas-tree-by-id';
import { getTreeNodeById } from '@/utils/get-tree-node-by-id';
import { graphQlRequest, QueryBody } from '@/utils/graphql-request';
import { getStepDataFromScenarioStep } from '@/utils/step-data';
import { syncCanvasRequest } from '@/utils/sync-canvas-request-body';
import { getCurrentVersion } from '@/utils/version';

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

type ToggleStepEditor = {
  type: typeof LogicConstructorActionTypes.TOGGLE_STEP_EDITOR;
  isStepEditorOpened: boolean;
};

type CreateScenarioStepResponse = {
  data: {
    logic?: {
      scenarioStep?: {
        create?: {
          result?: {
            vid?: string;
          };
        };
      };
    };
  };
};

// type AddCanvasElement = {
//   type: typeof LogicConstructorActionTypes.ADD_CANVAS_ELEMENT;
//   canvasElement: CanvasTree | [];
// };

const setScenarioList = (scenarioList: Step[]): SetScenarioList => ({
  type: LogicConstructorActionTypes.SET_SCENARIO_LIST,
  scenarioList,
});

const setCanvasElements = (canvasElements: CanvasTree[]): SetCanvasElements => ({
  type: LogicConstructorActionTypes.SET_CANVAS_ELEMENTS,
  canvasElements,
});

const toggleStepEditor = (isStepEditorOpened: boolean): ToggleStepEditor => ({
  type: LogicConstructorActionTypes.TOGGLE_STEP_EDITOR,
  isStepEditorOpened,
});

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
  activityId: string,
  objectsGroupId: string,
): Promise<CreateScenarioStepResponse | undefined> => {
  const version = getCurrentVersion();

  const requestBody: QueryBody = {
    query: `mutation($version: Int!, $activity: UUID!, $name: String, $objectGroup: UUID) {
              logic {
                scenarioStep {
                  create (activity: $activity, version: $version, name: $name, objectGroup: $objectGroup) {
                    result {
                      vid
                    }
                  }
                }
              }
            }`,
    variables: {
      version,
      activity: activityId,
      objectGroup: objectsGroupId,
      name: 'Шаг',
    },
  };

  try {
    return await graphQlRequest({
      body: requestBody,
      appendProjectId: true,
      isMutation: true,
    });
  } catch (e) {
    return undefined;
  }
};

const updateScenarioStep = async (
  scenarioStepId: string,
  activityId: string,
  objectGroupId: string,
): Promise<CreateScenarioStepResponse | undefined> => {
  const version = getCurrentVersion();

  const requestBody: QueryBody = {
    query: `mutation($vid: UUID!, $version: Int!, $activity: UUID!, $objectGroup: UUID) {
              logic {
                scenarioStep {
                  update (vid: $vid, activity: $activity, version: $version, objectGroup: $objectGroup) {
                    result {
                      vid
                    }
                  }
                }
              }
            }`,
    variables: {
      vid: scenarioStepId,
      activity: activityId,
      objectGroup: objectGroupId,
      version,
    },
  };

  try {
    return await graphQlRequest({
      body: requestBody,
      appendProjectId: true,
      isMutation: true,
    });
  } catch (e) {
    return undefined;
  }
};

const addCanvasElement = (
  canvasDataTree: CanvasData,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState): Promise<void> => {
  const { groupObjects, activities } = getState();
  const { isDroppingOnExistingStep } = activities;

  if (isDroppingOnExistingStep) {
    dispatch(setIsDroppingOnExistingStep(false));

    return;
  }

  const objectsGroup = groupObjects.nodeList;
  const { Tree } = entities;
  const { position, width, stepData, type } = canvasDataTree;
  const nodeType = canvasNodeTypes[type];

  let nodeRef = null;

  if (nodeType === 'domainObject' && stepData?.events.length && objectsGroup?.length) {
    const scenarioStepData = await createScenarioStep(stepData.events[0].id, objectsGroup[0].id);

    if (scenarioStepData) {
      nodeRef = scenarioStepData.data.logic?.scenarioStep?.create?.result?.vid;
    }
  }

  const requestBody: QueryBody = {
    query: `mutation($nodeType: String!, $nodeRef: UUID, $version: Int!, $title: String, $vid: UUID,
              $width: Float, $x: Float, $y: Float) {
                logic {
                  canvas {
                    create (title: $title, width: $width, nodeType: $nodeType, nodeRef: $nodeRef, vid: $vid,
                      position: [$x, $y], version: $version) {
                        result {
                          vid
                        }
                      }
                  }
                }
              }`,
    variables: {
      title: stepData?.name,
      vid: stepData?.id,
      width,
      nodeType,
      nodeRef,
      version: getCurrentVersion(),
      x: position.x,
      y: position.y,
    },
  };

  const response = await graphQlRequest({
    body: requestBody,
    appendProjectId: true,
    isMutation: true,
  });

  if (response.data) {
    const canvasData: CanvasData = nodeRef
      ? ({
          ...canvasDataTree,
          stepData: { ...canvasDataTree.stepData, id: nodeRef },
        } as CanvasData)
      : canvasDataTree;

    const canvasElement = Tree.of<CanvasData>({
      id: stepData?.id,
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
  vegaApi.setLink(getProjectLink());
  vegaApi
    .query({
      query: FETCH_CANVAS_ITEMS_DATA,
    })
    .then(async (response) => {
      if (response.networkStatus === NetworkStatus.ready) {
        const { logic } = response.data;
        const { canvas, stepList } = logic;

        const getCanvasElements = (): CanvasTree[] => {
          let result: CanvasTree[] = [];
          const canvasElementsMap: { [key: string]: CanvasElement } = {};

          if (canvas) {
            (canvas as CanvasElements[]).forEach((item) => {
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
                  const step = (stepList as Step[]).find((element) => element.vid === item.nodeRef);
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
      const queryString = `position: [${updateData.changes.position?.x}, ${updateData.changes.position?.y}]`;

      await syncCanvasRequest(updateData.id, queryString);

      return;
    }

    if (updateData.type === 'change-multiple') {
      const multipleData = updateData.ids.map((id: string, index: number) => {
        const { position } = updateData.changes[index];

        const queryString = `position: [${position?.x}, ${position?.y}]`;

        return { id, queryString };
      });

      await multipleData.reduce((promise, update) => {
        return promise
          .then(() => syncCanvasRequest(update.id, update.queryString))
          .catch(console.error);
      }, Promise.resolve());
    }

    if (updateData.type === 'connect-tree' || updateData.type === 'disconnect-tree') {
      const { parentId, childId } = updateData;
      const child = {
        targetId: parentId,
        queryString: `childrenVids: $vids`,
        variables: {
          pattern: '$vids: [UUID]',
          vids: getCanvasTreeById(canvasElements, parentId)?.getChildren(),
        },
      };

      const parent = {
        targetId: childId,
        queryString: `parentVids: $vids`,
        variables: {
          pattern: '$vids: [UUID]',
          vids: getCanvasTreeById(canvasElements, childId)?.getParents(),
        },
      };

      await syncCanvasRequest(child.targetId, child.queryString, {
        variables: child.variables,
      })
        .then(() => {
          syncCanvasRequest(parent.targetId, parent.queryString, {
            variables: parent.variables,
          });
        })
        .catch(console.error);
    }

    if (updateData.type === 'add-tree') {
      const tree = getCanvasTreeById(canvasElements, updateData.id);

      if (tree) {
        const { type, position: pos, title } = tree.getData();
        const nodeType = type === 'step' ? 'domainObject' : type;
        const treeWidth = type === 'step' ? CANVAS_STEP_WIDTH : CANVAS_BASE_ELEMENTS_WIDTH;
        const queryString = `title: "${title}", nodeType: "${nodeType}", width: ${treeWidth}, position: [${pos.x},${pos.y}]`;
        await syncCanvasRequest(updateData.id, queryString, { method: 'create' });
      }
    }

    if (updateData.type === 'remove-trees') {
      const multipleData = updateData.ids.map((id: string): {
        id: string;
        options: { method: 'delete'; responseFields: string };
      } => {
        return { id, options: { method: 'delete', responseFields: '{ ok }' } };
      });

      await multipleData.reduce((promise, update) => {
        return promise
          .then(() => syncCanvasRequest(update.id, '', update.options))
          .catch(console.error);
      }, Promise.resolve());
    }
  };
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

    let stepData: StepData = {
      id: '0',
      name: 'Шаг 1',
      events: [
        {
          id: '0',
          name: 'Мероприятие',
          content: domainObjects || [],
        },
      ],
    };

    const treeData = tree?.getData();

    if (treeData?.stepData) {
      stepData = { ...treeData.stepData };

      const event = { ...stepData.events[0] };
      event.content = domainObjects || [];

      stepData.events[0] = event;
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

  const { logicConstructor, activities, groupObjects } = getState();
  const objectsGroup = groupObjects.nodeList;
  const { canvasElements } = logicConstructor;
  const { draggingElements, nodeList } = activities;

  if (draggingElements?.length && canvasElements && nodeList) {
    const tree = getCanvasTreeById(canvasElements, CanvasTreeId);
    const activity = getTreeNodeById(draggingElements[0].id, nodeList);
    const treeData = tree?.getData();

    if (!treeData?.stepData && activity?.id && objectsGroup?.length) {
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

      let nodeRef = null;

      const scenarioStepData = await createScenarioStep(activity?.id, objectsGroup[0].id);

      if (scenarioStepData) {
        nodeRef = scenarioStepData.data.logic?.scenarioStep?.create?.result?.vid;

        stepData.id = nodeRef || '0';
      }

      const queryString = `nodeRef: $nodeRef`;

      await syncCanvasRequest(CanvasTreeId, queryString, {
        variables: {
          pattern: '$nodeRef: UUID',
          nodeRef,
        },
      });

      tree?.setData({ stepData });

      return;
    }

    if (treeData?.stepData && activity?.id && objectsGroup?.length) {
      const { stepData: existStepData } = treeData;

      const response = await updateScenarioStep(existStepData.id, activity?.id, objectsGroup[0].id);

      if (!response) {
        return;
      }

      const events = [
        {
          id: activity.id,
          name: activity.name,
          content: [...existStepData.events[0].content],
        },
      ];

      tree?.setData({ stepData: { ...existStepData, events } });
    }
  }
};

const mapDropEventToRelatedAction = (
  intersectionId?: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState) => {
  const { groupObjects, activities } = getState();
  const { draggingElements: groupObjectsDraggingElements } = groupObjects;
  const { draggingElements: activitiesDraggingElements } = activities;

  if (!intersectionId) return;

  if (groupObjectsDraggingElements?.length) {
    dispatch(addGroupObjectsToCanvasElement(intersectionId));

    return;
  }

  if (activitiesDraggingElements?.length) {
    dispatch(addActivityToCanvasElement(intersectionId));
  }
};

export {
  syncCanvasState,
  setScenarioList,
  toggleStepEditor,
  addCanvasElement,
  setCanvasElements,
  createScenarioStep,
  fetchCanvasItemsData,
  mapDropEventToRelatedAction,
  addGroupObjectsToCanvasElement,
};
