import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { CanvasItemData, Step, StoreLC } from '../../types/redux-store';
import getHeaders from '../../utils/headers';

import { LogicConstructorActionTypes } from './action-types';

type SetScenarioList = {
  type: typeof LogicConstructorActionTypes.SET_CANVAS_ITEMS_DATA;
  scenarioList: Step[];
};

type SetCanvasItemsData = {
  type: typeof LogicConstructorActionTypes.SET_SCENARIO_LIST;
  canvasItemsData: CanvasItemData[];
};

const setScenarioList = (scenarioList: Step[]): SetScenarioList => ({
  type: LogicConstructorActionTypes.SET_SCENARIO_LIST,
  scenarioList,
});

const setCanvasItemsData = (canvasItemsData: CanvasItemData[]): SetCanvasItemsData => ({
  type: LogicConstructorActionTypes.SET_CANVAS_ITEMS_DATA,
  canvasItemsData,
});

const fetchScenarioList = (): ThunkAction<void, StoreLC, unknown, AnyAction> => async (
  dispatch,
): Promise<void> => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          `{logic { stepList {` +
          `vid,` +
          `name,` +
          `itemList {` +
          `activity {` +
          `vid,` +
          `name}` +
          `object {` +
          `...on LicensingRound_A_Type { ` +
          `vid,` +
          `name,` +
          `}}}}}}`,
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
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          `{ logic { canvas {` +
          `vid, title, position, nodeRef, nodeType, width,` +
          `children {` +
          `vid }` +
          `parents { ` +
          `vid}}}}`,
      }),
    });

    const body = await response.json();

    if (response.ok) {
      const { logic } = body.data;
      const { canvas } = logic;

      if (!canvas) {
        return;
      }

      dispatch(setCanvasItemsData(canvas));
    } else {
      console.log(body);
    }
  } catch (e) {
    console.error(e);
  }
};

// const syncCanvasState = ({
//   id,
//   chandes,
// }: {
//   id: string;
//   changes: any;
// }): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
//   try {
//     const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify({
//         query: `mutation { logic { canvas { update(vid: "${id}", position){ok} }}}`,
//       }),
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };

const createStep = (
  activityId: string,
  name: string,
): ThunkAction<void, StoreLC, unknown, AnyAction> => async (dispatch): Promise<void> => {
  try {
    const response = await fetch(`graphql/a3333333-b111-c111-d111-e00000000000`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query:
          `mutation { logic {` +
          `scenarioStep{` +
          `create(activity: "${activityId}", name: "${name}")` +
          `{ result {` +
          `vid,` +
          `name,` +
          `ok,` +
          `}}}}}`,
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

export { createStep, setScenarioList, fetchScenarioList, fetchCanvasItemsData };
