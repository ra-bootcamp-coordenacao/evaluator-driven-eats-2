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

describe("Lógica: Formatação de mensagem conforme requisito", () => {
  it('Formatação de mensagem de acordo com o formato proposto', () => {
    cy.selectOptions().then((data) => {
      cy.orderConfirm().then(() => {
        cy.window().then((win) => {
          expect(messageMatch(win.location.href, data, 'format')).to.equal(2);
        });
      });
    });
  });
})
