# latexToSlang

The main function to parse LaTeX mathematical expressions and convert them to SLaNg format.

## The Code

```js
/**
 * Main LaTeX to SLaNg converter with multiple parsing strategies
 */
function latexToSlang(latex, options = {}) {
    const defaults = {
        strictMode: false,
        allowImplicitMultiplication: true,
        fallbackParsing: true,
        verboseErrors: false
    };
    
    const opts = { ...defaults, ...options };
    latex = latex.trim();
    
    if (!latex) {
        throw new Error('Empty LaTeX expression');
    }
    
    try {
        // Strategy 1: Try fraction first (most complex)
        if (latex.includes('\\frac')) {
            return parseFraction(latex);
        }
        
        // Strategy 2: Try polynomial
        return parsePolynomial(latex);
        
    } catch (error) {
        if (opts.strictMode) {
            throw error;
        }
        
        // Strategy 3: Fallback to simple term parsing
        if (opts.fallbackParsing) {
            try {
                return parseTerm(latex);
            } catch (fallbackError) {
                const errorMsg = `Failed to parse LaTeX: "${latex}". Primary error: ${error.message}. Fallback error: ${fallbackError.message}`;
                if (opts.verboseErrors) {
                    throw new Error(errorMsg);
                } else {
                    throw new Error(`Invalid LaTeX expression: ${latex}`);
                }
            }
        }
        
        throw new Error(`Failed to parse LaTeX: ${latex}. Error: ${error.message}`);
    }
}
```

## How It Works

The function uses a **multi-strategy parsing approach**:

1. **Preprocessing**: Trims whitespace and validates input
2. **Strategy Selection**: Chooses parsing strategy based on LaTeX patterns
3. **Primary Parsing**: Attempts the most likely parsing method first
4. **Fallback Mechanism**: Uses alternative strategies if primary fails
5. **Error Handling**: Provides detailed error information

## Parsing Strategies

### Strategy 1: Fraction Detection
Looks for `\frac` commands and uses `parseFraction()`:

```js
if (latex.includes('\\frac')) {
    return parseFraction(latex);
}
```

**Handles**: `\frac{x}{y}`, `\frac{x^{2}+1}{x-1}`, etc.

### Strategy 2: Polynomial Parsing
Uses `parsePolynomial()` for expressions without fractions:

```js
return parsePolynomial(latex);
```

**Handles**: `x^{2} + 2x + 1`, `3x^{3} - 5x^{2}`, etc.

### Strategy 3: Term Fallback
Uses `parseTerm()` for simple expressions:

```js
return parseTerm(latex);
```

**Handles**: `x`, `5x^{2}`, `3.14`, etc.

## Usage Examples

### Simple Term Parsing

```js
import { latexToSlang } from './slang-convertor.js';

const slang1 = latexToSlang('x');
console.log(slang1); // { terms: [{ coeff: 1, var: { x: 1 } }] }

const slang2 = latexToSlang('5x^{2}');
console.log(slang2); // { terms: [{ coeff: 5, var: { x: 2 } }] }
```

### Polynomial Parsing

```js
const slang3 = latexToSlang('x^{2} + 2x + 1');
console.log(slang3);
// { terms: [
//   { coeff: 1, var: { x: 2 } },
//   { coeff: 2, var: { x: 1 } },
//   { coeff: 1 }
// ] }
```

### Fraction Parsing

```js
const slang4 = latexToSlang('\\frac{x}{x+1}');
console.log(slang4);
// { 
//   numi: { terms: [{ coeff: 1, var: { x: 1 } }] },
//   deno: { terms: [{ coeff: 1, var: { x: 1 } }, { coeff: 1 }] }
// }
```

## Configuration Options

### `strictMode` (boolean, default: false)
Enable strict parsing with no fallback:

```js
try {
    const slang = latexToSlang('invalid latex', { strictMode: true });
} catch (error) {
    console.log(error.message); // Detailed error about parsing failure
}
```

### `allowImplicitMultiplication` (boolean, default: true)
Allow implicit multiplication between variables:

```js
const slang = latexToSlang('xy', { allowImplicitMultiplication: true });
// Parses as x*y

const slang = latexToSlang('xy', { allowImplicitMultiplication: false });
// May throw error or handle differently
```

### `fallbackParsing` (boolean, default: true)
Enable fallback parsing strategies:

```js
const slang = latexToSlang('complex expression', { fallbackParsing: true });
// Tries multiple parsing methods
```

### `verboseErrors` (boolean, default: false)
Provide detailed error messages:

