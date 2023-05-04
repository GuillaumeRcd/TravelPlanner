import React from 'react'
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';
import { TripContext } from '../App';
import Activity from '../Components/Activity/Activity';

test('should render activity form and buttons', async ()=> {
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
        <Activity />
      </TripContext.Provider>
    </MemoryRouter>
  );
  const homeButt = screen.getByTestId('homeButt')
  expect(homeButt).toBeInTheDocument();
  const activityStartInput = screen.getByTestId('activityStart')
  expect(activityStartInput).toBeInTheDocument();
  const activityEndInput = screen.getByTestId('activityEnd')
  expect(activityEndInput).toBeInTheDocument();
  const depCityInput = screen.getByTestId('depCity')
  expect(depCityInput).toBeInTheDocument();
  const arrCityInput = screen.getByTestId('arrCity')
  expect(arrCityInput).toBeInTheDocument();
  const priceInput = screen.getByTestId('price')
  expect(priceInput).toBeInTheDocument();
  const whatDidYouDoInput = screen.getByTestId('whatDidYouDo')
  expect(whatDidYouDoInput).toBeInTheDocument();
  const additionalInfoInput = screen.getByTestId('additionalInfo')
  expect(additionalInfoInput).toBeInTheDocument();
  const createButt = screen.getByRole('button', { name: 'Create'})
  expect(createButt).toBeInTheDocument()
  const cancelButt = screen.getByRole('button', { name: 'Cancel Activity'})
  expect(cancelButt).toBeInTheDocument()
})