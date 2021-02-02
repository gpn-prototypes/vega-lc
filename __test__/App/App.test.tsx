import React from 'react';
import renderer from 'react-test-renderer';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { render } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';

import '../../src/types/global';

import { App } from '../../src/App/App';

jest.mock('../../src/App/AppView', () => {
  return {
    AppView: () => {
      return <div />;
    },
  };
});

const renderApp = () => {
  const mockGraphqlClient = new ApolloClient({ cache: new InMemoryCache() });
  const mockIdentity = {
    getToken: (): Promise<string> => new Promise((resolve) => setTimeout(() => resolve('token'))),
  };
  return render(<App graphqlClient={mockGraphqlClient} identity={mockIdentity} />);
};

describe('App', () => {
  test('рендерится без ошибок', () => {
    expect(renderApp).not.toThrow();
  });

  test('соответствует снапшоту', () => {
    window.ResizeObserver = ResizeObserver;

    const dom = renderer.create(<App />).toJSON();
    expect(dom).toMatchSnapshot();
  });
});