```js
try {
    const slang = latexToSlang('bad latex', { 
        fallbackParsing: true, 
        verboseErrors: true 
    });
} catch (error) {
    console.log(error.message); 
    // "Failed to parse LaTeX: 'bad latex'. Primary error: ... Fallback error: ..."
}
```

## Advanced Examples

### Complex Fraction with Nested Expressions

```js
const complexLatex = '\\frac{x^{3} - 2x^{2} + x - 1}{x^{2} + 3x - 4}';
const slang = latexToSlang(complexLatex, { verboseErrors: true });
console.log(slang);
// Complex fraction structure with polynomial numerator and denominator
```

### Scientific Notation

```js
const scientificLatex = '1.5e-3x^{2}';
const slang = latexToSlang(scientificLatex);
console.log(slang);
// { terms: [{ coeff: 0.0015, var: { x: 2 } }] }
```

### Multivariable Expressions

```js
const multiVarLatex = '2x^{2}y^{3} - 3xy^{2} + 5z';
const slang = latexToSlang(multiVarLatex);
console.log(slang);
// { terms: [
//   { coeff: 2, var: { x: 2, y: 3 } },
//   { coeff: -3, var: { x: 1, y: 2 } },
//   { coeff: 5, var: { z: 1 } }
// ] }
```

## Error Handling Examples

### Empty Input

```js
try {
    const slang = latexToSlang('');
} catch (error) {
    console.log(error.message); // "Empty LaTeX expression"
}
```

### Invalid Syntax

```js
try {
    const slang = latexToSlang('\\frac{x}{');
} catch (error) {
    console.log(error.message); // "Invalid fraction format: \\frac{x}{"
}
```

### Strict Mode vs Lenient Mode

```js
// Lenient mode (default)
try {
    const slang = latexToSlang('slightly invalid', { strictMode: false });
    // May succeed with fallback parsing
} catch (error) {
    // Handle error
}

// Strict mode
try {
    const slang = latexToSlang('slightly invalid', { strictMode: true });
    // Will throw error immediately
} catch (error) {
    console.log(error.message); // Detailed parsing error
}
```

## Supported LaTeX Features

### Numbers and Coefficients
- Integers: `1`, `42`, `-7`
- Decimals: `3.14`, `-2.5`
- Scientific notation: `1.5e3`, `2.5e-4`

### Variables and Powers
- Simple variables: `x`, `y`, `z`
- Powers: `x^2`, `x^{2}`, `y^{10}`
- Multiple variables: `xy`, `x^{2}y^{3}`

### Operations
- Addition: `x + y`
- Subtraction: `x - y`
- Multiplication: `xy`, `x \cdot y`, `x \times y`
- Fractions: `\frac{x}{y}`

### Parentheses and Grouping
- Simple: `(x + 1)`
- LaTeX: `\left(x + 1\right)`

## Performance Considerations

- **Strategy Selection**: O(1) - simple string checks
- **Early Validation**: Fails fast on invalid input
- **Fallback Chain**: Tries strategies in order of likelihood
- **Error Collection**: Collects errors from all strategies when verbose

## Integration with Other Functions

This function internally uses:

- `parseFraction()` - for fraction expressions
- `parsePolynomial()` - for polynomial expressions
- `parseTerm()` - for simple term expressions
- `parseNumber()` - for numeric coefficient parsing
- `parseVariable()` - for variable and power parsing

## Common Use Cases

### User Input Processing
```js
function processUserInput(latexInput) {
    try {
        const slang = latexToSlang(latexInput.trim(), { 
            strictMode: false,
            fallbackParsing: true 
        });
        return slang;
    } catch (error) {
        console.error('Invalid input:', error.message);
        return null;
    }
}
```

### Mathematical Expression Validation
```js
function validateLatexExpression(latex) {
    const validation = latexToSlang(latex, { 
        strictMode: true, 
        verboseErrors: true 
    });
    return validation;
}
```

### Educational Software
```js
function checkStudentAnswer(studentLatex, correctSlang) {
    try {
        const studentSlang = latexToSlang(studentLatex);
        return areExpressionsEquivalent(studentSlang, correctSlang);
    } catch (error) {
        return false; // Invalid LaTeX
    }
}
```

## Why Use This Function?

- **Robust Parsing**: Multiple strategies handle various LaTeX formats
- **Flexible Configuration**: Adaptable to different use cases
- **Comprehensive Error Handling**: Detailed feedback for debugging
- **Fallback Mechanisms**: Graceful degradation for malformed input
- **Performance**: Efficient strategy selection and early validation
- **Extensibility**: Easy to add new parsing strategies
