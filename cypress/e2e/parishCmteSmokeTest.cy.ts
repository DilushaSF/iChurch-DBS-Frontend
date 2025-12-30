describe("Parish Committee module Smoke Test", () => {

    it("should add a record, save and redirect to the list view ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/parish-committee/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='firstName']").type("Test");
        cy.get("input[name='lastName']").type(`Member-${randomId}`);
        cy.get("textarea[name='address']").type("Test Address");
        cy.get("input[name='phoneNumber']").type("0771234567");

        cy.get('[name="zonalNumber"]').parent().click()
        cy.contains('li', 'Zone 1').click()

        cy.get('[name="unitNumber"]').parent().click();
        cy.contains('li', 'Unit 1').click();

        cy.get("input[name='position']").type("Test Position");
        cy.get("input[name='joinedDate']").type("2000-01-01");
        cy.get("input[name='representingCommittee']").type("Test Committee");

        cy.get("button[type='submit']").click();
        cy.url().should("include", "/parish-committee");
        cy.contains("Parish Committee").should("exist");
    });

});
