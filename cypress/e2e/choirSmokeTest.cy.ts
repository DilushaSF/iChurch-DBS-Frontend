describe("Choir module Smoke Test", () => {

    it("should add a choiristor, save and redirect to the list view ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/choiristors/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='firstName']").type("Test");
        cy.get("input[name='lastName']").type(`Choiristor-${randomId}`);
        cy.get("input[name='dateOfBirth']").type("2000-01-01");
        cy.get("input[name='contactNumber']").type("0771234567");
        cy.get("textarea[name='address']").type("Test Address");
        cy.get("input[name='joinedDate']").type("2020-01-01");

        cy.get('[name="choirType"]').parent().click();
        cy.contains('li', 'Senior Choir').click();

        cy.get('[name="voicePart"]').parent().click();
        cy.contains('li', 'Alto').click();

        cy.get('[name="instrumentsPlayed"]').parent().click();
        cy.contains('li', 'Guitar').click();

        cy.get(".MuiSwitch-input").check({ force: true });

        cy.get('button[type="submit"]').click({ force: true })
        cy.url().should("include", "/choiristors");
        cy.contains("Zonal Leaders").should("exist");
    });

});
