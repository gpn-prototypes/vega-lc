import { Dispatch } from 'react';

import { createInitState } from '../testing-helpers/create-init-state';

import { getStore } from '@/redux-store';
import {
  setActivitiesDraggingElements,
  setActivitiesList,
  setActivitiesPanelOpen,
  setIsAutoFocus,
  setIsDroppingOnExistingStep,
  setSearchString,
} from '@/redux-store/activities/actions';
import initialState from '@/redux-store/activities/initial-state';
import { clearStores } from '@/redux-store/clear/actions';

describe('activities reducer test', () => {
  const mockState = {
    activities: {
      isActivitiesPanelOpen: true,
      nodeList: [
        {
          name: 'mock',
          id: '1',
          nodeList: [
            {
              name: 'mock-2',
              id: '2',
              nodeList: [],
            },
          ],
        },
      ],
      searchString: 'test string',
      autoFocus: true,
      draggingElements: [
        {
          ref: null,
          id: 'drag element id',
          isDraggable: true,
        },
      ],
      isDroppingOnExistingStep: false,
    },
  };

  test('устанавливается заполненный список активностей', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    const action = setActivitiesList(mockState.activities.nodeList);
    store.dispatch(action);
    expect(store.getState().activities.nodeList).toEqual(mockState.activities.nodeList);
  });

  test('устанавливается пустой список активностей', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    const action = setActivitiesList([]);

    store.dispatch(action);
    expect(store.getState().activities.nodeList).toEqual([]);
  });

  test('устанавливается параметр isDroppingOnExistingStep', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    const action = setIsDroppingOnExistingStep(true);

    store.dispatch(action);
    expect(store.getState().activities.isDroppingOnExistingStep).toBe(true);
  });

  test('устанавливается строка поиска', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    setSearchString(mockState.activities.searchString)(
      store.dispatch as Dispatch<unknown>,
      store.getState,
    );
    expect(store.getState().activities.searchString).toBe(mockState.activities.searchString);
  });

  test('устанавливается список dragging elements', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    const action = setActivitiesDraggingElements(mockState.activities.draggingElements);
    store.dispatch(action);
    expect(store.getState().activities.draggingElements).toEqual(
      mockState.activities.draggingElements,
    );
  });

  test('устанавливается параметр isActivitiesPanelOpen', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    const action = setActivitiesPanelOpen(false);
    store.dispatch(action);
    expect(store.getState().activities.isActivitiesPanelOpen).toBe(false);
  });

  test('устанавливается autofocus', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);
    const action = setIsAutoFocus(mockState.activities.autoFocus);
    store.dispatch(action);
    expect(store.getState().activities.autoFocus).toBe(mockState.activities.autoFocus);
  });

  test('очищается store', () => {
    const initState = createInitState(mockState);

    const store = getStore(initState);

    const hideActivitiesPanel = setActivitiesPanelOpen(false);
    store.dispatch(hideActivitiesPanel);

    const action = clearStores();
    store.dispatch(action);
    expect(store.getState().activities).toEqual({ ...initialState, isActivitiesPanelOpen: false });
  });
});
