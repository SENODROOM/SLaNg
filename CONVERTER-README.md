# SLaNg LaTeX Converter - Unified Edition

## 🚀 Overview

The SLaNg LaTeX Converter is a comprehensive, bidirectional conversion system that transforms mathematical expressions between SLaNg (Saad Language for Analytical Numerics and Geometry) and LaTeX formats. This unified edition combines the best features from all previous versions into a single, robust implementation.

## 📁 Files

- **`slang-convertor.js`** - Main converter library (unified edition)
- **`experiments/test-unified.js`** - Comprehensive test suite
- **`experiments/converter-demo.js`** - Full demonstration of capabilities

## 🔧 Installation & Usage

```javascript
import { slangToLatex, latexToSlang } from './slang-convertor.js';

// SLaNg to LaTeX
const expr = createFraction([createTerm(1, { x: 1 })], [createTerm(1, { x: 1 }), createTerm(1)]);
const latex = slangToLatex(expr); // → \frac{x}{x + 1}

// LaTeX to SLaNg
const slang = latexToSlang('\\frac{x}{x+1}');
```

## 🎯 Core Features

### ✅ Bidirectional Conversion
- **SLaNg → LaTeX**: Convert SLaNg expressions to proper LaTeX format
- **LaTeX → SLaNg**: Parse LaTeX back to SLaNg data structures
- **Round-trip testing**: Ensures conversion fidelity

### 📐 Supported Expression Types
- **Terms**: `5x²`, `-3y³`, `2.14x`
- **Polynomials**: `x² - 2x + 1`, `2x³ - 5x² + 3x - 1`
- **Rational Functions**: `x/(x+1)`, `(x²-1)/(x²+1)`
- **Multivariable**: `x²y/(x+y)`, `2x + 3y - z`

### 🔧 Advanced Capabilities
- **Enhanced parsing**: Handles coefficients, variables, and powers correctly
- **Power notation**: Supports both `x^2` and `x^{2}` formats
- **Fraction parsing**: Complex nested expressions in fractions
- **Batch processing**: Convert multiple expressions at once
- **Validation**: Check LaTeX syntax validity
- **Display formatting**: Automatic inline/display mode selection

## 🛠️ API Reference

### Core Functions

#### `slangToLatex(expression, options)`
Convert SLaNg expression to LaTeX.

**Options:**
- `parentheses`: Boolean - Wrap with `\left(` and `\right)`
- `multiplySymbol`: String - `''`, `\cdot`, or `\times`
- `displayMode`: Boolean - Force display mode
- `simplify`: Boolean - Enable simplification (default: true)
- `precision`: Number - Decimal precision (default: 10)

#### `latexToSlang(latex, options)`
Parse LaTeX to SLaNg expression.

**Options:**
- `strictMode`: Boolean - Strict parsing (default: false)
- `allowImplicitMultiplication`: Boolean - Allow implicit multiplication
- `fallbackParsing`: Boolean - Enable fallback strategies
- `verboseErrors`: Boolean - Detailed error messages

### Advanced Functions

#### `batchConvertToLatex(expressions, options)`
Convert multiple SLaNg expressions to LaTeX.

#### `batchConvertToSlang(latexExpressions, options)`
Convert multiple LaTeX expressions to SLaNg.

#### `validateLatex(latex, options)`
Validate LaTeX syntax. Returns `{ valid: boolean, errors: string[] }`.

#### `formatDisplayMode(latex, options)`
Format LaTeX for display mode. Returns `$...$` or `$$...$$`.

#### `getConversionInfo(expression, direction)`
Get metadata about conversion (type, complexity, etc.).

## 📊 Examples

### Basic Conversions
```javascript
import { createTerm, createFraction } from './slang-basic.js';
import { slangToLatex, latexToSlang } from './slang-convertor.js';

// Simple term
const term = createTerm(5, { x: 2 });
console.log(slangToLatex(term)); // → 5x^{2}

// Polynomial
const poly = { terms: [createTerm(1, { x: 2 }), createTerm(-2, { x: 1 }), createTerm(1)] };
console.log(slangToLatex(poly)); // → x^{2} - 2x + 1

// Fraction
const frac = createFraction([createTerm(1, { x: 1 })], [createTerm(1, { x: 1 }), createTerm(1)]);
console.log(slangToLatex(frac)); // → \frac{x}{x + 1}
```

