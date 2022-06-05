import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders disclaimer', () => {
  render(<App />);
  const linkElement = screen.getByText(/This dApp is under development - use at your own risk!/i);
  expect(linkElement).toBeInTheDocument();
});
