import React from 'react';
import { BasicSelect } from '@gpn-design/uikit/BasicSelect';
import { IconAdd } from '@gpn-prototypes/vega-icons';
import { Button } from '@gpn-prototypes/vega-ui';

import { cnStepEditor } from './cn-lc';

type Option = {
  label: string;
  value: string;
};

const CommonInfo: React.FC = () => {
  const chanceItems = [{ label: 'Обстановка осадконакопления, Морская', value: '1' }];

  const startActivityItems = [
    {
      label: 'август, 2020',
      value: '1',
    },
  ];

  const getItemLabel = (option: Option): string => option.label;

  return (
    <div className={cnStepEditor('CommonInfo')}>
      <p className={cnStepEditor('SelectLabel').toString()}>Риск</p>

      <BasicSelect
        size="s"
        className={cnStepEditor('ChanceSelect').toString()}
        value={{ label: 'Обстановка осадконакопления, Морская', value: '1' }}
        options={chanceItems}
        id="common-info-chance"
        getOptionLabel={getItemLabel}
        view="default"
      />

      <div className={cnStepEditor('TimeFrames')}>
        <div className={cnStepEditor('ExtremePoints')}>
          <div>
            <p className={cnStepEditor('SelectLabel').toString()}>Начало мероприятия</p>

            <BasicSelect
              size="s"
              value={{
                label: 'август, 2020',
                value: '1',
              }}
              options={startActivityItems}
              id="common-info-start-date"
              getOptionLabel={getItemLabel}
              className={cnStepEditor('DatePointSelect').toString()}
            />
          </div>

          <div>
            <p className={cnStepEditor('SelectLabel').toString()}>Завершение мероприятия</p>

            <BasicSelect
              size="s"
              value={{
                label: 'август, 2021',
                value: '1',
              }}
              options={startActivityItems}
              id="common-info-end-date"
              getOptionLabel={getItemLabel}
              className={cnStepEditor('DatePointSelect').toString()}
            />
          </div>
        </div>

        <div className={cnStepEditor('Continuous')}>
          <p className={cnStepEditor('SelectLabel').toString()}>Длительность</p>

          <BasicSelect
            size="s"
            value={{
              label: '1 год',
              value: '1',
            }}
            options={startActivityItems}
            id="common-info-continuous"
            getOptionLabel={getItemLabel}
            className={cnStepEditor('ContinuousSelect').toString()}
          />
        </div>
      </div>

      <div className={cnStepEditor('Cost')}>
        <p className={cnStepEditor('SelectLabel').toString()}>Цена</p>

        <BasicSelect
          size="s"
          value={{
            label: '1 000 000 рублей',
            value: '1',
          }}
          options={startActivityItems}
          id="common-info-cost"
          getOptionLabel={getItemLabel}
          className={cnStepEditor('CostSelect').toString()}
        />
      </div>

      <div className={cnStepEditor('ParameterAppender')}>
        <Button
          width="default"
          type="button"
          view="clear"
          size="xs"
          iconSize="s"
          iconLeft={IconAdd}
          onClick={(): void => {}}
          label="Добавить параметр"
        />
      </div>
    </div>
  );
};

export default CommonInfo;
