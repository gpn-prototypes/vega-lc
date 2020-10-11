import {
  CanvasElement,
  CanvasItemData,
  LogicConstructorState,
  Step,
  StoreLC,
} from '../../types/redux-store';

const getCurrentState = (state: StoreLC): LogicConstructorState => state.logicConstructor;

export const getScenarioList = (state: StoreLC): Step[] | undefined =>
  getCurrentState(state).scenarioList;

export const getCanvasItemsData = (state: StoreLC): CanvasItemData[] | undefined =>
  getCurrentState(state).canvasItemsData;

export const getCanvasElements = (state: StoreLC): CanvasElement[] => {
  const canvasItems = getCanvasItemsData(state);

  const canvasElementsMap: { [key: string]: CanvasElement } = {};

  if (canvasItems) {
    // const stepsIds = steps?.map((step) => step.vid);

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
      }
    });
  }

  return Object.values(canvasElementsMap);
};
