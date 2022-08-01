function clickAndRetrieve() {
  cy.xpath("//*[@data-identifier='dishes']//*[@data-identifier='food-option']")
    .first()
    .click()
    .then(function (element) {
      const elementHTML = element.get(0);
      this.dishTitle = elementHTML.querySelector(
        "*[data-identifier='food-title']"
      ).innerText;
      this.dishPrice = elementHTML.querySelector(
        "*[data-identifier='food-price']"
      ).innerText;
    });
  cy.xpath("//*[@data-identifier='drinks']//*[@data-identifier='food-option']")
    .first()
    .click()
    .then(function (element) {
      const elementHTML = element.get(0);
      this.drinkTitle = elementHTML.querySelector(
        "*[data-identifier='food-title']"
      ).innerText;
      this.drinkPrice = elementHTML.querySelector(
        "*[data-identifier='food-price']"
      ).innerText;
    });
  cy.xpath(
    "//*[@data-identifier='desserts']//*[@data-identifier='food-option']"
  )
    .first()
    .click()
    .then(function (element) {
      const elementHTML = element.get(0);
      this.dessertTitle = elementHTML.querySelector(
        "*[data-identifier='food-title']"
      ).innerText;
      this.dessertPrice = elementHTML.querySelector(
        "*[data-identifier='food-price']"
      ).innerText;

      const totalPrice = priceCalculation(
        this.dishPrice,
        this.drinkPrice,
        this.dessertPrice
      );

      return cy.wrap({
        dishTitle: this.dishTitle,
        drinkTitle: this.drinkTitle,
        dessertTitle: this.dessertTitle,
        totalPrice,
      });
    });
}

function priceCalculation(dishPrice, drinkPrice, dessertPrice) {
  return (
    parseFloat(dishPrice.replace('R$', '').replace(',', '.').replace(/\s/g, '')) +
    parseFloat(drinkPrice.replace('R$', '').replace(',', '.').replace(/\s/g, '')) +
    parseFloat(dessertPrice.replace('R$', '').replace(',', '.').replace(/\s/g, ''))
  );
}

Cypress.Commands.add('selectOptions', function () {
  cy.wait(0);
  return clickAndRetrieve();
});
