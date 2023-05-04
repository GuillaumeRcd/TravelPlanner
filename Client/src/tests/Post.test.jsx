import { render, screen } from '@testing-library/react';
import App, { TripContext } from '../App';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import Post from '../Components/Post/Post';
import { MemoryRouter } from 'react-router-dom';
import { React } from "react";

describe('Post', () => {
  test('clicking on Post from <App /> should navigate to post page', async () => {
    render(<App />)
    const postButton = screen.getByRole('button', { name: 'Post' });
    await userEvent.click(postButton);
    expect(window.location.pathname).toBe('/post')
  });

  test('should render a form to create a new trip with \'Create\' button', async () => {
    const setCurrentTrip = Post.setcurrentTrip
    render(
      <MemoryRouter>
        <TripContext.Provider value={{ setCurrentTrip }}>
        <Post />
       </TripContext.Provider>
      </MemoryRouter> 
      );
    const homeButt = screen.getByRole('button', { name: 'Home' });
    expect(homeButt).toBeInTheDocument();
    const tripNameInput = screen.getByTestId('tripNameInput')
    expect(tripNameInput).toBeInTheDocument();
    const userInput = screen.getByTestId('userInput')
    expect(userInput).toBeInTheDocument();
    const depCityInput = screen.getByTestId('depCityInput')
    expect(depCityInput).toBeInTheDocument();
    const arrCityInput = screen.getByTestId('arrCityInput')
    expect(arrCityInput).toBeInTheDocument();
    const budgetInput = screen.getByTestId('budgetInput')
    expect(budgetInput).toBeInTheDocument();
    const createButt = screen.getByRole('button', { name: 'Create Trip' });
    expect(createButt).toBeInTheDocument();
  })


});
