describe("Baptism module Smoke Test", () => {

    it("should add a baptism record, save and redirect to the list ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/baptisms/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='childName']").type(`Test child-${randomId}`);
        cy.get("input[name='dateOfBirth']").type("2000-01-01");
        cy.get("input[name='placeOfBirth']").type("Test place");
        cy.get("input[name='dateOfBaptism']").type("2000-01-01");
        cy.get("input[name='nameOfMother']").type("Test Mother");
        cy.get("input[name='nameOfFather']").type("Test Father");
        cy.get("input[name='nameOfGodFather']").type("Test God Father");
        cy.get("input[name='nameOfGodMother']").type("Test God Mother");
        cy.get("textArea[name='currentAddress']").type("Test Address");
        cy.get("input[name='contactNumber']").type("0771234567");
        cy.get("input[name='timeOfBaptism']").type("10:30");
        cy.get(".MuiSwitch-input").check({ force: true });

        cy.get("button[type='submit']").click();
        cy.url().should("include", "/baptism");
        cy.contains("Baptism Records").should("exist");
    });

});
