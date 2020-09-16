import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tree } from '@gpn-prototypes/vega-tree';

import { fetchActivitiesList } from '../../redux-store/activities/actions';
import { getActivitiesNodeList } from '../../redux-store/activities/selectors';

// const RedFolder = (
//   <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M1 0.5C0.447715 0.5 0 0.947715 0 1.5V9.5C0 10.0523 0.447715 10.5 1 10.5H11C11.5523 10.5 12 10.0523 12 9.5V2.5C12 1.94772 11.5523 1.5 11 1.5H5C5 0.947715 4.55228 0.5 4 0.5H1Z"
//       fill="#FE4343"
//     />
//   </svg>
// );
//
// const BlueFolder = (
//   <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M1 0.5C0.447715 0.5 0 0.947715 0 1.5V9.5C0 10.0523 0.447715 10.5 1 10.5H11C11.5523 10.5 12 10.0523 12 9.5V2.5C12 1.94772 11.5523 1.5 11 1.5H5C5 0.947715 4.55228 0.5 4 0.5H1Z"
//       fill="#0AA5FF"
//     />
//   </svg>
// );
//
// const GreenFolder = (
//   <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M1 0.5C0.447715 0.5 0 0.947715 0 1.5V9.5C0 10.0523 0.447715 10.5 1 10.5H11C11.5523 10.5 12 10.0523 12 9.5V2.5C12 1.94772 11.5523 1.5 11 1.5H5C5 0.947715 4.55228 0.5 4 0.5H1Z"
//       fill="#22C38E"
//     />
//   </svg>
// );
//
// const events: NodeItem[] = [
//   {
//     name: 'Разведка',
//     iconId: 'red-folder',
//     id: '1',
//     isDraggable: false,
//     nodeList: [
//       {
//         name: 'Аэромагнитная съёмка',
//         id: '11',
//       },
//       {
//         name: 'Гравиметрическая съёмка',
//         id: '12',
//       },
//       {
//         name: 'Сейсмика',
//         id: '13',
//       },
//       {
//         name: 'Гравиразведка',
//         id: '14',
//       },
//     ],
//   },
//   {
//     name: 'Обустройство',
//     iconId: 'blue-folder',
//     isDraggable: false,
//     id: '2',
//     nodeList: [
//       {
//         name: 'Разбивочные работы',
//         id: '15',
//       },
//       {
//         name: 'Геодезический контроль точности',
//         id: '16',
//       },
//       {
//         name: 'Дороги (временные)',
//         id: '17',
//       },
//       {
//         name: 'Площадки (временные)',
//         id: '18',
//       },
//       {
//         name: 'Рельсовые подкрановые пути',
//         id: '19',
//       },
//       {
//         name: 'Дороги',
//         id: '20',
//       },
//       {
//         name: 'Площадки',
//         id: '21',
//       },
//       {
//         name: 'Механизированная разработка грунта ',
//         id: '22',
//       },
//       {
//         name: 'Уплотнение грунта катками',
//         id: '23',
//       },
//       {
//         name: 'Механизированное рыхление',
//         id: '24',
//       },
//       {
//         name: 'Бурение',
//         id: '25',
//       },
//       {
//         name: 'Тампонажные работы',
//         id: '26',
//       },
//     ],
//   },
//   {
//     name: 'Программа ОПР',
//     iconId: 'green-folder',
//     id: '3',
//     isDraggable: false,
//     nodeList: [],
//   },
// ];
//
// const icons = {
//   'blue-folder': BlueFolder,
//   'green-folder': GreenFolder,
//   'red-folder': RedFolder,
// };

export const ActivitiesWidget = (): React.ReactElement => {
  const dispatch = useDispatch();

  const activities = useSelector(getActivitiesNodeList);

  useEffect(() => {
    dispatch(fetchActivitiesList());
  }, [dispatch]);

  return <Tree withVisibilitySwitcher={false} nodeList={activities} isShownLeftLines={false} />;
};
