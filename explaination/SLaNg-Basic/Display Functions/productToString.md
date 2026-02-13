# productToString

Convert a product (array of fractions) to a human-readable string representation.

## The Code

```js
/**
 * Convert product to readable string
 */
function productToString(product) {
    return product.map(fractionToString).join(' * ');
}
```

## Line-by-Line Explanation

```js
function productToString(product) {
```
- **`product`** — An array of fractions to be multiplied together

```js
    return product.map(fractionToString).join(' * ');
```
- Convert all fractions to strings and join them with multiplication
- **`product.map(fractionToString)`** — Convert each fraction to string
- **`.join(' * ')`** — Join all fraction strings with ` * ` separator
- Example: `["(x + 2)", "(x + 3)"]` → `"(x + 2) * (x + 3)"`

```js
}
```
- Close the function

## How It Works

The function creates a string representation by:

1. Mapping over each fraction in the product array
2. Converting each fraction to a string using `fractionToString`
3. Joining all fraction strings with ` * ` (multiplication sign)

**Format**: `fraction1 * fraction2 * fraction3 * ...`

## Usage Examples

### Single Fraction Product

```js
const fraction = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(3)
], 1);

const product = [fraction];

const result = productToString(product);

console.log(result);
// "(2*x + 3)"
```

### Two Fractions (Simple Multiplication)

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(3)
], 1);

const product = [frac1, frac2];

const result = productToString(product);

console.log(result);
// "(1*x + 2) * (1*x + 3)"
// Represents: (x + 2)(x + 3)
```

### Three Fractions

```js
const frac1 = createFraction([createTerm(1, { x: 1 }), createTerm(1)], 1);
const frac2 = createFraction([createTerm(1, { x: 1 }), createTerm(2)], 1);
const frac3 = createFraction([createTerm(1, { x: 1 }), createTerm(3)], 1);

const product = [frac1, frac2, frac3];

const result = productToString(product);

console.log(result);
// "(1*x + 1) * (1*x + 2) * (1*x + 3)"
// Represents: (x + 1)(x + 2)(x + 3)
```

### Product with Fractions (deno ≠ 1)

```js
const frac1 = createFraction([createTerm(2, { x: 1 })], 3);
const frac2 = createFraction([createTerm(3, { x: 2 })], 2);

const product = [frac1, frac2];

const result = productToString(product);

console.log(result);
// "(2*x)/(3) * (3*x^2)/(2)"
// Represents: (2x/3) × (3x²/2)
```

### Empty Product

```js
const product = [];

const result = productToString(product);

console.log(result);
// ""
// Empty string (no fractions to multiply)
```

### Single Monomial

```js
const fraction = createFraction([createTerm(5, { x: 2 })], 1);
const product = [fraction];

const result = productToString(product);

console.log(result);
// "(5*x^2)"
```

### Complex Product

```js
const frac1 = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(1)
], 1);

const frac2 = createFraction([
    createTerm(1, { y: 1 }),
    createTerm(2)
], 1);

const frac3 = createFraction([createTerm(3)], 2);

const product = [frac1, frac2, frac3];

const result = productToString(product);

console.log(result);
// "(2*x^2 + 3*x + 1) * (1*y + 2) * (3)/(2)"
// Represents: (2x² + 3x + 1)(y + 2)(3/2)
```

### Product of Constants

```js
const frac1 = createFraction([createTerm(5)], 1);
const frac2 = createFraction([createTerm(3)], 1);
const frac3 = createFraction([createTerm(2)], 1);

const product = [frac1, frac2, frac3];

const result = productToString(product);

console.log(result);
// "(5) * (3) * (2)"
// Represents: 5 × 3 × 2 = 30
```

### Product with Multiple Variables

```js
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { y: 1 }),
    createTerm(3)
], 1);

const product = [frac1, frac2];

const result = productToString(product);

console.log(result);
// "(1*x + 2) * (1*y + 3)"
// Represents: (x + 2)(y + 3)
```

## String Format Examples

| Product | String Output | Mathematical |
|---------|---------------|--------------|
| `[(x + 2)]` | `"(1*x + 2)"` | (x + 2) |
| `[(x + 2), (x + 3)]` | `"(1*x + 2) * (1*x + 3)"` | (x + 2)(x + 3) |
| `[(2x)/3, (3x²)/2]` | `"(2*x)/(3) * (3*x^2)/(2)"` | (2x/3)(3x²/2) |
| `[]` | `""` | 1 (empty product) |
| `[(5), (3)]` | `"(5) * (3)"` | 5 × 3 |

## Why Use ` * ` Separator?

```js
.join(' * ')
```

**Clear multiplication notation**:
- Unambiguous operator
- Standard in programming
- Easy to read

**Alternative notations** (not used):
- `×` — Unicode multiplication sign
- `·` — Middle dot
- No separator — Implicit multiplication like `(x+2)(x+3)`

## Empty Product Handling

```js
const product = [];
productToString(product);
// ""
```

Returns empty string. Mathematically, empty product = 1, but this isn't represented in the string.

**Potential improvement**:
```js
function productToString(product) {
    if (product.length === 0) return "1";
    return product.map(fractionToString).join(' * ');
}
```

## Relationship to Mathematical Notation

| Code Output | Standard Math Notation |
|-------------|----------------------|
| `"(x + 2) * (x + 3)"` | (x + 2)(x + 3) |
| `"(x)/(2) * (y)/(3)"` | (x/2)(y/3) |

Mathematical notation often omits the explicit `×` or `*` between terms.

## Use Cases

This function is useful for:

- Displaying products in readable format
- Debugging product structures
- Showing multiplication before expansion
- Logging intermediate calculation steps
- Educational tools showing factored forms
- Verifying product structure
- Converting to calculator input

## Usage in Expression Hierarchy

```
Product
  ├─ Fraction 1: (numerator)/(denominator)
  ├─ Fraction 2: (numerator)/(denominator)
  └─ Fraction 3: (numerator)/(denominator)

String: "fraction1 * fraction2 * fraction3"
```

## Example with Full Context

```js
// Build a product
const frac1 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2)
], 1);

const frac2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(-2)
], 1);

const product = [frac1, frac2];

// Convert to string
const str = productToString(product);
console.log(str);
// "(1*x + 2) * (1*x + -2)"

// Expand it
const expanded = expandProduct(product);
console.log(fractionToString(expanded));
// "(1*x^2 + -4)"  // x² - 4 (difference of squares)
```

## Dependencies

This function requires:
- **`fractionToString`** — To convert each fraction in the product to a string
  - Which requires **`termToString`**

## Why Use This?

This function is useful for:

- Displaying products in human-readable format
- Showing factored polynomial forms
- Debugging and logging
- Educational tools for teaching multiplication
- Displaying expressions before expansion
- Verifying product structure
- Converting internal representation to text
- Showing step-by-step algebraic work