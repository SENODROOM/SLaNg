# simplifyEquation

Simplify an entire equation by simplifying each product in the equation array.

## The Code

```js
/**
 * Simplify entire equation
 */
function simplifyEquation(equation) {
    return equation.map(product => simplifyProduct(product));
}
```

## Line-by-Line Explanation

```js
function simplifyEquation(equation) {
```
- **`equation`** — An array of products (where each product is an array of fractions)

```js
    return equation.map(product => simplifyProduct(product));
```
- **`equation.map()`** — Transform each product in the array
- **`product =>`** — For each product
- **`simplifyProduct(product)`** — Simplify that entire product
- Returns a new array with all products simplified

```js
}
```
- Close the function

## How It Works

The function simplifies an equation by:

1. Iterating over each product in the equation array
2. Applying `simplifyProduct` to each one
3. Returning the array of simplified products

**Equation Structure**:
```
Equation = Product₁ + Product₂ + Product₃ + ...
Product = Fraction₁ × Fraction₂ × Fraction₃ × ...
Fraction = (Term₁ + Term₂ + ...) / denominator
```

## Usage Examples

### Simplify Single Product Equation

```js
const fraction = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 2 }),
    createTerm(5)
], 1);

const product = [fraction];
const equation = [product];

const result = simplifyEquation(equation);

console.log(result);
// [
//   [
//     {
//       numi: {
//         terms: [
//           { coeff: 5, var: { x: 2 } },   // 2x² + 3x² = 5x²
//           { coeff: 5 }
//         ]
//       },
//       deno: 1
//     }
//   ]
// ]
// Mathematical: 2x² + 3x² + 5 = 5x² + 5
```

### Simplify Multiple Products

```js
const fraction1 = createFraction([
    createTerm(3, { x: 1 }),
    createTerm(2, { x: 1 })
], 1);

const fraction2 = createFraction([
    createTerm(4, { y: 2 }),
    createTerm(2, { y: 2 })
], 1);

const product1 = [fraction1];
const product2 = [fraction2];
const equation = [product1, product2];

const result = simplifyEquation(equation);

console.log(result);
// [
//   [
//     {
//       numi: {
//         terms: [{ coeff: 5, var: { x: 1 } }]   // 3x + 2x = 5x
//       },
//       deno: 1
//     }
//   ],
//   [
//     {
//       numi: {
//         terms: [{ coeff: 6, var: { y: 2 } }]   // 4y² + 2y² = 6y²
//       },
//       deno: 1
//     }
//   ]
// ]
// Mathematical: (3x + 2x) + (4y² + 2y²) = 5x + 6y²
```

### Complex Equation

```js
// Equation: (2x² + 3x²) × (y + 2y) + (5z + z) × (3w²/2)

const fraction1a = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 2 })
], 1);

const fraction1b = createFraction([
    createTerm(1, { y: 1 }),
    createTerm(2, { y: 1 })
], 1);

const fraction2a = createFraction([
    createTerm(5, { z: 1 }),
    createTerm(1, { z: 1 })
], 1);

const fraction2b = createFraction([
    createTerm(3, { w: 2 })
], 2);

const product1 = [fraction1a, fraction1b];
const product2 = [fraction2a, fraction2b];
const equation = [product1, product2];

const result = simplifyEquation(equation);

console.log(result);
// [
//   [
//     {
//       numi: {
//         terms: [{ coeff: 5, var: { x: 2 } }]   // 2x² + 3x² = 5x²
//       },
//       deno: 1
//     },
//     {
//       numi: {
//         terms: [{ coeff: 3, var: { y: 1 } }]   // y + 2y = 3y
//       },
//       deno: 1
//     }
//   ],
//   [
//     {
//       numi: {
//         terms: [{ coeff: 6, var: { z: 1 } }]   // 5z + z = 6z
//       },
//       deno: 1
//     },
//     {
//       numi: {
//         terms: [{ coeff: 3, var: { w: 2 } }]
//       },
//       deno: 2
//     }
//   ]
// ]
// Mathematical: 5x² × 3y + 6z × (3w²/2)
```

### Empty Equation

```js
const equation = [];

const result = simplifyEquation(equation);

console.log(result);
// []
// Empty array remains empty
```

### Already Simplified

