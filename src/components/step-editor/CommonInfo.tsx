import React from 'react';
import { BasicSelect, Button, IconAdd, IconTrash } from '@gpn-prototypes/vega-ui';
import { v4 as uuidv4 } from 'uuid';

import { cnStepEditor } from './cn-lc';

type Option = {
  label: string;
  value: string;
};

type Value = {
  label: string;
  value: unknown;
};

type Item = {
  value: Value;
  id: string;
  section: 'Parameters' | 'Chances';
};

const CommonInfo: React.FC = () => {
  const chanceOptions: Value[] = [
    { label: 'Обстановка осадконакопления, Морская', value: '1' },
    { label: 'Водянистая почва', value: '2' },
  ];

  const costOptions: Value[] = [
    { label: '1 000 000 рублей', value: '1' },
    { label: '5 000 000 рублей', value: '2' },
    { label: '10 000 000 рублей', value: '3' },
  ];

  const deleteItem = (id: string): void => {
    console.log(id);
  };

  const getItemLabel = (option: Option): string => option.label;

  const chanceItems: Item[] = [
    {
      id: uuidv4(),
      value: { label: 'Обстановка осадконакопления, Морская', value: '1' },
      section: 'Chances',
    },
    {
      id: uuidv4(),
      value: { label: 'Водянистая почва', value: '2' },
      section: 'Chances',
    },
  ];

  const costItems: Item[] = [
    {
      id: uuidv4(),
      value: { label: '10 000 000 рублей', value: '3' },
      section: 'Parameters',
    },
  ];

  const renderItems = (items: Item[]) => {
    return items.map((item) => {
      return (
        <div key={item.id} className={cnStepEditor('SelectContainer')}>
          <BasicSelect
            size="s"
            className={cnStepEditor(`${item.section}Select`).toString()}
            value={item.value}
            options={item.section === 'Chances' ? chanceOptions : costOptions}
            id={item.id}
            getOptionLabel={getItemLabel}
            view="default"
          />

          {item.section === 'Chances' && (
            <IconTrash
              onClick={() => deleteItem(item.id)}
              className={cnStepEditor('RemoveBtn').toString()}
              size="xs"
              view="secondary"
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className={cnStepEditor('CommonInfo')}>
      <div className={cnStepEditor('Chances')}>
        <p className={cnStepEditor('SectionLabel').toString()}>Риск</p>

        {renderItems(chanceItems)}

        <div className={cnStepEditor('ItemAppender')}>
          <Button
            width="default"
            type="button"
            view="ghost"
            size="s"
            iconSize="xs"
            iconLeft={IconAdd}
            onClick={(): void => {}}
            label="Добавить риск"
          />
        </div>
      </div>

      <div className={cnStepEditor('Parameters')}>
        <p className={cnStepEditor('SectionLabel').toString()}>Параметры</p>

        <p className={cnStepEditor('SelectLabel').toString()}>Стоимость</p>

        {renderItems(costItems)}

        <div className={cnStepEditor('ItemAppender')}>
          <Button
            width="default"
            type="button"
            view="ghost"
            size="s"
            iconSize="xs"
            iconLeft={IconAdd}
            onClick={(): void => {}}
            label="Добавить параметр"
          />
        </div>
      </div>
    </div>
  );
};

export default CommonInfo;
