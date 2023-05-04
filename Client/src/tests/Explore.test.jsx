import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Explore from '../Components/Explore/Explore';



describe('Explore', () => {

  test('clicking on explore from <Home /> should navigate to explore page', async () => {
    render(<App />)
    const exploreButton = screen.getByRole('button', { name: 'Explore' });
    await userEvent.click(exploreButton);
    expect(window.location.pathname).toBe('/explore')
  });

  test('should render a form with input fields and a \'Search\' button', ()=> {
    render(
     <MemoryRouter>
        <Explore />
     </MemoryRouter> 
     );
    const form = screen.getByRole('searchForm');
    expect(form).toBeInTheDocument();
    const startDateInput = document.getElementById('startDate')
    expect(startDateInput).toBeInTheDocument();
    const endDateInput = document.getElementById('endDate')
    expect(endDateInput).toBeInTheDocument();
    const departureCityInput = document.getElementById('departureCity')
    expect(departureCityInput).toBeInTheDocument();
    const budgetInput = document.getElementById('budget')
    expect(budgetInput).toBeInTheDocument();
    const activitySelector = document.getElementById('activitySelect')
    expect(activitySelector).toBeInTheDocument();
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeInTheDocument();
  })
});


