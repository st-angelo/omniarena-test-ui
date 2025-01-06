export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toPascalCase(input) {
  return input.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  });
}
