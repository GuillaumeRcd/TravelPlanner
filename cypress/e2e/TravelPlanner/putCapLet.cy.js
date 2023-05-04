/// <reference types="cypress" />

describe('example to-do app', () => {

  it('creates a trip and adds an activity and journey, then deletes ALL of it', ()=> {
    cy.visit('http://localhost:5173')
    cy.contains('Post').click()
    cy.get('[data-testid="tripNameInput"]').type('putCapLet Trip')
    cy.get('[data-testid="userInput"]').type('theFrog')
    cy.get('[data-testid="depCityInput"]').type('Barcelona')
    cy.get('[data-testid="arrCityInput"]').type('Paris')
    cy.get('[data-testid="budgetInput"]').type('100')
    cy.contains('Create Trip').click();
    cy.contains('Post an Activity').click();
    cy.get('[data-testid="activityStart"]').type('2023-05-19T10:00:00')
    cy.get('[data-testid="activityEnd"]').type('2023-05-29T10:00:00');
    cy.get('[data-testid="depCity"]').type('Paris')
    cy.get('[data-testid="price"]').type('50')
    cy.get('[data-testid="whatDidYouDo"]').type('eatFrogs')
    cy.get('button').contains('Create').click();
    cy.get('button').contains('Post a Journey').click();
    cy.get('[data-testid="journeyStart"]').type('2023-05-19T10:00:00')
    cy.get('[data-testid="journeyEnd"]').type('2023-05-19T12:00:00');
    cy.get('[data-testid="depCity"]').type('Barcelona')
    cy.get('[data-testid="arrCity"]').type('Paris')
    cy.get('[data-testid="price"]').type('100')
    cy.get('[data-testid="transportType"]').type('Le Plane')
    cy.get('button').contains('Create').click();
    cy.get('button').contains('Post a Journey').click();
    cy.get('[data-testid="journeyStart"]').type('2023-05-29T08:00:00')
    cy.get('[data-testid="journeyEnd"]').type('2023-05-29T10:00:00');
    cy.get('[data-testid="depCity"]').type('Paris')
    cy.get('[data-testid="arrCity"]').type('Barcelona')
    cy.get('[data-testid="price"]').type('100')
    cy.get('[data-testid="transportType"]').type('El Avion')
    cy.get('button').contains('Create').click();
    cy.get('button').contains('Delete Trip').click();
  })


  it('Accesses Modify Trips, and search trips by userName', ()=> {
    cy.visit('http://localhost:5173')
    cy.get('[data-test-id="test-example"]').should('have.length', 3)
    cy.contains('Modify Trip').click()
    cy.get('[data-testid="userNameInput"]').type('theFrog')
    cy.contains('Find Trips').click()
    // cy.get('button').contains('Delete Trip').click();
  })

  it('Access Explore, and search for trips by activity', () => {
    cy.visit('http://localhost:5173')
    cy.contains('Explore').click()
    cy.get('[id="startDate"]').type('2023-05-18T08:00:00')
    cy.get('[id="endDate"]').type('2023-05-29T09:00:00');
    cy.get('[id="departureCity"]').type('Barcelona')
    cy.get('[id="budget"]').type('69420')
    cy.get('[id="activitySelect"]').select('Eatfrogs')
    cy.get('button').contains('Search').click();
    
  })

});