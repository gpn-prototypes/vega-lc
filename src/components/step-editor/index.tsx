import React, { useState } from 'react';
import { Tabs } from '@gpn-prototypes/vega-ui';

import { cnStepEditor } from './cn-lc';
import CommonInfo from './CommonInfo';
import Conditions from './Conditions';
import Effects from './Effects';

import './index.css';

type Item = {
  name: string;
};

const StepEditor: React.FC = () => {
  const tabs = [
    {
      name: 'Общая информация',
    },
    {
      name: 'Эффекты',
    },
    {
      name: 'Условия выполнения',
    },
  ];

  const [val, setValue] = useState<Item | null>(tabs[0]);

  const renderContent = (): React.ReactElement => {
    switch (val?.name) {
      case tabs[0].name:
        return <CommonInfo />;
      case tabs[1].name:
        return <Effects />;
      case tabs[2].name:
        return <Conditions />;
      default:
        return <CommonInfo />;
    }
  };

  return (
    <div className={cnStepEditor()}>
      <div className={cnStepEditor('Tabs')}>
        <Tabs
          size="s"
          view="clear"
          items={tabs}
          value={val}
          getLabel={(item): string => item.name}
          onChange={({ value }): void => setValue(value)}
        />
      </div>

      <div className={cnStepEditor('Content')}>{renderContent()}</div>
    </div>
  );
};

export default StepEditor;
