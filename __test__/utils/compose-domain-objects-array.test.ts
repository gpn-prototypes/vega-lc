import { TreeItem } from '@gpn-prototypes/vega-ui';
import _ from 'lodash';

import { composeDomainObjectsArray } from '../../src/utils/compose-domain-objects-array';

describe('Функция формирования доменных объектов в массиве', () => {
  const mockNodeList: TreeItem[] = [
    {
      id: '1',
      name: 'testing',
      nodeList: [
        {
          id: '2',
          name: 'testing',
          nodeList: [],
        },
        {
          id: '3',
          name: 'testing',
          nodeList: [],
        },
      ],
    },
  ];

  test('Корректно формирует массив с доменными объектами', () => {
    const inputIds = ['2', '3'];
    const resultArray = composeDomainObjectsArray(inputIds, mockNodeList);
    const outputIds = resultArray.map((obj) => obj.id);

    expect(resultArray.length).toBe(2);
    expect(_.isEqual(inputIds, outputIds)).toBe(true);
  });

  test('Вернет пустой массив, если элемент(ы) с переданным(и) ID не был(и) найден(ы)', () => {
    const inputIds = ['888', '999'];
    const resultArray = composeDomainObjectsArray(inputIds, mockNodeList);

    expect(resultArray.length).toBe(0);
    expect(resultArray).toEqual([]);
  });
});
