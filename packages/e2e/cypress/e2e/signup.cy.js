describe('User Signup', () => {
    const userData = {
        firstName: 'Raymond',
        lastName: 'Palmer',
        email: 'raymond@desc.org',
        program: 'Integrated Services',
        password: '123456'
    };

    beforeEach(() => {
        Cypress.Cookies.preserveOnce('qid');
    });

    after(() => {
        cy.exec('npm run pdb:reset');
    });

    it('does not submit form if data is missing', () => {
        cy.visit('http://localhost:4200/signup');
        cy.get('#firstName').focus().type(userData.firstName);

        // skip last name

        cy.get('#email').focus().type(userData.email);

        cy.get('input.select-dropdown').first().focus().click();
        cy.get('ul.dropdown-content').contains(userData.program).click();

        cy.get('#password').focus().type(userData.password);
        cy.get('#confirmPassword').focus().type(userData.password);

        cy.get('button').contains('Sign Up').click();

        cy.url().should('eq', 'http://localhost:4200/signup');
    });

    it('displays a message when the passwords do not match', () => {
        cy.visit('http://localhost:4200/signup');
        cy.get('#firstName').focus().type(userData.firstName);
        cy.get('#lastNameDesktop').focus().type(userData.lastName);
        cy.get('#email').focus().type(userData.email);

        cy.get('input.select-dropdown').first().focus().click();
        cy.get('ul.dropdown-content').contains(userData.program).click();

        cy.get('#password').focus().type(userData.password);
        cy.get('#confirmPassword').focus().type('doesnotmatch');

        cy.get('.helper-text').should('contain', 'Passwords do NOT match');
    });

    it('does not submit form if the passwords do not match', () => {
        cy.visit('http://localhost:4200/signup');
        cy.get('#firstName').focus().type(userData.firstName);
        cy.get('#lastNameDesktop').focus().type(userData.lastName);
        cy.get('#email').focus().type(userData.email);

        cy.get('input.select-dropdown').first().focus().click();
        cy.get('ul.dropdown-content').contains(userData.program).click();

        cy.get('#password').focus().type(userData.password);
        cy.get('#confirmPassword').focus().type('doesnotmatch');

        cy.get('button').contains('Sign Up').click();

        cy.url().should('eq', 'http://localhost:4200/signup');
    });

    it('signs up a new user', () => {
        cy.visit('http://localhost:4200/signup');
        cy.get('#firstName').focus().type(userData.firstName);
        cy.get('#lastNameDesktop').focus().type(userData.lastName);
        cy.get('#email').focus().type(userData.email);

        cy.get('input.select-dropdown').first().focus().click();
        cy.get('ul.dropdown-content').contains(userData.program).click();

        cy.get('#password').focus().type(userData.password);
        cy.get('#confirmPassword').focus().type(userData.password);

        cy.get('button').contains('Sign Up').click();

        cy.get('h4').should('contain', 'Thank you for registering');
        cy.get('h5').should('contain', 'sent an email to the account');
    });
});
