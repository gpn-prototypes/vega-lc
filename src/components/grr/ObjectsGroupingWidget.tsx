import React from 'react';
import { NodeItem, Tree } from '@gpn-prototypes/vega-tree';

const SquareSvg = (
  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1.5V2.5H1V1.5L2 1.5V0.5H1H0V1.5ZM10 1.5V0.5H9H8V1.5L9 1.5V2.5H10V1.5ZM0 8.5V9.5V10.5H1H2L2 9.5H1L1 8.5H0ZM9 10.5H8V9.5H9V8.5H10V9.5V10.5H9ZM4 1.5V0.5H6V1.5L4 1.5ZM10 4.5H9V6.5H10V4.5ZM1 6.5H0V4.5H1L1 6.5ZM6 10.5V9.5H4V10.5H6Z"
      fill="#57BCFF"
    />
  </svg>
);

const CircleSvg = (
  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5.5" r="4.5" stroke="#57BCFF" strokeDasharray="2 2" />
  </svg>
);

const group: Array<NodeItem> = [
  {
    name: 'Фаза-1',
    isDraggable: false,
    iconId: 'square',
    id: 1,
    nodeList: [
      {
        name: 'Залежь - АС10',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС11',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС12',
        iconId: 'circle',
      },
    ],
  },

  {
    name: 'Фаза-2',
    isDraggable: false,
    iconId: 'square',
    id: 2,
    nodeList: [
      {
        name: 'Залежь - АС10',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС9',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС14',
        iconId: 'circle',
      },
    ],
  },

  {
    name: 'Фаза-3',
    isDraggable: false,
    iconId: 'square',
    id: 3,
    nodeList: [
      {
        name: 'Залежь - АС10',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС10-1',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС10-2',
        iconId: 'circle',
      },
    ],
  },

  {
    name: 'Фаза-4',
    isDraggable: false,
    iconId: 'square',
    id: 4,
    nodeList: [
      {
        name: 'Залежь - АС19',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС10-2',
        iconId: 'circle',
      },
      {
        name: 'Залежь - АС10-3',
        iconId: 'circle',
      },
    ],
  },
];

const icons = {
  square: SquareSvg,
  circle: CircleSvg,
};

export const ObjectsGroupingWidget = (): React.ReactElement => {
  return (
    <Tree
      onDragEnd={(event) => console.log(event)}
      icons={icons}
      nodeList={group}
      isShownLeftLines={false}
    />
  );
};
