import React from 'react';
import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '@/types/global';

import { TextField, TextFieldProps } from '@/components/form';

const renderComponent = (props: TextFieldProps) => {
  return render(<TextField {...props} />);
};

beforeAll(() => {
  window.ResizeObserver = ResizeObserver;
});

const defaultMockProps: TextFieldProps = {
  name: 'test',
  placeholder: 'test placeholder',
  input: {
    name: 'test',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onFocus: jest.fn(),
    value: 'test',
  },
  meta: {},
  testId: 'testid',
};
describe('Список мероприятий', () => {
  test('рендерится без ошибок', () => {
    renderComponent(defaultMockProps);
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
    renderComponent(mockProps);

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
    renderComponent(mockProps);

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
    renderComponent(mockProps);

    const errorLabel = screen.getByTestId('testid:error');

    expect(errorLabel).toBeVisible();
    expect(errorLabel).toHaveTextContent('server error');
  });
});
