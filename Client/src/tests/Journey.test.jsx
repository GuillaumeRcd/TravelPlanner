import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';
import Journey from '../Components/Journey/Journey';
import { TripContext } from '../App';

test('should render journey input form and buttons', async ()=> {
  const currentTrip = {
    name: 'test',
    depCity: '123',
    arrCity: '123',
    budget: '123',
    duration: '123',
    id: '123',
    user: '321'
  };
  render(
    <MemoryRouter>
      <TripContext.Provider value={{ currentTrip }}>
        <Journey />
      </TripContext.Provider>
    </MemoryRouter>
  );
  const homeButt = screen.getByTestId('homeButt')
  expect(homeButt).toBeInTheDocument();
  const journeyStartInput = screen.getByTestId('journeyStart')
  expect(journeyStartInput).toBeInTheDocument();
  const journeyEndInput = screen.getByTestId('journeyEnd')
  expect(journeyEndInput).toBeInTheDocument();
  const depCityInput = screen.getByTestId('depCity')
  expect(depCityInput).toBeInTheDocument();
  const arrCityInput = screen.getByTestId('arrCity')
  expect(arrCityInput).toBeInTheDocument();
  const priceInput = screen.getByTestId('price')
  expect(priceInput).toBeInTheDocument();
  const transportTypeInput = screen.getByTestId('transportType')
  expect(transportTypeInput).toBeInTheDocument();
  const createButt = screen.getByRole('button', { name: 'Create'})
  expect(createButt).toBeInTheDocument()
  const cancelButt = screen.getByRole('button', { name: 'Cancel Journey'})
  expect(cancelButt).toBeInTheDocument()
})