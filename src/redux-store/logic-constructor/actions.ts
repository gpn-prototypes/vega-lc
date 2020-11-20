import { CanvasData, CanvasTree, CanvasUpdate, entities } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import client, { projectLink } from '../../client';
import { Logic, Mutation, Query } from '../../generated/graphql-project';
import { CanvasElement, CanvasElements, Step, StepData, StoreLC } from '../../types/redux-store';
import { canvasNodeTypes } from '../../utils/constants/canvas-node-types';
import { debounce } from '../../utils/debounce';
import { getCanvasTreeById } from '../../utils/get-canvas-tree-by-id';
import { getTreeNodeById } from '../../utils/get-tree-node-by-id';
import { graphQlRequest, QueryBody } from '../../utils/graphql-request';
import { syncCanvasRequest } from '../../utils/sync-canvas-request-body';
import { getCurrentVersion } from '../../utils/version';

import { LogicConstructorActionTypes } from './action-types';
import { ADD_CANVAS_ELEMENT, CREATE_STEP } from './mutations';
import { FETCH_CANVAS_ITEMS_DATA, FETCH_SCENARIO_LIST } from './queries';

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

let debouncedSetCanvasElements: Function;
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
): Promise<Mutation | undefined> => {
  const version = getCurrentVersion();

  const requestBody: QueryBody = {
    query: CREATE_STEP,
    variables: {
      version,
      activity: activityId,
      objectGroup: objectsGroupId,
      name: 'Новый шаг',
    },
  };

  try {
    const response = await graphQlRequest({
      body: requestBody,
      appendProjectId: true,
      isMutation: true,
    });

    return response as Mutation;
  } catch (e) {
    return undefined;
  }
};

const addCanvasElement = (
  canvasDataTree: CanvasData,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch, getState): Promise<void> => {
  // const objectsGroup = getState().groupObjects.nodeList;
  const { Tree } = entities;
  const { position, width, stepData, type } = canvasDataTree;
  const nodeType = canvasNodeTypes[type];
  const version = getCurrentVersion();

  // let nodeRef = null;

  // if (nodeType === 'domainObject' && stepData?.events.length && objectsGroup?.length) {
  //   const scenarioStepData = await createScenarioStep(stepData.events[0].id, objectsGroup[0].id);
  //
  //   if (scenarioStepData) {
  //     nodeRef = scenarioStepData.vid;
  //   }
  // }

  const requestBody: QueryBody = {
    query: ADD_CANVAS_ELEMENT,
    variables: {
      title: stepData?.name,
      vid: stepData?.id,
      width,
      nodeType,
      version,
      x: position.x,
      y: position.y,
    },
  };

  graphQlRequest({
    body: requestBody,
    appendProjectId: true,
    isMutation: true,
  })
    .then(() => {
      // const a = await response.json();
      // console.log(a);

      const canvasElement = Tree.of<CanvasData>({
        id: stepData?.id,
        data: canvasDataTree,
      });

      dispatch({
        type: LogicConstructorActionTypes.ADD_CANVAS_ELEMENT,
        canvasElement,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const fetchScenarioList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client.setLink(projectLink);

  client
    .query<Query>({
      query: FETCH_SCENARIO_LIST,
      fetchPolicy: 'network-only',
    })
    .then((response) => {
      if (!response.loading) {
        const stepList = (response.data.logic as Logic)?.stepList;

        if (stepList) {
          dispatch(setScenarioList(stepList as Step[]));
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const fetchCanvasItemsData = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  client.setLink(projectLink);
  const canvasItemsPromise = new Promise<CanvasElements[]>((resolve, reject) => {
    client
      .query<Query>({
        query: FETCH_CANVAS_ITEMS_DATA,
        fetchPolicy: 'network-only',
      })
      .then(async (response) => {
        if (!response.loading) {
          const canvas = (response.data.logic as Logic)?.canvas;

          if (canvas) {
            resolve(canvas as CanvasElements[]);
          } else {
            reject();
          }
        }

        reject(response);
      })
      .catch(reject);
  });

  const scenarioListPromise = new Promise<Step[]>((resolve, reject) => {
    client
      .query<Query>({
        query: FETCH_SCENARIO_LIST,
        fetchPolicy: 'network-only',
      })
      .then(async (response) => {
        if (!response.loading) {
          const stepList = (response.data.logic as Logic)?.stepList;

          if (!stepList) {
            reject(response);
          }

          resolve(stepList as Step[]);
        }

        reject(response);
      })
      .catch(reject);
  });

  const promises: [Promise<CanvasElements[]>, Promise<Step[]>] = [
    canvasItemsPromise,
    scenarioListPromise,
  ];

  try {
    const [canvasItems, scenarioList] = await Promise.all(promises);

    console.log(scenarioList);

    const getCanvasElements = (): CanvasTree[] => {
      let result: CanvasTree[] = [];
      const canvasElementsMap: { [key: string]: CanvasElement } = {};

      if (canvasItems) {
        canvasItems.forEach((item) => {
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
              canvasElementsMap[item.vid].data.width = CANVAS_STEP_WIDTH;
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
  } catch (e) {
    console.error(e);
  }
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

  if (canvasElements && nodeList && draggingElements) {
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

export {
  syncCanvasState,
  setScenarioList,
  toggleStepEditor,
  addCanvasElement,
  setCanvasElements,
  fetchScenarioList,
  createScenarioStep,
  fetchCanvasItemsData,
  addGroupObjectsToCanvasElement,
};
