/**
 * Finds the element and clicks on its center. Checks the element that received the click was the one clicked.
 * If not, checks if it was the parent recursively.
 */
function isVisible(elem, win, doc) {
  const style = win.getComputedStyle(elem);

  if (style.display === 'none') return false;
  if (style.visibility === 'none') return false;
  if (style.opacity < 0.1) return false;
  if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
      elem.getBoundingClientRect().width === 0) {
      return false;
  }

  const elemCenter = {
      x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
      y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
  };

  if (elemCenter.x < 0) return false;
  if (elemCenter.x > (doc.documentElement.clientWidth || win.innerWidth)) return false;
  if (elemCenter.y < 0) return false;
  if (elemCenter.y > (doc.documentElement.clientHeight || win.innerHeight)) return false;
  let pointContainer = doc.elementFromPoint(elemCenter.x, elemCenter.y);

  do {
      if (pointContainer === elem) return true;
  } while (pointContainer = pointContainer.parentNode);
  return false;
}

Cypress.Commands.add("isVisible", function (element, expecedVisibility) {
  return cy.get(element).then(element => {
    const domElement = element.get(0);

    return cy.window().then(win => {
      return cy.document().then(doc => {
        const visibility = isVisible(domElement, win, doc);
        if (typeof expecedVisibility === 'boolean') {
          expect(visibility).to.equal(expecedVisibility, `Expected element to ${expecedVisibility ? '' : 'not '} be visible but it is ${visibility ? 'visible' : 'not visible'}.`);;
        } else {
          return visibility;
        }
      });
    });
  });
});
