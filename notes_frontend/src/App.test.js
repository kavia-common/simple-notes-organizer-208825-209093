import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title and Add Note button', () => {
  render(<App />);
  expect(screen.getByText(/Simple Notes/i)).toBeInTheDocument();
  const btn = screen.getByRole('button', { name: /Add Note/i });
  expect(btn).toBeInTheDocument();
});
