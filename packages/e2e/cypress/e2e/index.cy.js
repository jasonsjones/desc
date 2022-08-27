describe('Index Page', () => {
    it('has a Home Page', () => {
        cy.visit('http://localhost:4200');
        cy.findByRole('heading', { name: /Welcome to the DESC Portal/ }).should('exist');
    });

    it('has nav bar with 3 anchor', () => {
        cy.visit('http://localhost:4200');
        cy.get('nav').findAllByRole('link').should('have.length', 3);
    });

    it('navigates to login page', () => {
        cy.visit('http://localhost:4200');
        cy.get('nav')
            .findByRole('link', { name: /Sign In/ })
            .click();
        cy.url('includes', '/signin');
    });

    it('navigates to signup page', () => {
        cy.visit('http://localhost:4200');
        cy.get('nav')
            .findByRole('link', { name: /Sign Up/ })
            .click();
        cy.url('includes', '/signup');
    });
});
