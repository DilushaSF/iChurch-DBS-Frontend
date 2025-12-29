describe("Login & Register Pages", () => {
    it("Login page should be loaded", () => {
        cy.visit("http://localhost:5173/login");
        cy.contains("iChurch").should("exist");
    });

    it("Signup page should be loaded", () => {
        cy.visit("http://localhost:5173/register");
        cy.contains("Register your church account").should("exist");
    });

});