import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChoiceGroup } from '@gpn-prototypes/vega-ui';

export interface NavItem {
  title: string;
  path: string;
}

const Navigation = (): React.ReactElement => {
  const history = useHistory();

  const tabs: Array<NavItem> = [
    {
      title: 'ГРР',
      path: '/',
    },
    {
      title: 'ОПР',
      path: '/opr',
    },
    {
      title: 'Инфраструктура',
      path: '/infrastructure',
    },
    {
      title: 'Экономика',
      path: '/economic',
    },
    {
      title: 'Общая логика',
      path: '/logic',
    },
    {
      title: 'Диаграмма ганта',
      path: '/diagram-gant',
    },
  ];

  const currentTab = tabs.find((tab) => tab.path === history.location.pathname) as NavItem;
  const [valueTab, setValueTab] = useState<NavItem | null>(currentTab);

  history.listen((location) => {
    const switchTab = tabs.find((element) => element.path === location.pathname);
    setValueTab(switchTab || null);
  });

  return (
    <ChoiceGroup
      size="s"
      view="primary"
      form="default"
      name="navigation"
      multiple={false}
      items={tabs}
      value={valueTab}
      getLabel={(item): string => item.title}
      onChange={({ value }): void => {
        setValueTab(value);
        history.push(value ? value.path : '/');
      }}
    />
  );
};

export default Navigation;
