import { debounce } from '../../src/utils/debounce';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.clearAllTimers();
});

describe('Функция debounce', () => {
  test('Вызовет функцию только один раз, если интервалы между вызовами меньше, чем требуется', () => {
    const mockFunction = jest.fn();
    const testFunction = () => {
      mockFunction();
    };

    const debouncedTestFunction = debounce(testFunction, 500);

    debouncedTestFunction();
    debouncedTestFunction();
    debouncedTestFunction();

    jest.runOnlyPendingTimers();

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledTimes(3);
  });
});
