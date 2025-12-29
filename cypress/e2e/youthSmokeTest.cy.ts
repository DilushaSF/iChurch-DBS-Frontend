describe("Youth Member Registering Smoke Test", () => {

    it("should load youth member adding form and redirects after submit", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/youth-association/add");

        const randomId = Math.floor(10 + Math.random() * 90);

        cy.get("input[name='firstName']").type("Test");
        cy.get("input[name='lastName']").type(`Member-${randomId}`);
        cy.get("input[name='dateOfBirth']").type("2000-01-01");
        cy.get("input[name='contactNumber']").type("0771234567");
        cy.get("textarea[name='address']").type("Test Address");
        cy.get("input[name='joinedDate']").type("2020-01-01");
        cy.get("input[name='position']").type("Test Team Member");
        cy.get(".MuiSwitch-input").check({ force: true });


        cy.get("button[type='submit']").click();
        cy.url().should("include", "/youth-association");
        cy.contains("Youth").should("exist");
    });

});
