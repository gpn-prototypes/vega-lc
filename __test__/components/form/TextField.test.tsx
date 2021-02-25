import React from 'react';
import { Field, Form } from 'react-final-form';
import { Form as VegaForm } from '@gpn-prototypes/vega-ui';
import { fireEvent, render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import { TextField, TextFieldProps } from '@/components/form';

const renderWithForm = (props: TextFieldProps) => {
  return render(
    <Form
      initialValues={{ test: '' }}
      onSubmit={jest.fn()}
      render={({ handleSubmit }): React.ReactNode => (
        <VegaForm onSubmit={handleSubmit}>
          <Field
            name="test"
            render={({ input, meta }): React.ReactNode => {
              const fieldInput = { ...input, ...props.input };
              const fieldMeta = { ...meta, ...props.meta };
              return <TextField {...props} input={fieldInput} meta={fieldMeta} />;
            }}
          />
        </VegaForm>
      )}
    />,
  );
};

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

const defaultMockProps: TextFieldProps = {
  input: {
    name: 'test',
  },
  placeholder: 'test placeholder',
  testId: 'testid',
};

describe('Список мероприятий', () => {
  test('рендерится без ошибок', () => {
    renderWithForm(defaultMockProps);
  });

  test('Не показывает поле ошибки, если ошибок нет', () => {
    const mockProps = {
      ...defaultMockProps,
      meta: {
        touched: true,
        dirty: true,
        modifiedSinceLastSubmit: false,
      },
    };
    renderWithForm(mockProps);

    const textLabel = screen.queryByTestId('testid');
    const errorLabel = screen.queryByTestId('testid:error');

    expect(textLabel).toBeVisible();
    expect(errorLabel).toBeNull();
  });

  test('Показывает ошибку клиентской валидации ', () => {
    const mockProps = {
      ...defaultMockProps,
      meta: {
        error: 'client error',
        touched: true,
        dirty: true,
      },
    };
    renderWithForm(mockProps);

    const errorLabel = screen.getByTestId('testid:error');

    expect(errorLabel).toBeVisible();
    expect(errorLabel).toHaveTextContent('client error');
  });

  test('Показывает ошибку серверной валидации ', () => {
    const mockProps = {
      ...defaultMockProps,
      meta: {
        submitError: 'server error',
        touched: true,
        dirty: true,
        modifiedSinceLastSubmit: false,
      },
    };
    renderWithForm(mockProps);

    const errorLabel = screen.getByTestId('testid:error');

    expect(errorLabel).toBeVisible();
    expect(errorLabel).toHaveTextContent('server error');
  });

  test('Не делает trim содержимого на onBlur при trimOnBlur = undefined', () => {
    const { getByPlaceholderText } = renderWithForm(defaultMockProps);

    const textField = getByPlaceholderText(defaultMockProps.placeholder) as HTMLInputElement;

    const text = '    test   ';

    fireEvent.change(textField, { target: { value: text } });
    fireEvent.blur(textField);

    expect(textField.value).toBe(text);
  });

  test('Делает trim содержимого на onBlur при trimOnBlur = true', () => {
    const mockProps = {
      ...defaultMockProps,
      trimOnBlur: true,
    };
    const { getByPlaceholderText } = renderWithForm(mockProps);

    const textField = getByPlaceholderText(defaultMockProps.placeholder) as HTMLInputElement;

    const text = '    test   ';

    fireEvent.change(textField, { target: { value: text } });
    fireEvent.blur(textField);

    expect(textField.value).toBe(text.trim());
  });
});
