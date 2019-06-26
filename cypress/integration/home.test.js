import { createYield } from "typescript";

describe('Home Page', () => {
  beforeEach(() => {
    /**
     * create a mocked backend server
     */
    cy.fixture('courses.json').as('coursesJSON');

    // start mocked backend server
    cy.server();

    // set needed routes w/data to respond with
    cy.route('/api/courses', '@coursesJSON').as('courses');

    // visit site
    cy.visit('/');  
  });

  it('should display a list of courses', () => {
    // assert all courses is displayed
    cy.contains('All Courses');
    // wait for @courses to respond
    cy.wait('@courses');
    // get all mat-card elements, assert there are 9 of them
    cy.get('mat-card').should('have.length', 9);
  });

  it('should display the advanced courses', () => {
    cy.get('.mat-tab-label').should('have.length', 2);
    cy.get('.mat-tab-label').last().click();

    cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1);
    cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', 'Angular Security');
  });
});
