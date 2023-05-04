import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';
import Trip from '../Components/Trip/Trip';

test('test', async ()=> {
  render(
    <MemoryRouter>
      <Trip />
    </MemoryRouter>
  );
  const homeButt = screen.getByTestId('homeButt')
  expect(homeButt).toBeInTheDocument();
})