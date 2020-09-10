import React from 'react';
import { NodeItem, Tree } from '@gpn-prototypes/vega-tree';

const RedFolder = (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 0.5C0.447715 0.5 0 0.947715 0 1.5V9.5C0 10.0523 0.447715 10.5 1 10.5H11C11.5523 10.5 12 10.0523 12 9.5V2.5C12 1.94772 11.5523 1.5 11 1.5H5C5 0.947715 4.55228 0.5 4 0.5H1Z"
      fill="#FE4343"
    />
  </svg>
);

const BlueFolder = (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 0.5C0.447715 0.5 0 0.947715 0 1.5V9.5C0 10.0523 0.447715 10.5 1 10.5H11C11.5523 10.5 12 10.0523 12 9.5V2.5C12 1.94772 11.5523 1.5 11 1.5H5C5 0.947715 4.55228 0.5 4 0.5H1Z"
      fill="#0AA5FF"
    />
  </svg>
);

const GreenFolder = (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 0.5C0.447715 0.5 0 0.947715 0 1.5V9.5C0 10.0523 0.447715 10.5 1 10.5H11C11.5523 10.5 12 10.0523 12 9.5V2.5C12 1.94772 11.5523 1.5 11 1.5H5C5 0.947715 4.55228 0.5 4 0.5H1Z"
      fill="#22C38E"
    />
  </svg>
);

const events: Array<NodeItem> = [
  {
    name: 'Разведка',
    iconId: 'red-folder',
    isDraggable: false,
    nodeList: [
      {
        name: 'Аэромагнитная съёмка',
      },
      {
        name: 'Гравиметрическая съёмка',
      },
      {
        name: 'Сейсмика',
      },
      {
        name: 'Гравиразведка',
      },
    ],
  },
  {
    name: 'Обустройство',
    iconId: 'blue-folder',
    isDraggable: false,
    nodeList: [
      {
        name: 'Разбивочные работы',
      },
      {
        name: 'Геодезический контроль точности',
      },
      {
        name: 'Дороги (временные)',
      },
      {
        name: 'Площадки (временные)',
      },
      {
        name: 'Рельсовые подкрановые пути',
      },
      {
        name: 'Дороги',
      },
      {
        name: 'Площадки',
      },
      {
        name: 'Механизированная разработка грунта ',
      },
      {
        name: 'Уплотнение грунта катками',
      },
      {
        name: 'Механизированное рыхление',
      },
      {
        name: 'Бурение',
      },
      {
        name: 'Тампонажные работы',
      },
    ],
  },
  {
    name: 'Программа ОПР',
    iconId: 'green-folder',
    isDraggable: false,
    nodeList: [],
  },
];

const icons = {
  'blue-folder': BlueFolder,
  'green-folder': GreenFolder,
  'red-folder': RedFolder,
};

export const ActivitiesWidget = (): React.ReactElement => {
  return (
    <Tree
      icons={icons}
      withVisibilitySwitcher={false}
      nodeList={events}
      isShownLeftLines={false}
    />
  );
};
