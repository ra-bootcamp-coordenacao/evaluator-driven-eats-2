/// <reference types='cypress-xpath' />
import xpath from 'cypress-xpath';
import messageMatch from '../helpers/messageMatch';

beforeEach(() => {
  cy.intercept(/https:\/\/api.whatsapp.com\/.*/g, (req) => {
    req.headers['Content-Type'] = 'text/html';
    req.reply('<h1>Hello!</h1>');
  });
  
  cy.intercept(/https:\/\/wa.me\/.*/g, (req) => {
    req.headers['Content-Type'] = 'text/html';
    req.reply('<h1>Hello!</h1>');
  });

  cy.visit(Cypress.env('url'));
});

describe('Lógica: Conteúdo da mensagem de acordo com o combo', () => {
  it('A mensagem deve estar com pratos e preço de acordo com o que o usuário escolheu', () => {
    cy.selectOptions().then((data) => {
      cy.orderConfirm().then(() => {
        cy.window().then((win) => {
          expect(messageMatch(win.location.href, data)).to.equal(1);
        });
      });
    });
  });
});