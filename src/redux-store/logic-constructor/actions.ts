import { CanvasTree } from '@gpn-prototypes/vega-canvas/dist/src/types';
import { CanvasData, CanvasUpdate, entities } from '@gpn-prototypes/vega-ui';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';

import client, { projectLink } from '../../client';
import { Logic, Mutation, Query } from '../../generated/graphql-project';
import { CanvasElement, CanvasElements, Step, StoreLC } from '../../types/redux-store';
import debounce from '../../utils/debounce';

import { LogicConstructorActionTypes } from './action-types';
import { ADD_CANVAS_ELEMENT, CREATE_STEP, SYNC_CANVAS_STATE } from './mutations';
import { FETCH_CANVAS_ITEMS_DATA, FETCH_SCENARIO_LIST } from './queries';

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

  client.setLink(projectLink);

  client
    .mutate<Mutation>({
      mutation: ADD_CANVAS_ELEMENT,
      variables: {
        title,
        width,
        id,
        x: position.x,
        y: position.y,
      },
    })
    .then(() => {
      const canvasElement = Tree.of<CanvasData>({ id, data: canvasDataTree });

      dispatch({
        type: LogicConstructorActionTypes.ADD_CANVAS_ELEMENT,
        canvasElement,
      });
    })
    .catch((error) => {
      console.error(error);
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

        reject();
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
            reject();
          }

          resolve(stepList as Step[]);
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

  type updatePositionVars = { position: number[] };
  type updateChildrenVars = { childrenVids: string[] };

  const getVariables = (): updateChildrenVars | updatePositionVars | undefined => {
    if (updateData.type === 'change' && 'position' in updateData.changes) {
      if (!updateData.changes.position) return undefined;

      return { position: [updateData.changes.position?.x, updateData.changes.position?.y] };
    }

    if (updateData.type === 'update-children') {
      const tree = getTreeById(updateData.id);
      if (!tree) return undefined;

      return { childrenVids: tree.getChildren() };
    }

    return undefined;
  };

  const variables = getVariables();

  if ('id' in updateData && variables) {
    client.setLink(projectLink);
    client
      .mutate<Mutation>({
        mutation: SYNC_CANVAS_STATE,
        variables: {
          vid: updateData.id,
          ...variables,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const createStep = (
  activityId: string,
  name: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  client.setLink(projectLink);

  client
    .mutate<Mutation>({
      mutation: CREATE_STEP,
      variables: { activityId, name },
    })
    .then(() => {
      dispatch(fetchScenarioList());
    })
    .catch((error) => {
      console.error(error);
    });
};

export { createStep, setScenarioList, fetchScenarioList, fetchCanvasItemsData, syncCanvasState };
