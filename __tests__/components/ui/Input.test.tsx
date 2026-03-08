import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders an error message when provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error classes when error is provided', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toMatch(/red|border-red/);
  });

  it('does not apply error classes when no error', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).not.toMatch(/border-red/);
  });

  it('passes through standard input props', () => {
    render(<Input placeholder="Enter value" type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter value');
  });

  it('associates label with input via htmlFor', () => {
    render(<Input label="Username" id="username" />);
    const label = screen.getByText('Username');
    expect(label).toHaveAttribute('for', 'username');
  });
});
