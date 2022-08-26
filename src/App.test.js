import { render, screen } from '@testing-library/react';
import App from './App';

it('renders the chat room', () => {
  render(<App />);
  const linkElement = screen.getByTestId('test-chat-room');
  expect(linkElement).toBeInTheDocument();
});
