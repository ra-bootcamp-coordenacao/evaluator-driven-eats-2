function ensureElementExists(descriptor) {
  const isText = !!descriptor.text;
  const isXPath = !!descriptor.xpath;

  return cy.document().then(doc => {
    let element;

    if (isText) {
      element = doc.evaluate(`//*[contains(text(),"${descriptor.text}")]`, doc, null, 7).snapshotItem(0);
    } else if (isXPath) {
      element = doc.evaluate(descriptor.xpath, doc, null, 7).snapshotItem(0);
    } else {
      element = doc.querySelector(descriptor.selector);
    }

    return !!element;
  });
}

Cypress.Commands.add("runIfElementExists", function (descriptor, runOnElementExists, runOnElementNotExists) {
  return ensureElementExists(descriptor).then(elementExists => {
    if (elementExists && typeof runOnElementExists === "function") runOnElementExists(); 
    if (!elementExists && typeof runOnElementNotExists === "function") runOnElementNotExists();
  });
});
