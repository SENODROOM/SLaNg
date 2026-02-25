# parsePolynomial

Parses LaTeX polynomial expressions into SLaNg polynomial objects.

## Purpose
Convert LaTeX polynomials like "2x³ - 5x² + 3x - 1" into SLaNg polynomial objects with term arrays.

## Features
- Multi-term parsing with sign handling
- Parentheses removal
- Proper term splitting
- Empty polynomial handling

## Usage
```js
const poly = parsePolynomial('2x^{3} - 5x^{2} + 3x - 1');
// Returns: { terms: [/* array of term objects */] }
```
