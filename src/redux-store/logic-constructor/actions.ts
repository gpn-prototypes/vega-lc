import { CanvasData, CanvasTree, CanvasUpdate, entities } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CanvasElement, CanvasElements, Step, StepData, StoreLC } from '../../types/redux-store';
import { canvasNodeTypes } from '../../utils/constants/canvas-node-types';
import debounce from '../../utils/debounce';
import { getCanvasTreeById } from '../../utils/get-canvas-tree-by-id';
import { getTreeNodeById } from '../../utils/get-tree-node-by-id';
import getHeaders from '../../utils/headers';
import { syncCanvasRequest } from '../../utils/sync-canvas-request-body';
import { getCurrentVersion, incrementVersion } from '../../utils/version';

import { LogicConstructorActionTypes } from './action-types';

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

const addCanvasElement = (
  canvasDataTree: CanvasData,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  const { Tree } = entities;

  const { position, width, stepData, type } = canvasDataTree;

  const nodeType = canvasNodeTypes[type];

  const version = getCurrentVersion();

  const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      query: `mutation { logic { canvas {
         create (title: "${stepData?.name}", width: ${width}, nodeType: "${nodeType}", vid: "${stepData?.id}", position: [${position.x}, ${position.y}], version: ${version}) {
         result {
        vid }}}}}`,
    }),
  });

  if (response.ok) {
    incrementVersion();

    const canvasElement = Tree.of<CanvasData>({
      id: stepData?.id,
      data: canvasDataTree,
    });

    dispatch({
      type: LogicConstructorActionTypes.ADD_CANVAS_ELEMENT,
      canvasElement,
    });
  }
};

const fetchScenarioList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `{logic { stepList {
          vid,
          name,
          itemList {
          activity {
          vid,
          name}
          object {
          ...on LicensingRound_A_Type {
          vid,
          name,
          }}}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { logic } = body.data;
      const { stepList } = logic;

      if (!stepList) {
        return;
      }

      dispatch(setScenarioList(stepList));
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

const fetchCanvasItemsData = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  const canvasItemsPromise = new Promise<CanvasElements[]>((resolve, reject) => {
    fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `{ logic { canvas {
          vid, title, position, nodeRef, nodeType, width,
          children {
          vid }
          parents {
          vid}}}}`,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const body = await response.json();
          const { logic } = body.data;
          const { canvas } = logic;

          resolve(canvas);
        }

        reject(response);
      })
      .catch(reject);
  });

  const scenarioListPromise = new Promise<Step[]>((resolve, reject) => {
    fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `{logic { stepList {
          vid,
          name,
          itemList {
          activity {
          name}
          object {
          ...on LicensingRound_A_Type {
          vid,
          name,
          }}}}}}`,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          const body = await response.json();

          const { logic } = body.data;
          const { stepList } = logic;

          if (!stepList) {
            reject(response);
          }

          resolve(stepList);
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
          vids: getCanvasTreeById(canvasElements, parentId)?.getChildren(),
        },
      };

      const parent = {
        targetId: childId,
        queryString: `parentVids: $vids`,
        variables: {
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

    const stepData: StepData = {
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

    if (tree) {
      tree.setData({ stepData });
    }
  }
};

const createStep = (
  activityId: string,
  name: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  try {
    const version = getCurrentVersion();
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `mutation { logic {
          scenarioStep{
          create(activity: "${activityId}", name: "${name}", version: ${version})
          { result {
          vid,
          name,
          ok,
          }}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      incrementVersion();

      dispatch(fetchScenarioList());
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

export {
  createStep,
  syncCanvasState,
  setScenarioList,
  toggleStepEditor,
  addCanvasElement,
  setCanvasElements,
  fetchScenarioList,
  fetchCanvasItemsData,
  addGroupObjectsToCanvasElement,
};