```js
const fraction1 = createFraction([createTerm(3, { x: 2 })], 1);
const fraction2 = createFraction([createTerm(5, { y: 1 })], 1);

const product1 = [fraction1];
const product2 = [fraction2];
const equation = [product1, product2];

const result = simplifyEquation(equation);

console.log(result);
// [
//   [
//     {
//       numi: { terms: [{ coeff: 3, var: { x: 2 } }] },
//       deno: 1
//     }
//   ],
//   [
//     {
//       numi: { terms: [{ coeff: 5, var: { y: 1 } }] },
//       deno: 1
//     }
//   ]
// ]
// Mathematical: 3x² + 5y (already simplified)
```

### With Canceling Terms

```js
const fraction1 = createFraction([
    createTerm(5, { x: 1 }),
    createTerm(-5, { x: 1 }),
    createTerm(3)
], 1);

const fraction2 = createFraction([
    createTerm(2, { y: 2 }),
    createTerm(3, { y: 2 })
], 1);

const product1 = [fraction1];
const product2 = [fraction2];
const equation = [product1, product2];

const result = simplifyEquation(equation);

console.log(result);
// [
//   [
//     {
//       numi: {
//         terms: [{ coeff: 3 }]   // 5x - 5x + 3 = 3
//       },
//       deno: 1
//     }
//   ],
//   [
//     {
//       numi: {
//         terms: [{ coeff: 5, var: { y: 2 } }]   // 2y² + 3y² = 5y²
//       },
//       deno: 1
//     }
//   ]
// ]
// Mathematical: 3 + 5y²
```

## Step-by-Step Example

Let's simplify: `[(2x + 3x)/1] + [(4y² + 2y²)/2]`

```js
const fraction1 = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(3, { x: 1 })
], 1);

const fraction2 = createFraction([
    createTerm(4, { y: 2 }),
    createTerm(2, { y: 2 })
], 2);

const product1 = [fraction1];
const product2 = [fraction2];
const equation = [product1, product2];

const result = simplifyEquation(equation);
```

**Step by step:**
1. Start with array: `[product1, product2]`
2. Map over the equation array
3. Process `product1`:
   - Call `simplifyProduct(product1)`
   - Which calls `simplifyFraction` on `fraction1`
   - Combines `2x + 3x = 5x`
   - Result: `[{ numi: { terms: [{ coeff: 5, var: { x: 1 } }] }, deno: 1 }]`
4. Process `product2`:
   - Call `simplifyProduct(product2)`
   - Which calls `simplifyFraction` on `fraction2`
   - Combines `4y² + 2y² = 6y²`
   - Result: `[{ numi: { terms: [{ coeff: 6, var: { y: 2 } }] }, deno: 2 }]`
5. Return array with both simplified products

**Mathematical verification**: `(2x + 3x) + (4y² + 2y²)/2 = 5x + 6y²/2` ✓

## What This Does NOT Do

This function:
- ✅ Simplifies each product individually
- ✅ Simplifies each fraction within each product
- ✗ Does NOT add products together
- ✗ Does NOT combine products into one
- ✗ Does NOT simplify across products

**Example**:
```js
// Input: [5x²/1] + [3x²/1]
// Output: [5x²/1] + [3x²/1] (each simplified, but not added)
// Does NOT output: [8x²/1]
```

To combine products together, you would need a separate function.

## Typical Workflow

```js
// 1. Build equation
const equation = buildEquation();

// 2. Perform operations (differentiation, integration, etc.)
const transformed = differentiateEquation(equation);

// 3. Simplify to clean up
const simplified = simplifyEquation(transformed);

// 4. Evaluate with values
const result = evaluateEquation(simplified, { x: 2, y: 3 });
```

## Hierarchy of Simplification

```
simplifyEquation
  ├─ simplifyProduct (for each product)
  │   └─ simplifyFraction (for each fraction in product)
  │       └─ Combine like terms in numerator
  ├─ simplifyProduct
  │   └─ ...
  └─ ...
```

## Dependencies

This function requires:
- **`simplifyProduct`** — To simplify each product
  - Which requires **`simplifyFraction`**
    - Which requires **`deepClone`**

## Why Use This?

This function is useful for:

- Cleaning up equations after differentiation or integration
- Combining like terms throughout complex expressions
- Preparing equations for evaluation
- Making expressions more readable
- Reducing computational complexity
- Building algebra systems
- Educational tools for step-by-step simplification
- Debugging mathematical operations by seeing cleaner results

## Real-World Example

After differentiating a complex equation:

```js
// Original: (x² + 2x²) + (3y³ + y³)
// After differentiation: (2x + 4x) + (9y² + 3y²)
// After simplifyEquation: 6x + 12y²

const equation = afterDifferentiation();
const cleaned = simplifyEquation(equation);

// Much cleaner for evaluation or display
```