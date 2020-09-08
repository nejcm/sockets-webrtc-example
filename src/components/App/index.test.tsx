import { render } from '@testing-library/react';
import React from 'react';
import App from '.';

test('renders app', () => {
  const { container } = render(<App />);
  expect(container.childNodes).toBeDefined();
});
