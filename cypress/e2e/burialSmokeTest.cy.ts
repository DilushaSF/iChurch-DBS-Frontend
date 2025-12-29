describe("Burial module Smoke Test", () => {

    it("should add a burial record, save and redirect to the list ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/burials/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='nameOfDeceased']").type(`Test Record-${randomId}`);
        cy.get("input[name='custodian']").type("Test Custodian");
        cy.get("input[name='dateOfDeath']").type("2025-01-01");
        cy.get("input[name='dateOfBirth']").type("2000-01-01");
        cy.get("input[name='dateWillBurry']").type("2025-01-04");
        cy.get("textarea[name='caouseOfDeath']").type("Test Cause");
        cy.get("input[name='baptized']").type("true");

        cy.get("button[type='submit']").click();
        cy.url().should("include", "/burials");
        cy.contains("Burial Records").should("exist");
    });

});
