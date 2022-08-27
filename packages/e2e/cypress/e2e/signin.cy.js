describe('User Signin', () => {
    const user = {
        firstName: 'Oliver',
        lastName: 'Queen',
        email: 'oliver@desc.org',
        program: 'employment services',
        password: 'thegreenarrow'
    };

    before(() => {
        // Will likely need to be refactored out as a Cypress.Command to reuse in all the other
        // tests.  Most likely consolidate a command to create a user and sign in.
        cy.request({
            url: 'http://localhost:3001/api/users/',
            method: 'POST',
            body: user
        });
        cy.request('http://localhost:3001/api/auth/logout');
    });

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('qid');
    });

    after(() => {
        cy.exec('npm run pdb:reset');
    });

    it('shows error if user is unauthorized', () => {
        cy.visit('http://localhost:4200/signin');
        cy.get('#email').focus().type('random@desc.org');

        cy.get('#password').focus().type('randompassword1234');

        cy.get('button').contains('Sign In').click();

        cy.get('form .red-text').should('contain', 'Unathorized user.');
    });

    it('successfully logs in an existing user', () => {
        cy.visit('http://localhost:4200/signin');
        cy.get('#email').focus().type(user.email);

        cy.get('#password').focus().type(user.password);

        cy.get('button').contains('Sign In').click();

        cy.url().should('eq', 'http://localhost:4200/');

        cy.get('nav .profile-menu a span').should('contain', `${user.firstName} ${user.lastName}`);
        cy.get('h3').should('contain', user.firstName);
    });

    it('maintains user context on page reload', () => {
        cy.reload();
        cy.get('h3').should('contain', user.firstName);
    });

    it('logs out the user after signup', () => {
        cy.visit('http://localhost:4200/');

        cy.get('.profile-menu > a').click();
        cy.get('.profile-menu a').contains('Logout').click();
        cy.url().should('eq', 'http://localhost:4200/');
        cy.get('h1').should('contain', 'Welcome to the DESC Portal');
        cy.findByRole('heading', { name: user.firstName }).should('not.exist');
    });
});
