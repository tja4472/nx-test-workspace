import { getGreeting, navigateTo } from '../support/po';

describe('Hello Angular', () => {
  beforeEach(navigateTo);

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to');
  });
  /*
  it('has 3 links', () => {
    cy.get('app-root li a').should('have.length', 3);
  });
*/
});
