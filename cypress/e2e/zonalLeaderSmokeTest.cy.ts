describe("Zonal Leader module Smoke Test", () => {

    it("should add a record, save and redirect to the list view ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/zonal-leaders/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='firstName']").type("Test");
        cy.get("input[name='lastName']").type(`Leader-${randomId}`);
        cy.get("input[name='dateOfBirth']").type("2000-01-01");
        cy.get("input[name='contactNumber']").type("0771234567");
        cy.get("textarea[name='address']").type("Test Address");
        cy.get("input[name='appointedDate']").type("2020-01-01");

        cy.get("button[type='submit']").click();
        cy.url().should("include", "/zonal-leaders");
        cy.contains("Zonal Leaders").should("exist");
    });

});
