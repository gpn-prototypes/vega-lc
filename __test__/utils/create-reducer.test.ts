import createReducer from '../../src/utils/create-reducer';

describe('Функция createReducer формирующая reducer-функцию', () => {
  test('Создает reducer и вызывает соответствующую типу экшена функцию-стратегию', () => {
    const func = jest.fn();

    const testAction = {
      type: 'TEST_ACTION',
    };

    const testStrategy = (...args: any) => {
      func(args);
    };

    const strategyMap = {
      [testAction.type]: testStrategy,
    };

    const testingReducer = createReducer(strategyMap, {});

    testingReducer({}, testAction);

    expect(func).toHaveBeenLastCalledWith([{}, testAction]);
    expect(func).toHaveBeenCalledTimes(1);

    testingReducer({}, { type: 'WRONG_TEST_ACTION' });

    expect(func).toHaveBeenCalledTimes(1);
  });
});
