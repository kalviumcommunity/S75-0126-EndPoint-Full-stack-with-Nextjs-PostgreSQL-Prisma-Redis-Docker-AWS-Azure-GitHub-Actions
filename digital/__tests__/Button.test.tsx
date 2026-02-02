import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../src/components/Button';

test('renders button and handles click', () => {
  const handleClick = jest.fn();

  render(<Button label="Click Me" onClick={handleClick} />);

  const button = screen.getByText('Click Me');

  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('renders button with correct label', () => {
  const handleClick = jest.fn();

  render(<Button label="Submit" onClick={handleClick} />);

  const button = screen.getByText('Submit');

  expect(button).toBeInTheDocument();
});
