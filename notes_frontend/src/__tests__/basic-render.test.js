import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Simple Notes title and Add Note button', () => {
  render(<App />);
  expect(screen.getByText(/Simple Notes/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Note/i })).toBeInTheDocument();
});
