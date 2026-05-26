# parseTerm

Parses individual LaTeX terms into SLaNg term objects.

## Purpose
Convert LaTeX term strings like "3x²y" into SLaNg term objects with coefficient and variables.

## Features
- Coefficient extraction (integers, decimals, scientific notation)
- Variable parsing with powers
- Multiplication symbol handling
- Special cases (implicit coefficients)

## Usage
```js
const term = parseTerm('3x^{2}y');
// Returns: { coeff: 3, var: { x: 2, y: 1 } }
```
