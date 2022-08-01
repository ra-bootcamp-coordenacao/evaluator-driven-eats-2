Cypress.Commands.add("placeholderContains", function (text) {
  return cy.xpath(`//*[@placeholder='${text}']`);
});
