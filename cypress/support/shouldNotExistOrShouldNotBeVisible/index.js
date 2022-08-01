Cypress.Commands.add("shouldNotExistOrShouldNotBeVisible", function (descriptor, message) {
  const isText = !!descriptor.text;
  const isXPath = !!descriptor.xpath;

  // o cy.contains e cy.get falha quando não encontra o elemento
  if (isText) {
    cy.document().then(doc => {
      const snapshot = doc.evaluate(`//*[contains(text(), "${descriptor.text}")]`, doc, null, 7);
      if (snapshot.snapshotLength) cy.get(snapshot.snapshotItem(0)).should("not.be.visible");
    });
  } else if (isXPath) {
    cy.document().then(doc => {
      const snapshot = doc.evaluate(descriptor.xpath, doc, null, 7);
      if (snapshot.snapshotLength) cy.get(snapshot.snapshotItem(0)).should("not.be.visible");
    });
  } else {
    cy.document().then(doc => {
      const element = doc.querySelector(descriptor.selector);
      if (element) cy.get(element).should("not.be.visible");
    });
  }
});
