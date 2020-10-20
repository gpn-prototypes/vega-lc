import React from 'react';
import { BasicSelect } from '@gpn-design/uikit/BasicSelect';

import { cnStepEditor } from './cn-lc';

type Option = {
  label: string;
  value: string;
};

const CommonInfo: React.FC = () => {
  const items = [
    { label: 'Москва', value: 'moscow' },
    { label: 'Обстановка осадконакопления, Морская', value: '2' },
    { label: 'Томск', value: 'tomsk' },
  ];

  const getItemLabel = (option: Option): string => option.label;

  return (
    <div className={cnStepEditor('CommonInfo')}>
      <p className={cnStepEditor('ChangeSelectLabel').toString()}>Риск</p>

      <BasicSelect
        size="s"
        className={cnStepEditor('ChanceSelect').toString()}
        value={{ label: 'Обстановка осадконакопления, Морская', value: '2' }}
        options={items}
        id="common-info-chance"
        getOptionLabel={getItemLabel}
        view="default"
      />
    </div>
  );
};

export default CommonInfo;
