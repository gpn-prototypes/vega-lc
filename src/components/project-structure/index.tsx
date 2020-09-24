import React from 'react';
import { Tree, TreeItem } from '@gpn-prototypes/vega-tree';

import { BlueLineSvg, OrangeLineSvg, RedLineSvg } from './icons';

const rootProps: TreeItem[] = [
  {
    name: 'Усть-Енисей',
    isDraggable: false,
    iconId: 'blue-line',
    id: '1',
    nodeList: [
      {
        name: 'Поднятие 44-23',
        iconId: 'orange-line',
        id: '2',
        isDraggable: false,
        nodeList: [
          {
            name: 'Залежь - 78',
            iconId: 'blue-line',
            id: '10',
            nodeList: [
              {
                name: 'Ловушка 100',
                iconId: 'red-line',
                id: '21',
                nodeList: [
                  {
                    name: 'Еще что-нибудь',
                    id: '12',
                    nodeList: [],
                  },
                ],
              },
            ],
          },
          {
            name: 'Залежь - 79',
            iconId: 'blue-line',
            id: '30',
            nodeList: [
              {
                name: 'Ловушка 101',
                iconId: 'red-line',
                id: '17',
                nodeList: [],
              },
            ],
          },
          {
            name: 'Залежь - 56',
            iconId: 'blue-line',
            id: '11',
            nodeList: [],
          },
          {
            name: 'Залежь - 11',
            iconId: 'blue-line',
            id: '20',
            nodeList: [],
          },
          {
            name: 'Залежь - 1',
            iconId: 'blue-line',
            id: '9',
            nodeList: [],
          },
        ],
      },
      {
        name: 'Поднятие 55-100',
        iconId: 'orange-line',
        id: '3',
        isDraggable: false,
        nodeList: [
          {
            name: 'Залежь - 78',
            iconId: 'blue-line',
            id: '7',
            nodeList: [],
          },
          {
            name: 'Залежь - 79',
            iconId: 'blue-line',
            id: '17',
            nodeList: [],
          },
          {
            name: 'Залежь - 56',
            iconId: 'blue-line',
            id: '24',
            nodeList: [],
          },
          {
            name: 'Залежь - 11',
            iconId: 'blue-line',
            id: '25',
            nodeList: [],
          },
          {
            name: 'Залежь - 1',
            iconId: 'blue-line',
            id: '26',
            nodeList: [],
          },
        ],
      },
      {
        name: 'Поднятие 23-32',
        iconId: 'orange-line',
        isDraggable: false,
        id: '4',
        nodeList: [
          {
            name: 'Залежь - 44',
            iconId: 'blue-line',
            id: '27',
            nodeList: [],
          },
          {
            name: 'Залежь - 79',
            iconId: 'blue-line',
            id: '31',
            nodeList: [],
          },
          {
            name: 'Залежь - 45',
            iconId: 'blue-line',
            id: '32',
            nodeList: [],
          },
          {
            name: 'Залежь - 46',
            iconId: 'blue-line',
            id: '33',
            nodeList: [
              {
                name: 'Ловушка - 1',
                iconId: 'red-line',
                id: '41',
                nodeList: [
                  {
                    name: 'Данные по Ловушка - 1',
                    id: '34',
                    nodeList: [],
                  },
                ],
              },
              {
                name: 'Ловушка - 2',
                iconId: 'red-line',
                id: '43',
                nodeList: [],
              },
              {
                name: 'Ловушка - 3',
                iconId: 'red-line',
                id: '44',
                nodeList: [],
              },
              {
                name: 'Ловушка - 4',
                iconId: 'red-line',
                id: '45',
                nodeList: [],
              },
              {
                name: 'Ловушка - 5',
                iconId: 'red-line',
                id: '46',
                nodeList: [],
              },
            ],
          },
          {
            name: 'Залежь - 1',
            iconId: 'blue-line',
            id: '47',
            nodeList: [],
          },
        ],
      },
    ],
  },
];

const icons = {
  'blue-line': BlueLineSvg,
  'orange-line': OrangeLineSvg,
  'red-line': RedLineSvg,
};

export const ProjectStructureWidget = (): React.ReactElement => {
  return <Tree icons={icons} isContextMenuEnable nodeList={rootProps} />;
};
