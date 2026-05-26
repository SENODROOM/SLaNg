# parseVariable

Parses variable names and powers from LaTeX strings.

## Purpose
Extract variable name and power from LaTeX variable notation like "x²" or "y^{10}".

## Features
- Simple variable parsing (x, y, z)
- Power notation support (^2, ^{10})
- Brace notation handling
- Power validation

## Usage
```js
const var = parseVariable('x^{2}');
// Returns: { variable: 'x', power: 2 }
```
