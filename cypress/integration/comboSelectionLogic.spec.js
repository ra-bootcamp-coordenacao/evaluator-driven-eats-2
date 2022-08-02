/// <reference types='cypress-xpath' />
import xpath from 'cypress-xpath';
import findSimilarity from '../helpers/findSimilarity';

beforeEach(() => {
  cy.visit(Cypress.env('url'));
});

describe('Lógica: Seleção do combo', () => {
  it('Teste', () => {
    cy.get('[data-test="test-me"]').should('be.visible');
  });

  it('Desmarcando ao selecionar outro item', () => {
    cy.xpath(
        "//*[@data-identifier='dishes']//*[@data-identifier='food-option']"
      )
      .first()
      .as('firstDish');
    cy.analyseElement('@firstDish').as('firstBeforeClick');

    cy.get('@firstDish').click();
    cy.analyseElement('@firstDish').as('firstAfterClick');

    cy.xpath(
        "//*[@data-identifier='dishes']//*[@data-identifier='food-option']"
      )
      .eq(1)
      .as('secondDish');
    cy.analyseElement('@secondDish').as('secondBeforeClick');

    cy.get('@secondDish').click();
    cy.analyseElement('@secondDish').as('secondAfterClick');

    cy.analyseElement('@firstDish').as('firstAfterChange');
    cy.wait(0).then(function () {
      expect(
        findSimilarity(
          this.firstBeforeClick.asHexMatrix.flat(),
          this.firstAfterClick.asHexMatrix.flat()
        )
      ).to.equal(0);

      expect(
        findSimilarity(
          this.secondBeforeClick.asHexMatrix.flat(),
          this.secondAfterClick.asHexMatrix.flat()
        )
      ).to.equal(0);

      expect(
        findSimilarity(
          this.firstAfterChange.asHexMatrix.flat(),
          this.firstAfterClick.asHexMatrix.flat()
        )
      ).to.equal(0);
    });
  });
});