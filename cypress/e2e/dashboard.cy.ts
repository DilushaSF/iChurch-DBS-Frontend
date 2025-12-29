describe("Dashboard is Loading", () => {

    it("should redirect to dashboard after successful login", () => {
        cy.visit("http://localhost:5173/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");
    });

});