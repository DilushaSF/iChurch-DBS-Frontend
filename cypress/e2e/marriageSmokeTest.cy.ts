describe("Marriage module Smoke Test", () => {

    it("should add a marriage record, save and redirect to the list ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/marriages/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='nameOfBride']").type(`Test Bride-${randomId}`);
        cy.get("input[name='nameOfGroom']").type(`Test Groom-${randomId}`);
        cy.get("input[name='shortenedCoupleName']").type("Te & St");
        cy.get("input[name='dateOfMarriage']").type("2000-01-01");
        cy.get("input[name='timeOfMass']").type("10:00");

        cy.get('[data-testid="mass-type-select"]').click()
        cy.contains('li', 'Full Mass').click()

        cy.get('[data-testid="need-choir"]').click()
        cy.get('[data-testid="need-deco"]').click()

        cy.get("button[type='submit']").click();
        cy.url().should("include", "/marriages");
        cy.contains("Marriage Records").should("exist");
    });

});
