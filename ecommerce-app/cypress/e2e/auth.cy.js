describe('Flujo de Autenticación E2E', () => {
    const uniqueId = Date.now();
    const testUser = {
        displayName: `QA User ${uniqueId}`,
        email: `qa${uniqueId}@tests.com`,
        password: 'Password123!',
    };

    beforeEach(() => {
        cy.intercept('GET', '**/api/auth/check-email*').as('checkEmail');
        cy.intercept('POST', '**/api/auth/register').as('registerApi');
        cy.intercept('POST', '**/api/auth/login').as('loginApi');
    });

    it('Debe registrar un nuevo usuario y hacer login', () => {
        // ============================================
        // 1. REGISTRO
        // ============================================
        cy.visit('/register');

        // Llenar displayName - siempre re-consultar el elemento antes de interactuar
        cy.get('input#displayName').type(testUser.displayName);

        // Separar type y blur en comandos independientes para evitar referencias
        // obsoletas al DOM cuando React re-renderiza al cambiar el estado emailCheck
        cy.get('input#email').type(testUser.email);
        cy.get('input#email').blur();

        // Esperar la verificación de email antes de continuar
        cy.wait('@checkEmail').its('response.statusCode').should('be.oneOf', [200, 304]);

        // Re-consultar cada input antes de interactuar
        cy.get('input#password').type(testUser.password);
        cy.get('input#verifyPassword').type(testUser.password);

        cy.get('button[type="submit"]').contains('Registrar').click();

        // Validar llamada al API con status de éxito (200 o 201)
        cy.wait('@registerApi').its('response.statusCode').should('be.oneOf', [200, 201]);

        // ============================================
        // 2. LOGIN
        // ============================================
        // Esperar a que la URL cambie completamente antes de interactuar con el nuevo form
        cy.url().should('include', '/login');

        // Dar tiempo a que React monte el componente de login y estabilice el DOM
        // El AuthContext inicia con loading=true y puede deshabilitar controles
        cy.get('input#email').should('be.visible').and('not.be.disabled');
        cy.get('input#email').type(testUser.email);

        cy.get('input#password').should('be.visible').and('not.be.disabled');
        cy.get('input#password').type(testUser.password);

        cy.get('button[type="submit"]').contains('Iniciar Sesión').click();

        cy.wait('@loginApi').its('response.statusCode').should('eq', 200);

        // Validar redirección al home
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
});
