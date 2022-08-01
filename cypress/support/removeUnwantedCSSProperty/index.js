function kebabToCamel(string) {
  return string.split("-").map((value, index) => index > 0 ? (value[0]?.toUpperCase() || "") + value.substr(1) : value).join("");
}

function getDefaultStylesForTag(tag, document, window) {
  const baseElement = document.createElement(tag);
  document.body.appendChild(baseElement);
  const defaultStyles = JSON.parse(JSON.stringify(window.getComputedStyle(baseElement)));
  document.body.removeChild(baseElement);
  return defaultStyles;
}

function removePropertyFromAnyCSSStyle(unwantedProperty, document, window, defaultStylesTag = "div") {
  const defaultStyles = getDefaultStylesForTag(defaultStylesTag, document, window);
  const propertyName = kebabToCamel(unwantedProperty);
  
  for (const stylesheet of document.styleSheets) {
    for (const rule of stylesheet.rules) {
      if (!rule.style) continue;

      const setProperties = Object.keys(rule.style).filter(key => !isNaN(key)).map(key => rule.style[key]);
      const isPropertySet = setProperties.reduce((current, property) => current || property === unwantedProperty, false);
      
      if (isPropertySet) {
        if (rule.style[propertyName] !== defaultStyles[propertyName]) {
          rule.style[propertyName] = "initial";
        }
      }
    }
  }
}

Cypress.Commands.add("removeUnwantedCSSProperty", function (propertyName, elementBaseCSS = 'div') {
  return cy.window().then(win => {
    return cy.document().then(doc => {
      removePropertyFromAnyCSSStyle(propertyName, doc, win, elementBaseCSS);
    });
  });
});
