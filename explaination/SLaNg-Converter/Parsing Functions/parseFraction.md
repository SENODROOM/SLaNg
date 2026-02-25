# parseFraction

Parses LaTeX fraction expressions into SLaNg fraction objects.

## Purpose
Convert LaTeX fractions like "\frac{x²+1}{x-1}" into SLaNg fraction objects with numerator and denominator.

## Features
- Complex numerator/denominator parsing
- Nested expression support
- Constant denominator detection
- Enhanced regex for nested braces

## Usage
```js
const frac = parseFraction('\\frac{x^{2} + 1}{x - 1}');
// Returns: { numi: { terms: [...] }, deno: { terms: [...] } }
```
