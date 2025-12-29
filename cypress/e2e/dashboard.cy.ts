describe("Dashboard is Loading", () => {

    it("should redirect to dashboard after successful login", () => {
        cy.visit("http://localhost:5173/login");

        cy.get("input[name='email']").type("sindutharu821@gmail.com");
        cy.get("input[name='password']").type("Amandoluwa@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");
    });

});