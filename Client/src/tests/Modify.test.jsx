import { render, screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Modify from '../Components/Modifiy/Modify';

describe('Modify Trip', () => {
  it('clicking on Modify Trip from <App /> should navigate to modify page', async () => {
    render(<App />)
    const modifyTripButton = screen.getByRole('button', { name: 'Modify Trip' });
    await userEvent.click(modifyTripButton);
    expect(window.location.pathname).toBe('/modify')
  });

  test('should render an input field for userName search', async () => {
    render(
      <MemoryRouter>
       <Modify />
      </MemoryRouter> 
      );
    const homeButt = screen.getByRole('button', { name: 'Home' });
    expect(homeButt).toBeInTheDocument();
    const form = screen.getByRole('searchForm');
    expect(form).toBeInTheDocument();
    const startDateInput = screen.getByTestId('userNameInput')
    expect(startDateInput).toBeInTheDocument();
    const searchButt = screen.getByRole('button', { name: 'Find Trips' });
    expect(searchButt).toBeInTheDocument();
  })

});