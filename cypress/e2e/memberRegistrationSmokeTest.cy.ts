const randomId = Math.floor(10 + Math.random() * 90);

describe("Member Registration module Smoke Test", () => {

    it("should add a record, save and redirect to the list view ", () => {
        cy.visit("/login");

        cy.get("input[name='email']").type("test@gmail.com");
        cy.get("input[name='password']").type("Test@123");
        cy.get("button[type='submit']").click();
        cy.url().should("include", "/dashboard");
        cy.contains("Church Management System").should("exist");

        cy.visit("/member-registrations/add");


        cy.get("input[name='church']").type("Test Church");

        cy.get("input[name='nameOfFather']").type(`Test Father-${randomId}`);
        cy.get("input[name='occupationOfFather']").type("Test Occ.");
        cy.get("input[name='dateOfBirthFather']").type("2000-01-01");
        cy.get("input[name='baptisedDateOfFather']").type("2000-01-31");
        cy.get("input[name='baptisedChurchOfFather']").type("2020-01-01");

        cy.get("input[name='nameOfMother']").type(`Test Mother-${randomId}`);
        cy.get("input[name='occupationOfMother']").type("Test Occ.");
        cy.get("input[name='dateOfBirthOfMother']").type("2000-01-01");
        cy.get("input[name='baptisedDateOfMother']").type("2000-01-30");
        cy.get("input[name='baptisedChurchOfMother']").type("2020-01-01");


        cy.get("textarea[name='address']").type("Test Address");
        cy.get("input[name='contactNo']").type("0771234567");
        cy.get("input[name='marriedDate']").type("2020-01-01");
        cy.get("input[name='marriedChurch']").type("Test Church");

        cy.get("input[name='capableDonationPerMonth']").type("5000");

        cy.contains('button', 'Add Child').click();

        cy.contains('Child 1').should('be.visible')
        cy.wait(500);

        // child component details
        cy.get('input[placeholder="Enter child\'s name"]').type('Test Child')
        cy.get('[data-testid="child-dob"]').type('2010-01-01')
        cy.get('[data-testid="child-baptised-date"]').type('2010-01-30')
        cy.get('input[placeholder="Child\'s Baptised Church"]').type('Test Church')

        cy.get("button[type='submit']").click();
        cy.url().should("include", "/member-registrations");
        cy.contains("Zonal Leaders").should("exist");
    });

});
