function orderConfirm() {
  cy.window().then((win) => {
    cy.stub(win, 'prompt').returns('Test');
    cy.stub(win, 'open').callsFake(url => win.location.href = url)
    cy.xpath("//*[contains(text(),'Fechar pedido')]").first().click();
    cy.wait(0);

    cy.runIfElementExists(
      { xpath: "//*[@data-identifier='confirmation-dialog']" },
      () => {
        cy.xpath("//*[contains(text(),'Tudo certo')]").first().click();
      }
    );
  });
}

Cypress.Commands.add('orderConfirm', function () {
  return orderConfirm();
});
