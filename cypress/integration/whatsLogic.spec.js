/// <reference types='cypress-xpath' />
import xpath from 'cypress-xpath';

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

describe('Lógica: Envio por WhatsApp', () => {
  it('O pedido é encaminhado por WhatsApp após clicar em enviar o pedido', () => {
    cy.selectOptions();
    cy.orderConfirm();

    cy.url().then((url) => {
      const matchers = [
        /api.whatsapp.com\/.*/g,
        /wa.me\/.*/g
      ];

      const matches = matchers.reduce((acc, val) => val.test(url) || acc, false);

      expect(matches).to.equal(true, 'Esperava que o link aberto tivesse "https://api.whatsapp.com/" e "https://wa.me/"');
    });
  });
});