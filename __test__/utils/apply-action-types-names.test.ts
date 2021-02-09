import { applyActionTypesNames } from '../../src/utils/apply-action-types-names';

describe('Функция для формирования названий redux-actions', () => {
  test('Корректно формируются названия', () => {
    const mockActionTypes: { [x: string]: string } = {
      FIRST: '',
      SECOND: '',
      THIRD: '',
    };

    applyActionTypesNames(mockActionTypes, 'TEST');

    expect(mockActionTypes.FIRST).toEqual('TEST_FIRST');
    expect(mockActionTypes.SECOND).toEqual('TEST_SECOND');
    expect(mockActionTypes.THIRD).toEqual('TEST_THIRD');
  });
});
