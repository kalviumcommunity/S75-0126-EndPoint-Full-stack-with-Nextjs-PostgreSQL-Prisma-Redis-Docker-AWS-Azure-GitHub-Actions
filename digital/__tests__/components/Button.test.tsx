import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../src/components/ui/button';
import '../test-utils';

describe('Button Component', () => {
  it('should render with primary variant by default', () => {
    render(<Button label="Click Me" />);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-brand', 'text-white');
  });

  it('should render with secondary variant when specified', () => {
    render(<Button label="Click Me" variant="secondary" />);
    
    const button = screen.getByText('Click Me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gray-200', 'text-gray-700');
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when not provided', () => {
    render(<Button label="Click Me" />);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    // Should not throw error
    expect(button).toBeInTheDocument();
  });

  it('should apply hover styles on mouse over', () => {
    render(<Button label="Hover Me" />);
    
    const button = screen.getByText('Hover Me');
    expect(button).toBeInTheDocument();
    // The hover styles are applied via CSS classes
    expect(button).toHaveClass('hover:bg-brand-dark');
  });
});