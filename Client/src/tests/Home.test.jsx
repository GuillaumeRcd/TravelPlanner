import { render, screen } from '@testing-library/react';
import App from '../App';

import { describe, test, expect } from 'vitest'

describe('Home', () => {
  test('renders Explore button', () => {
    render(<App />)
    const exploreButton = screen.getByRole('button', { name: 'Explore' });
    expect(exploreButton).toBeInTheDocument();
  });

  test('renders Post button', () => {
    render(<App />)
    const postButton = screen.getByRole('button', { name: 'Post' });
    expect(postButton).toBeInTheDocument();
  });

  test('renders Modify Trip button', () => {
    render(<App />)
    const modifyTripButton = screen.getByRole('button', { name: 'Modify Trip' });
    expect(modifyTripButton).toBeInTheDocument();
  });
});
