const findInMatrix = (matrix, desired) =>
  matrix.flat().find((color) => color.toLowerCase() === desired.toLowerCase());

export default findInMatrix;
