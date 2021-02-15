import each from 'jest-each';

import { clearArrayFromDuplicates } from '../../src/utils/clear-array-from-duplicates';

describe('Функция удаления дублей из массивов', () => {
  each([
    [
      [[111.111, 111.111, 111.111], [111.111]],
      [
        [1, 0, 0, 0, 0, 0],
        [1, 0],
      ],
      [
        [0.3, 1234, 1234, 1234.01, 0.2, 0.3],
        [0.3, 1234, 1234.01, 0.2],
      ],
    ],
    [
      ['test', '111.111', '111.111', 'test'],
      ['test', '111.111'],
    ],
    [
      ['1', '0', '0', '0', '0', '0'],
      ['1', '0'],
    ],
    [
      ['0.3', '1234', '1234', '1234.01', '0.2', '0.3'],
      ['0.3', '1234', '1234.01', '0.2'],
    ],
  ]).test("Удаляет дубликаты строк и чисел из массива '%s'", (input, expected) => {
    expect(clearArrayFromDuplicates(input)).toStrictEqual(expected);
  });

  describe('Удаляет дубликаты объектов', () => {
    const object = { test: 'test' };
    const duplicatedObject = object;
    const anotherDuplicate = duplicatedObject;

    each([
      [[object, object, object], [object]],
      [[object, duplicatedObject, anotherDuplicate], [object]],
    ]).test('Из массива "%s', (input: { test: string }[]) => {
      expect(clearArrayFromDuplicates(input).length).toBe(1);
      expect(clearArrayFromDuplicates(input).find((obj) => obj.test === 'test')).toBe(object);
    });
  });

  describe('Удаляет дубликаты массивов', () => {
    const array = ['test'];
    const duplicatedArray = array;
    const anotherDuplicate = duplicatedArray;

    each([
      [[array, array, array], [array]],
      [[array, duplicatedArray, anotherDuplicate], [anotherDuplicate]],
    ]).test('Из массива "%s"', (input) => {
      expect(clearArrayFromDuplicates(input).length).toBe(1);
      expect(clearArrayFromDuplicates(input)).toContain(array);
    });
  });
});
