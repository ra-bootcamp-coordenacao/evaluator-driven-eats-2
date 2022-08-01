export default function findSimilarity(colorsBefore, colorsAfter) {
  if (colorsBefore === colorsAfter) return 1;
  if (colorsBefore === null || colorsAfter === null) return 0;
  if (colorsBefore.length !== colorsAfter.length) return 0;

  for (let i = 0; i < colorsBefore.length; i++) {
    if (colorsBefore[i] !== colorsAfter[i]) {
      return 0;
    }
  }
  return 1;
}
