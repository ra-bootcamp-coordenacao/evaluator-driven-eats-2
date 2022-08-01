/*Takes a screenshot of an element and returns the base64 data of the screenshot*/
Cypress.Commands.add('base64screenshot', function (element) {
  return cy.wrap(null).then(() => {
    cy.task('rmdir', ['cypress', 'screenshots']);
    cy.wait(1000);

    return cy
      .get(element)
      .first()
      .screenshot('screenshot')
      .then(() => {
        return cy
          .task('getFile', ['cypress', 'screenshots', 'screenshot.png'])
          .then((data) => {
            return `data:image/png;base64, ${data}`;
          });
      });
  });
});

const toHex = ([r, g, b]) =>
  '#' +
  r.toString(16).padStart(2, '0') +
  g.toString(16).padStart(2, '0') +
  b.toString(16).padStart(2, '0');

/*Analyses a canvas (<canvas>) returning the average of red, green, blue and its brightness*/
function getCanvasData(canvas, ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let r,
    g,
    b,
    avg,
    colorSum = 0;
  let totalRed = 0,
    totalGreen = 0,
    totalBlue = 0;
  const imageAsMatrix = [];
  let currentLine = [];

  for (let x = 0, len = data.length; x < len; x += 4) {
    r = data[x];
    g = data[x + 1];
    b = data[x + 2];

    totalRed += r;
    totalGreen += g;
    totalBlue += b;

    avg = Math.floor((r + g + b) / 3);
    colorSum += avg;

    currentLine.push([r, g, b]);
    if (currentLine.length === canvas.width) {
      imageAsMatrix.push(currentLine);
      currentLine = [];
    }
  }

  const pixels = canvas.width * canvas.height;

  const brightness = Math.floor(colorSum / pixels);
  const red = Math.floor(totalRed / pixels);
  const green = Math.floor(totalGreen / pixels);
  const blue = Math.floor(totalBlue / pixels);

  return {
    brightness,
    red,
    green,
    blue,
    asMatrix: imageAsMatrix,
    asHexMatrix: imageAsMatrix.map((line) => line.map(toHex)),
  };
}

function getImageData(base64image, startX = 0, startY = 0, width, height) {
  const img = new Image();
  let loaded = false;
  img.src = base64image;
  img.onload = () => {
    if (!width) width = img.width;
    if (!height) height = img.height;

    if (startX >= 0) startX = -startX;
    else startX = -(img.width + startX);

    if (startY >= 0) startY = -startY;
    else startY = -(img.height + startY);

    loaded = true;
  };

  return cy
    .waitUntil(() => loaded === true)
    .then(() => {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, startX, startY, img.width, img.height);

      return getCanvasData(canvas, ctx);
    });
}

Cypress.Commands.add(
  'analyseImage',
  function (base64Image, startX, startY, width, height) {
    return getImageData(base64Image, startX, startY, width, height);
  }
);

/* Returns the average of red, green and blue of an element, including its brightness.
 * startX, startY, width and height are optional parameters. You can use them to get
 * the average values for a part of the element (like a 5px by 5px area on the top left corner: cy.analyseElement("element", 0, 0, 5, 5))
 */
Cypress.Commands.add(
  'analyseElement',
  function (element, startX, startY, width, height) {
    cy.wait(100);

    return cy.base64screenshot(element).then((screenshot) => {
      return cy.analyseImage(screenshot, startX, startY, width, height);
    });
  }
);
