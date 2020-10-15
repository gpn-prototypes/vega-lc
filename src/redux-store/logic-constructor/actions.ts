import { CanvasTree } from '@gpn-prototypes/vega-canvas/dist/src/types';
import { CanvasData, CanvasUpdate, entities } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';

import { CanvasElement, CanvasElements, Step, StoreLC } from '../../types/redux-store';
import debounce from '../../utils/debounce';
import getHeaders from '../../utils/headers';

import { LogicConstructorActionTypes } from './action-types';

const BASE_CANVAS_ELEMENTS_WIDTH = 65;
const SET_CANVAS_ELEMENTS_DEBOUNCE_TIME = 500;

type SetScenarioList = {
  type: typeof LogicConstructorActionTypes.SET_SCENARIO_LIST;
  scenarioList: Step[];
};

type SetCanvasElements = {
  type: typeof LogicConstructorActionTypes.SET_CANVAS_ELEMENTS;
  canvasElements: CanvasTree[];
};

// type AddCanvasElement = {
//   type: typeof LogicConstructorActionTypes.ADD_CANVAS_ELEMENT;
//   canvasElement: CanvasTree | [];
// };

const setScenarioList = (scenarioList: Step[]): SetScenarioList => ({
  type: LogicConstructorActionTypes.SET_SCENARIO_LIST,
  scenarioList,
});

export const setCanvasElements = (canvasElements: CanvasTree[]): SetCanvasElements => ({
  type: LogicConstructorActionTypes.SET_CANVAS_ELEMENTS,
  canvasElements,
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

export const addCanvasElement = (
  canvasDataTree: CanvasData,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  const { Tree } = entities;

  const id = uuidv4();
  const { position, title, width } = canvasDataTree;

  const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      query: `mutation { logic { canvas {
         create (title: "${title}", width: ${width}, nodeType: "domainObject", vid: "${id}", position: [${position.x}, ${position.y}]) {
         result {
        vid }}}}}`,
    }),
  });

  if (response.ok) {
    const canvasElement = Tree.of<CanvasData>({ id, data: canvasDataTree });

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

        reject();
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
            reject();
          }

          resolve(stepList);
        }

        reject();
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
              childrenIds: item.children?.forEach((child) => child.vid) || [],
              parentIds: item.parents?.forEach((parent) => parent.vid) || [],
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
              canvasElementsMap[item.vid].data.width = item.width;
            } else {
              canvasElementsMap[item.vid].data.width = BASE_CANVAS_ELEMENTS_WIDTH;
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
  currentState: CanvasTree[],
  updateData: CanvasUpdate,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  const getTreeById = (id: string): CanvasTree | undefined =>
    currentState.find((tree) => {
      const treeId = tree.getId();

      return treeId === id;
    });

  const getQueryString = (): string | undefined => {
    if (updateData.type === 'change' && 'position' in updateData.changes) {
      return `position: [${updateData.changes.position?.x}, ${updateData.changes.position?.y}]`;
    }

    if (updateData.type === 'update-children') {
      return `childrenVids: ${getTreeById(updateData.id)?.getChildren()}`;
    }

    return undefined;
  };

  const queryString: string | undefined = getQueryString();

  if ('id' in updateData && queryString) {
    try {
      const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          query: `mutation { logic { canvas { update(vid: "${updateData.id}", ${queryString}){result { vid }} }}}`,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        console.log(body);
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const createStep = (
  activityId: string,
  name: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: `mutation { logic {
          scenarioStep{
          create(activity: "${activityId}", name: "${name}")
          { result {
          vid,
          name,
          ok,
          }}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      dispatch(fetchScenarioList());
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

export { createStep, setScenarioList, fetchScenarioList, fetchCanvasItemsData, syncCanvasState };
