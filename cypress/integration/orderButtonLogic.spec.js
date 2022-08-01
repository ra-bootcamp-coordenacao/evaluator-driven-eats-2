/// <reference types='cypress-xpath' />
import xpath from 'cypress-xpath';
import findInMatrix from '../helpers/findInMatrix';
import findSimilarity from '../helpers/findSimilarity';

beforeEach(() => {
  cy.intercept(/https:\/\/api.whatsapp.com\/.*/g, (req) => {
    req.headers['Content-Type'] = 'text/html';
    req.reply('<h1>Hello!</h1>');
  });
  
  cy.intercept(/https:\/\/wa.me\/.*/g, (req) => {
    req.headers['Content-Type'] = 'text/html';
    req.reply('<h1>Hello!</h1>');
  });

  cy.visit(Cypress.env('url'), {
    onBeforeLoad(win) {
      cy.stub(win, 'prompt').returns('Teste').as('prompt');
      cy.stub(win, 'open').callsFake(url => win.location.href = url)
    }
  });
});

describe('Lógica: Habilitar botão de enviar pedido', () => {
  it('Botão de enviar pedido fica desabilitado até selecionar todos os pedidos', () => {
    cy.on('url:changed', () => {
      throw new Error(`Botão não está desabilitado corretamente`);
    })

    cy.xpath("//*[contains(text(),'Selecione os 3 itens')]").first().as('button');
    cy.xpath("//*[contains(text(),'Selecione os 3 itens')]").should('be.visible');
    cy.get('@button').click();
    cy.get('@prompt').should('not.be.called')
    cy.shouldNotExistOrShouldNotBeVisible({xpath: "//*[@data-identifier='confirmation-dialog']"}, 'O modal de confirmação não deveria estar visível');

    cy.analyseElement('@button').as('buttonBeforeAll');

    cy.xpath("//*[@data-identifier='dishes']//*[@data-identifier='food-option']").eq(0).as('firstDish').click();
    cy.analyseElement('@button').as('buttonAfterOne');
    cy.xpath("//*[@data-identifier='dishes']//*[@data-identifier='food-option']").eq(1).click();
    cy.get('@firstDish').click();
    cy.shouldNotExistOrShouldNotBeVisible({text: "Fechar pedido"}, 'O botão de confirmação deveria estar desabilitado');

    cy.xpath("//*[contains(text(),'Selecione os 3 itens')]").should('be.visible');
    cy.xpath("//*[@data-identifier='drinks']//*[@data-identifier='food-option']").first().click();
    cy.analyseElement('@button').as('buttonAfterTwo');

    cy.xpath("//*[contains(text(),'Selecione os 3 itens')]").should('be.visible');
    cy.xpath("//*[@data-identifier='desserts']//*[@data-identifier='food-option']").first().click();
    cy.xpath("//*[contains(text(),'Fechar pedido')]").as('button');
    cy.analyseElement('@button').as('buttonAfterThree');

    cy.wait(0).then(function () {
      cy.xpath("//*[contains(text(),'Fechar pedido')]").should('be.visible');
      expect(findSimilarity(this.buttonBeforeAll.asHexMatrix.flat(), this.buttonAfterOne.asHexMatrix.flat())).to.equal(1);

      expect(findSimilarity(this.buttonAfterOne.asHexMatrix.flat(), this.buttonAfterTwo.asHexMatrix.flat())).to.equal(1);

      expect(findSimilarity(this.buttonAfterTwo.asHexMatrix.flat(), this.buttonAfterThree.asHexMatrix.flat())).to.equal(0);

      expect(findInMatrix(this.buttonAfterThree.asHexMatrix, '#32b72f')).to.equal('#32b72f');
    });
  });

  it('Botão é habilitado ao selecionar os três', () => {
    cy.xpath("//*[@data-identifier='dishes']//*[@data-identifier='food-option']").eq(0).click();
    cy.xpath("//*[@data-identifier='drinks']//*[@data-identifier='food-option']").eq(0).click();
    cy.xpath("//*[@data-identifier='desserts']//*[@data-identifier='food-option']").eq(0).click();
    cy.xpath("//*[contains(text(),'Fechar pedido')]").as('orderConfirmButton').should('be.visible');
    cy.get('@orderConfirmButton').click();

    cy.runIfElementExists({xpath: "//*[@data-identifier='confirmation-dialog']"}, () => {}, () => {
      cy.url().then((url) => {
        const matchers = [
          /api.whatsapp.com\/.*/g,
          /wa.me\/.*/g
        ];

        const matches = matchers.reduce((acc, val) => val.test(url) || acc, false);

        expect(matches).to.equal(true, 'Esperava que o link aberto tivesse "https://api.whatsapp.com/" e "https://wa.me/"');
      });
    })
  });
});