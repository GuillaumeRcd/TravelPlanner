import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';
import Result from '../Components/Result/Result';

test('should render activity form and buttons', async ()=> {
  const currentTrip = [{
    name: 'test',
    depCity: '123',
    arrCity: '123',
    budget: '123',
    duration: '123',
    id: '123',
    user: '321'
  }
  ];
  render(
    <MemoryRouter>
        <Result searchedTrips={currentTrip}/>
    </MemoryRouter>
  );
  const homeButt = screen.getByTestId('homeButt')
  expect(homeButt).toBeInTheDocument();
  const hideAndShowButt = screen.getByTestId('show-hide-butt')
  expect(hideAndShowButt).toBeInTheDocument();
})