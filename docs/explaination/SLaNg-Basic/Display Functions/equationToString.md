# equationToString

Convert an entire equation (array of products) to a human-readable string representation.

## The Code

```js
/**
 * Convert equation to readable string
 */
function equationToString(equation) {
    return equation.map(productToString).join(' + ');
}
```

## Line-by-Line Explanation

```js
function equationToString(equation) {
```
- **`equation`** — An array of products (where each product is an array of fractions)

```js
    return equation.map(productToString).join(' + ');
```
- Convert all products to strings and join them with addition
- **`equation.map(productToString)`** — Convert each product to string
- **`.join(' + ')`** — Join all product strings with ` + ` separator
- Example: `["(x)", "(y)"]` → `"(x) + (y)"`

```js
}
```
- Close the function

## How It Works

The function creates a string representation by:

1. Mapping over each product in the equation array
2. Converting each product to a string using `productToString`
3. Joining all product strings with ` + ` (addition sign)

**Format**: `product1 + product2 + product3 + ...`

## Equation Structure

```
Equation
  ├─ Product 1 (fraction1 * fraction2 * ...)
  ├─ Product 2 (fraction1 * fraction2 * ...)
  └─ Product 3 (fraction1 * fraction2 * ...)

String: "product1 + product2 + product3"
```

## Usage Examples

### Single Product Equation

```js
const fraction = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(5)
], 1);

const product = [fraction];
const equation = [product];

const result = equationToString(equation);

console.log(result);
// "(2*x^2 + 3*x + 5)"
```

### Two Products (Sum)

```js
const frac1 = createFraction([createTerm(3, { x: 2 })], 1);
const frac2 = createFraction([createTerm(2, { x: 1 })], 1);

const product1 = [frac1];
const product2 = [frac2];
const equation = [product1, product2];

const result = equationToString(equation);

console.log(result);
// "(3*x^2) + (2*x)"
// Represents: 3x² + 2x
```

### Complex Equation

```js
const frac1a = createFraction([createTerm(1, { x: 1 }), createTerm(2)], 1);
const frac1b = createFraction([createTerm(1, { x: 1 }), createTerm(3)], 1);

const frac2 = createFraction([createTerm(5, { y: 1 })], 1);

const frac3 = createFraction([createTerm(7)], 1);

const product1 = [frac1a, frac1b];  // (x + 2)(x + 3)
const product2 = [frac2];            // 5y
const product3 = [frac3];            // 7

const equation = [product1, product2, product3];

const result = equationToString(equation);

console.log(result);
// "(1*x + 2) * (1*x + 3) + (5*y) + (7)"
// Represents: (x + 2)(x + 3) + 5y + 7
```

### Multiple Products with Fractions

```js
const frac1 = createFraction([createTerm(2, { x: 1 })], 3);
const frac2 = createFraction([createTerm(4, { y: 2 })], 2);

const product1 = [frac1];
const product2 = [frac2];
const equation = [product1, product2];

const result = equationToString(equation);

console.log(result);
// "(2*x)/(3) + (4*y^2)/(2)"
// Represents: 2x/3 + 4y²/2
```

### Empty Equation

```js
const equation = [];

const result = equationToString(equation);

console.log(result);
// ""
// Empty string (no products to add)
```

### Single Constant

```js
const fraction = createFraction([createTerm(42)], 1);
const product = [fraction];
const equation = [product];

const result = equationToString(equation);

console.log(result);
// "(42)"
```

### Polynomial Sum

```js
const term1 = createFraction([createTerm(1, { x: 3 })], 1);
const term2 = createFraction([createTerm(2, { x: 2 })], 1);
const term3 = createFraction([createTerm(3, { x: 1 })], 1);
const term4 = createFraction([createTerm(4)], 1);

const equation = [[term1], [term2], [term3], [term4]];

const result = equationToString(equation);

console.log(result);
// "(1*x^3) + (2*x^2) + (3*x) + (4)"
// Represents: x³ + 2x² + 3x + 4
```

### Product of Products

```js
const frac1a = createFraction([createTerm(2, { x: 1 })], 1);
const frac1b = createFraction([createTerm(3, { y: 1 })], 1);

const frac2a = createFraction([createTerm(4, { x: 1 })], 1);
const frac2b = createFraction([createTerm(5, { y: 1 })], 1);

const product1 = [frac1a, frac1b];  // 2x * 3y
const product2 = [frac2a, frac2b];  // 4x * 5y

const equation = [product1, product2];

const result = equationToString(equation);

console.log(result);
// "(2*x) * (3*y) + (4*x) * (5*y)"
// Represents: 2x·3y + 4x·5y = 6xy + 20xy
```