### LaTeX to SLaNg
```javascript
// Parse LaTeX
const slang1 = latexToSlang('x^{2} + 2x + 1');
const slang2 = latexToSlang('\\frac{x}{x+1}');
const slang3 = latexToSlang('2x^{2} + 3x - 1');
```

### Batch Processing
```javascript
const expressions = [term, poly, frac];
const results = batchConvertToLatex(expressions, { includeErrors: true });
console.log(`Success: ${results.results.filter(r => r.success).length}/${results.results.length}`);
```

### Validation
```javascript
const validation = validateLatex('\\frac{x}{x+1}');
if (validation.valid) {
    console.log('Valid LaTeX!');
} else {
    console.log('Errors:', validation.errors);
}
```

## 🧪 Testing

Run the comprehensive test suite:
```bash
cd experiments
node test-unified.js
```

Run the full demonstration:
```bash
cd experiments
node converter-demo.js
```

## 🔍 Error Handling

The converter provides robust error handling with multiple fallback strategies:

1. **Primary parsing**: Attempts to parse using standard patterns
2. **Fallback parsing**: Uses alternative strategies if primary fails
3. **Error reporting**: Detailed error messages for debugging
4. **Validation**: Pre-conversion syntax checking

## 🎛️ Configuration Options

### SLaNg to LaTeX Options
```javascript
const options = {
    parentheses: true,           // Wrap with parentheses
    multiplySymbol: '\\cdot',    // Multiplication symbol
    displayMode: false,          // Force display mode
    simplify: true,              // Enable simplification
    precision: 10                // Decimal precision
};
```

### LaTeX to SLaNg Options
```javascript
const options = {
    strictMode: false,               // Strict parsing
    allowImplicitMultiplication: true, // Allow implicit multiplication
    fallbackParsing: true,           // Enable fallback strategies
    verboseErrors: false              // Detailed error messages
};
```

## 📈 Performance

The converter is optimized for:
- **Speed**: Efficient parsing algorithms
- **Memory**: Minimal object creation
- **Scalability**: Handles large expressions
- **Reliability**: Comprehensive error handling

## 🔄 Migration from Previous Versions

If you were using the previous converter versions:

1. **Import path**: Same (`./slang-convertor.js`)
2. **API compatibility**: All previous functions maintained
3. **New features**: Additional advanced functions available
4. **Enhanced error handling**: Better error reporting

## 🚀 Advanced Features

### Expression Complexity Analysis
```javascript
import { getExpressionComplexity } from './slang-convertor.js';

const complexity = getExpressionComplexity(expr);
console.log(`Expression complexity: ${complexity}`);
```

### Expression Equivalence
```javascript
import { areExpressionsEquivalent } from './slang-convertor.js';

const equivalent = areExpressionsEquivalent(expr1, expr2);
console.log(`Expressions are equivalent: ${equivalent}`);
```

### Conversion Metadata
```javascript
import { getConversionInfo } from './slang-convertor.js';

const info = getConversionInfo(expr, 'to-latex');
console.log(`Expression type: ${info.expressionType}`);
console.log(`Term count: ${info.termCount}`);
```

## 📝 Supported LaTeX Features

### Numbers and Coefficients
- Integers: `1`, `42`, `-7`
- Decimals: `3.14`, `-2.5`
- Scientific notation: `1.5e3`

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

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid LaTeX expression"**
   - Check syntax with `validateLatex()`
   - Use `verboseErrors: true` for detailed messages

2. **Round-trip conversion differences**
   - Some simplification may occur
   - Check with `areExpressionsEquivalent()`

3. **Complex expressions not parsing**
   - Try `fallbackParsing: true`
   - Use `strictMode: false` for more lenient parsing

### Debug Mode
```javascript
const slang = latexToSlang(latex, { 
    strictMode: false, 
    fallbackParsing: true, 
    verboseErrors: true 
});
```

## 📚 License

This converter is part of the SLaNg project and follows the same license terms.

## 🤝 Contributing

To contribute to the converter:
1. Run existing tests: `node experiments/test-unified.js`
2. Add new test cases for new features
3. Maintain backward compatibility
4. Update documentation

## 🚀 Production Ready

The SLaNg LaTeX Converter is production-ready with:
- ✅ Comprehensive test coverage
- ✅ Robust error handling
- ✅ Performance optimization
- ✅ Full API documentation
- ✅ Migration guides
- ✅ Troubleshooting support

---

**Version**: Unified Edition 2.0  
**Last Updated**: 2025-02-25  
**Status**: Production Ready 🚀
