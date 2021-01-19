import { clearStores } from '../../src/redux-store/clear/actions';
import { deleteNotification, setNotification } from '../../src/redux-store/notifications/actions';
import initialState from '../../src/redux-store/notifications/initial-state';
import notificationsReducer from '../../src/redux-store/notifications/reducer';
import { NotificationState } from '../../src/types/redux-store';

describe('project structure reducer test', () => {
  let mockState: NotificationState;

  const mockNotification = {
    message: 'mock message',
  };

  beforeEach(() => {
    mockState = {
      ...initialState,
      list: [mockNotification],
    };
  });

  test('добавляется нотификация', () => {
    const action = setNotification(mockNotification);
    const newState = notificationsReducer(initialState, action);
    expect(newState.list).toContainEqual(mockNotification);
  });

  test('удаляется нотификация', () => {
    const action = deleteNotification(0);
    const newState = notificationsReducer(mockState, action);
    expect(newState.list).not.toContainEqual(mockNotification);
  });

  test('очищается store', () => {
    const action = clearStores();
    const newState = notificationsReducer(mockState, action);
    expect(newState).toEqual(initialState);
  });
});
