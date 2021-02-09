import { clearArrayFromDuplicates } from '../../src/utils/clear-array-from-duplicates';

describe('Функция удаления дублей из массивов', () => {
  test('Удаляет дубликаты строк', () => {
    const inputArray = ['1', '1', '2', '3'];

    const resultArray = clearArrayFromDuplicates(inputArray);

    expect(resultArray).toEqual(['1', '2', '3']);
  });

  test('Удаляет повторящие числа', () => {
    const inputArray = [1, 1, 2, 3, 3];

    const resultArray = clearArrayFromDuplicates(inputArray);

    expect(resultArray).toEqual([1, 2, 3]);
  });

  test('Удаляет дубликаты объектов', () => {
    const object = { test: 'test' };
    const duplicatedObject = object;

    const inputArray = [object, duplicatedObject];

    const resultArray = clearArrayFromDuplicates(inputArray);

    expect(resultArray.length).toBe(1);
    expect(resultArray.find((obj) => obj.test === 'test')).toBe(duplicatedObject);
  });

  test('Удаляет дубликаты массивов', () => {
    const array = ['test'];
    const duplicatedArray = array;

    const inputArray = [array, duplicatedArray];

    inputArray.push(array);
    inputArray.push(duplicatedArray);

    const resultArray = clearArrayFromDuplicates(inputArray);

    expect(resultArray.length).toBe(1);
    expect(resultArray).toContain(duplicatedArray);
  });
});
