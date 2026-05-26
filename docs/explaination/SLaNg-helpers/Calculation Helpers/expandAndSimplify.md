# expandAndSimplify

Expand a product expression and simplify the result.

## The Purpose

Combines multiplication of factors with simplification in one call.

## The Code

```js
/**
 * Expand and simplify a product expression
 */
function expandAndSimplify(productArray) {
    const expanded = expandProduct(productArray);
    return simplifyFraction(expanded);
}
```

## Line-by-Line Explanation

```js
function expandAndSimplify(productArray) {
```
- **`productArray`** — Array of fractions to multiply
- Format: `[fraction₁, fraction₂, ...]`
- Each fraction represents a polynomial factor

```js
    const expanded = expandProduct(productArray);
```
- **`expandProduct`** — Multiply all factors together
- Distributes terms: (a+b)(c+d) = ac + ad + bc + bd
- Returns expanded form as single fraction

```js
    return simplifyFraction(expanded);
```
- **`simplifyFraction`** — Simplifies the expanded result
- Combines like terms
- Reduces coefficients
- Returns clean, simplified fraction

## How It Works

1. **Expand**: Multiply out all factors
2. **Simplify**: Combine like terms and reduce
3. **Return**: Clean polynomial

## Usage Examples

### Expand (x+1)(x-1)

```js
// (x+1)(x-1) = x² - 1
const f1 = sum([[1, {x:1}], [1, {}]]);
const f2 = sum([[1, {x:1}], [-1, {}]]);

const prod = product(f1, f2);
const result = expandAndSimplify(prod[0]);

const value = evaluateEquation([[result]], {x: 5});
console.log(value); // 24
```

### Expand (x+2)²

```js
// (x+2)² = x² + 4x + 4
const factor = sum([[1, {x:1}], [2, {}]]);
const prod = product(factor, factor);

const result = expandAndSimplify(prod[0]);

const value = evaluateEquation([[result]], {x: 3});
console.log(value); // 9 + 12 + 4 = 25
```

### Three Factors

```js
// (x)(x+1)(x+2)
const f1 = sum([[1, {x:1}]]);
const f2 = sum([[1, {x:1}], [1, {}]]);
const f3 = sum([[1, {x:1}], [2, {}]]);

const prod = product(f1, f2, f3);
const result = expandAndSimplify(prod[0]);

// x³ + 3x² + 2x
const value = evaluateEquation([[result]], {x: 2});
console.log(value); // 8 + 12 + 4 = 24
```

### Binomial Cubed

```js
// (x+1)³ = x³ + 3x² + 3x + 1
const binomial = sum([[1, {x:1}], [1, {}]]);
const prod = product(binomial, binomial, binomial);

const result = expandAndSimplify(prod[0]);

const value = evaluateEquation([[result]], {x: 2});
console.log(value); // 8 + 12 + 6 + 1 = 27
```

## expandAndSimplify vs Manual Steps

```js
// Manual: two separate calls
const expanded = expandProduct(productArray);
const simplified = simplifyFraction(expanded);

// expandAndSimplify: one call
const result = expandAndSimplify(productArray);
```

## Dependencies

- **`expandProduct`** — Multiplies factors
- **`simplifyFraction`** — Combines like terms

## Why Use This?

- **Convenience**: One-step expansion and simplification
- **Cleaner Code**: Fewer function calls
- **Common Pattern**: Usually want both operations

## Real-World Applications

### Factored to Standard Form

```js
// Convert (x-r₁)(x-r₂) to ax² + bx + c
const factor1 = sum([[1, {x:1}], [-2, {}]]);
const factor2 = sum([[1, {x:1}], [-3, {}]]);

const prod = product(factor1, factor2);
const standard = expandAndSimplify(prod[0]);

// x² - 5x + 6
```