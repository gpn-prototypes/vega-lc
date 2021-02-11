import each from 'jest-each';

import { clearArrayFromDuplicates } from '../../src/utils/clear-array-from-duplicates';

describe('Функция удаления дублей из массивов', () => {
  test('Удаляет дубликаты строк', () => {
    const inputArray = ['1', '1', '2', '3'];

    const resultArray = clearArrayFromDuplicates(inputArray);

    expect(resultArray).toEqual(['1', '2', '3']);
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

describe('Удаление числовых дубликатов', () => {
  const expected = [1, 2, 3];

  each([
    [[1, 1, 2, 3, 3], expected],
    [[1, 2, 2, 3, 3], expected],
    [[1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3], expected],
  ]).it("Когда исходный массив '%s'", (input) => {
    expect(clearArrayFromDuplicates(input)).toStrictEqual(expected);
  });
});
