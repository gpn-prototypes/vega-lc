import React from 'react';
import renderer from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '../../../src/types/global';

import { cnStepEditor } from '../../../src/components/step-editor/cn-lc';
import CommonInfo from '../../../src/components/step-editor/CommonInfo';

const renderComponent = () => render(<CommonInfo />);

describe('Common Info', () => {
  test('рендерится без ошибок', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer.create(<CommonInfo />).toJSON();
    expect(dom).toMatchSnapshot();
  });

  test('удаляется элемент', async () => {
    const component = await renderComponent();

    const removeButton = component.container.querySelector(`.${cnStepEditor('RemoveBtn')}`);

    if (removeButton) {
      fireEvent.click(removeButton);
    }

    // TODO fix after implementing onClick event
  });

  test('срабатывает кнопка "Добавить риск"', async () => {
    const component = await renderComponent();

    const addRisk = component.container.querySelector(
      `.${cnStepEditor('Chances')} > .${cnStepEditor('ItemAppender')} > button`,
    );

    if (addRisk) {
      fireEvent.click(addRisk);
    }

    // TODO fix after implementing onClick event
  });

  test('срабатывает кнопка "Добавить параметр"', async () => {
    const component = await renderComponent();

    const addParameter = component.container.querySelector(
      `.${cnStepEditor('Parameters')} > .${cnStepEditor('ItemAppender')} > button`,
    );

    if (addParameter) {
      fireEvent.click(addParameter);
    }

    // TODO fix after implementing onClick event
  });
});
