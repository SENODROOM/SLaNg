# validateLatex

Validates LaTeX syntax before conversion.

## Purpose
Check if LaTeX expressions are syntactically correct for parsing.

## Features
- Strict validation mode
- Detailed error reporting
- Syntax checking
- Error collection

## Usage
```js
const validation = validateLatex('\\frac{x}{x+1}');
// Returns: { valid: true, errors: [] }

const invalid = validateLatex('\\frac{x}{');
// Returns: { valid: false, errors: ['Invalid fraction format'] }
```
