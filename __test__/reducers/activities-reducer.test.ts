import { ActivitiesActionTypes } from '../../src/redux-store/activities/action-types';
import {
  setActivitiesDraggingElements,
  setActivitiesList,
  setActivitiesPanelOpen,
  setIsAutoFocus,
  setIsDroppingOnExistingStep,
} from '../../src/redux-store/activities/actions';
import initialState from '../../src/redux-store/activities/initial-state';
import activitiesReducer from '../../src/redux-store/activities/reducer';
import { clearStores } from '../../src/redux-store/сlear/actions';
import { ActivitiesState } from '../../src/types/redux-store';

describe('activities reducer test', () => {
  let mockState: ActivitiesState;

  beforeEach(() => {
    mockState = {
      ...initialState,
      nodeList: [
        {
          name: 'mock',
          id: '1',
          nodeList: [],
        },
      ],
      draggingElements: [
        {
          ref: null,
          id: 'mock id',
          isDraggable: true,
        },
      ],
      autoFocus: true,
      searchString: 'search',
      isActivitiesPanelOpen: false,
      isDroppingOnExistingStep: true,
    };
  });

  test('устанавливается пустой список активностей', () => {
    const action = setActivitiesList([]);
    const newState = activitiesReducer(undefined, action);
    expect(newState.nodeList).toEqual([]);
  });

  test('устанавливается заполненный список активностей', () => {
    const action = setActivitiesList(mockState.nodeList);
    const newState = activitiesReducer({ nodeList: 'unexpected data type' }, action);
    expect(newState.nodeList).toEqual(mockState.nodeList);
  });

  test('устанавливается список dragging elements', () => {
    const action = setActivitiesDraggingElements(mockState.draggingElements);
    const newState = activitiesReducer(initialState, action);
    expect(newState.draggingElements).toEqual(mockState.draggingElements);
  });

  test('устанавливается параметр isActivitiesPanelOpen', () => {
    const action = setActivitiesPanelOpen(false);
    const newState = activitiesReducer(initialState, action);
    expect(newState.isActivitiesPanelOpen).toBe(false);
  });

  test('устанавливается autofocus', () => {
    const action = setIsAutoFocus(mockState.autoFocus);
    const newState = activitiesReducer(initialState, action);
    expect(newState.autoFocus).toBe(mockState.autoFocus);
  });

  test('устанавливается строка поиска', () => {
    const action = {
      type: ActivitiesActionTypes.SET_SEARCH_STRING,
      searchString: mockState.searchString,
    };
    const newState = activitiesReducer(initialState, action);
    expect(newState.searchString).toBe(mockState.searchString);
  });

  test('устанавливается параметр isDroppingOnExistingStep', () => {
    const action = setIsDroppingOnExistingStep(true);
    const newState = activitiesReducer(initialState, action);
    expect(newState.isDroppingOnExistingStep).toBe(mockState.isDroppingOnExistingStep);
  });

  test('очищается store', () => {
    const clearAction = clearStores();
    const newState = activitiesReducer(mockState, clearAction);
    expect(newState).toEqual({ ...initialState, isActivitiesPanelOpen: false });
  });
});
