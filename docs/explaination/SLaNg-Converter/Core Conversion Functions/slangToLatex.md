# slangToLatex

The main function to convert SLaNg mathematical expressions to LaTeX format.

## The Code

```js
/**
 * Main SLaNg to LaTeX converter with comprehensive options
 */
function slangToLatex(expression, options = {}) {
    const defaults = {
        parentheses: false,
        multiplySymbol: '', // '', '\\cdot', or '\\times'
        displayMode: false,
        simplify: true,
        precision: 10
    };
    
    const opts = { ...defaults, ...options };
    
    if (expression.terms) {
        // It's a polynomial
        return polynomialToLatex(expression, opts);
    } else if (expression.numi && expression.deno !== undefined) {
        // It's a fraction
        return fractionToLatex(expression, opts);
    } else if (expression.coeff !== undefined) {
        // It's a term
        return termToLatex(expression, opts);
    } else {
        throw new Error('Unsupported SLaNg expression type');
    }
}
```

## How It Works

The function acts as a **router** that determines the type of SLaNg expression and delegates to the appropriate converter:

1. **Type Detection**: Checks the structure of the input expression
2. **Routing**: Directs to the appropriate converter function
3. **Options Merging**: Combines default options with user-provided options
4. **Error Handling**: Throws descriptive errors for unsupported types

## Expression Type Detection

### Polynomial (has `terms` property)
```js
{ terms: [...] }
```

### Fraction (has `numi` and `deno` properties)
```js
{ numi: { terms: [...] }, deno: ... }
```

### Term (has `coeff` property)
```js
{ coeff: 5, var: { x: 2 } }
```

## Usage Examples

### Basic Term Conversion

```js
import { createTerm } from './slang-basic.js';
import { slangToLatex } from './slang-convertor.js';

const term = createTerm(5, { x: 2 });
const latex = slangToLatex(term);
console.log(latex); // "5x^{2}"
```

### Polynomial Conversion

```js
const polynomial = { 
    terms: [
        createTerm(1, { x: 2 }), 
        createTerm(-2, { x: 1 }), 
        createTerm(1)
    ] 
};
const latex = slangToLatex(polynomial);
console.log(latex); // "x^{2} - 2x + 1"
```

### Fraction Conversion

```js
const fraction = createFraction(
    [createTerm(1, { x: 1 })], 
    [createTerm(1, { x: 1 }), createTerm(1)]
);
const latex = slangToLatex(fraction);
console.log(latex); // "\\frac{x}{x + 1}"
```

## Configuration Options

### `parentheses` (boolean, default: false)
Wrap expressions with LaTeX parentheses:

```js
const latex = slangToLatex(expr, { parentheses: true });
// Result: "\\left(5x^{2}\\right)"
```

### `multiplySymbol` (string, default: '')
Control multiplication symbol between variables:

```js
const latex = slangToLatex(expr, { multiplySymbol: '\\cdot' });
// Result: "5 \\cdot x \\cdot y"

const latex = slangToLatex(expr, { multiplySymbol: '\\times' });
// Result: "5 \\times x \\times y"
```

### `displayMode` (boolean, default: false)
Format for display mode (affects some formatting decisions):

```js
const latex = slangToLatex(expr, { displayMode: true });
// May use different formatting for complex expressions
```

### `simplify` (boolean, default: true)
Enable expression simplification:

```js
const latex = slangToLatex(expr, { simplify: false });
// Preserves original structure without simplification
```

### `precision` (number, default: 10)
Decimal precision for numeric coefficients:

```js
const latex = slangToLatex(expr, { precision: 3 });
// Limits decimal places to 3
```

## Advanced Examples

### Complex Multivariable Expression

```js
const complexExpr = createFraction(
    [createTerm(2, { x: 3, y: 1 }), createTerm(-5, { x: 1, z: 2 })],
    [createTerm(1, { x: 2 }), createTerm(3, { y: 1 })]
);

const latex = slangToLatex(complexExpr, { 
    multiplySymbol: '\\cdot',
    parentheses: true 
});
console.log(latex);
// "\\frac{\\left(2 \\cdot x^{3} \\cdot y - 5 \\cdot x \\cdot z^{2}\\right)}{\\left(x^{2} + 3y\\right)}"
```

### Scientific Notation

```js
const scientificTerm = createTerm(1.5e-3, { x: 2 });
const latex = slangToLatex(scientificTerm, { precision: 6 });
console.log(latex); // "0.0015x^{2}"
```

## Error Handling

The function provides clear error messages for unsupported input:

```js
try {
    const latex = slangToLatex({ invalid: 'structure' });
} catch (error) {
    console.log(error.message); // "Unsupported SLaNg expression type"
}
```

## Performance Considerations

- **Type detection** is O(1) - simple property checks
- **Options merging** uses spread operator for efficiency
- **Delegation** to specialized functions ensures optimal handling
- **Error checking** happens early to fail fast

## Integration with Other Functions

This function is the main entry point that internally uses:

- `termToLatex()` - for individual terms
- `polynomialToLatex()` - for polynomials
- `fractionToLatex()` - for fractions

## Common Use Cases

### Mathematical Document Generation
```js
const expressions = [/* array of SLaNg expressions */];
const latexExpressions = expressions.map(expr => slangToLatex(expr));
```

### Educational Tools
```js
const studentAnswer = /* SLaNg expression */;
const formattedAnswer = slangToLatex(studentAnswer, { 
    multiplySymbol: '\\cdot' 
});
```

### Symbolic Computation Output
```js
const computationResult = /* SLaNg result */;
const displayResult = slangToLatex(computationResult, { 
    parentheses: true,
    precision: 4 
});
```

## Why Use This Function?

- **Unified Interface**: Single function for all SLaNg expression types
- **Flexible Options**: Customizable formatting behavior
- **Type Safety**: Automatic type detection and routing
- **Error Handling**: Clear error messages for debugging
- **Performance**: Efficient delegation to specialized converters
- **Consistency**: Standardized output format across all expression types