### Mixed Terms

```js
const prod1 = [createFraction([createTerm(5, { x: 2 })], 1)];
const prod2 = [
    createFraction([createTerm(2, { x: 1 })], 1),
    createFraction([createTerm(3)], 1)
];
const prod3 = [createFraction([createTerm(7)], 1)];

const equation = [prod1, prod2, prod3];

const result = equationToString(equation);

console.log(result);
// "(5*x^2) + (2*x) * (3) + (7)"
// Represents: 5x² + 2x·3 + 7 = 5x² + 6x + 7
```

## String Format Examples

| Equation Structure | String Output | Mathematical |
|-------------------|---------------|--------------|
| `[[x²]]` | `"(1*x^2)"` | x² |
| `[[3x²], [2x]]` | `"(3*x^2) + (2*x)"` | 3x² + 2x |
| `[[(x+2)*(x+3)], [5y]]` | `"(1*x + 2) * (1*x + 3) + (5*y)"` | (x+2)(x+3) + 5y |
| `[]` | `""` | 0 (empty sum) |

## Issue with Negative Terms

Similar to `fractionToString`, this shows negative products as `+ -`:

```js
// Current output:
"(3*x^2) + (-2*x)"

// Better output would be:
"(3*x^2) - (2*x)"
```

**Potential improvement** (not in original code):
```js
function equationToString(equation) {
    if (equation.length === 0) return "0";
    
    const products = equation.map(productToString);
    let result = products[0];
    
    for (let i = 1; i < products.length; i++) {
        if (products[i].startsWith('(-')) {
            result += ' - ' + products[i].substring(2, products[i].length - 1);
        } else {
            result += ' + ' + products[i];
        }
    }
    
    return result;
}
```

## Empty Equation Handling

```js
const equation = [];
equationToString(equation);
// ""
```

Returns empty string. Mathematically, empty sum = 0.

**Potential improvement**:
```js
if (equation.length === 0) return "0";
```

## Full Hierarchy Example

```js
// Build: (x + 2)(x + 3) + 5y + 7

// Terms
const x = createTerm(1, { x: 1 });
const const2 = createTerm(2);
const const3 = createTerm(3);
const fiveY = createTerm(5, { y: 1 });
const seven = createTerm(7);

// Fractions
const xPlus2 = createFraction([x, const2], 1);
const xPlus3 = createFraction([x, const3], 1);
const yTerm = createFraction([fiveY], 1);
const constTerm = createFraction([seven], 1);

// Products
const product1 = [xPlus2, xPlus3];  // (x+2)(x+3)
const product2 = [yTerm];            // 5y
const product3 = [constTerm];        // 7

// Equation
const equation = [product1, product2, product3];

// Convert to string
console.log(equationToString(equation));
// "(1*x + 2) * (1*x + 3) + (5*y) + (7)"
```

## Use Cases

This function is useful for:

- Displaying complete equations
- Showing mathematical expressions before expansion
- Debugging complex equation structures
- Logging calculation steps
- Educational tools for teaching algebra
- Displaying factored forms
- Converting internal representation to readable text
- Showing step-by-step algebraic work

## Comparison with Other String Functions

| Function | Converts | Output Example |
|----------|----------|----------------|
| `termToString` | Single term | `"3*x^2"` |
| `fractionToString` | Numerator / Denominator | `"(3*x^2 + 2*x)/(2)"` |
| `productToString` | Array of fractions | `"(x + 2) * (x + 3)"` |
| `equationToString` | Array of products | `"(x + 2) * (x + 3) + (5*y)"` |

## Example Workflow

```js
// 1. Build equation
const equation = buildEquation();

// 2. Display original
console.log("Original:", equationToString(equation));

// 3. Simplify
const simplified = simplifyEquation(equation);
console.log("Simplified:", equationToString(simplified));

// 4. Differentiate
const derivative = differentiateEquation(simplified);
console.log("Derivative:", equationToString(derivative));

// 5. Evaluate
const value = evaluateEquation(derivative, { x: 2, y: 3 });
console.log("Value at x=2, y=3:", value);
```

## Dependencies

This function requires:
- **`productToString`** — To convert each product to a string
  - Which requires **`fractionToString`**
    - Which requires **`termToString`**

## Complete String Hierarchy

```
equationToString
  └─ productToString (for each product)
      └─ fractionToString (for each fraction)
          └─ termToString (for each term)
```

## Why Use This?

This function is useful for:

- Displaying complete mathematical equations
- Debugging complex expression structures
- Logging calculation results
- Educational tools for teaching algebra
- Showing expressions at various stages of manipulation
- Converting internal representation to human-readable text
- Verifying equation structure
- Documenting mathematical operations