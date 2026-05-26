# simplifyProduct

Simplify an entire product by simplifying each fraction in the product array.

## The Code

```js
/**
 * Simplify an entire product
 */
function simplifyProduct(product) {
    return product.map(fraction => simplifyFraction(fraction));
}
```

## Line-by-Line Explanation

```js
function simplifyProduct(product) {
```
- **`product`** — An array of fractions to be multiplied together

```js
    return product.map(fraction => simplifyFraction(fraction));
```
- **`product.map()`** — Transform each fraction in the array
- **`fraction =>`** — For each fraction
- **`simplifyFraction(fraction)`** — Simplify that fraction
- Returns a new array with all fractions simplified

```js
}
```
- Close the function

## How It Works

The function simplifies a product by:

1. Iterating over each fraction in the product array
2. Applying `simplifyFraction` to each one
3. Returning the array of simplified fractions

**Formula**: Simplify each fraction individually:
- `[(2x² + 3x²)/1] × [(4y + 2y)/2]` → `[5x²/1] × [6y/2]`

## Usage Examples

### Simplify Single Fraction Product

```js
const fraction = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 2 }),
    createTerm(5)
], 1);

const product = [fraction];

const result = simplifyProduct(product);

console.log(result);
// [
//   {
//     numi: {
//       terms: [
//         { coeff: 5, var: { x: 2 } },   // 2x² + 3x² = 5x²
//         { coeff: 5 }
//       ]
//     },
//     deno: 1
//   }
// ]
// Mathematical: (2x² + 3x² + 5) = (5x² + 5)
```

### Simplify Multiple Fractions

```js
const fraction1 = createFraction([
    createTerm(3, { x: 1 }),
    createTerm(2, { x: 1 })
], 1);

const fraction2 = createFraction([
    createTerm(4, { y: 2 }),
    createTerm(2, { y: 2 }),
    createTerm(1)
], 2);

const product = [fraction1, fraction2];

const result = simplifyProduct(product);

console.log(result);
// [
//   {
//     numi: {
//       terms: [{ coeff: 5, var: { x: 1 } }]   // 3x + 2x = 5x
//     },
//     deno: 1
//   },
//   {
//     numi: {
//       terms: [
//         { coeff: 6, var: { y: 2 } },   // 4y² + 2y² = 6y²
//         { coeff: 1 }
//       ]
//     },
//     deno: 2
//   }
// ]
// Mathematical: (3x + 2x) × (4y² + 2y² + 1)/2 = 5x × (6y² + 1)/2
```

### Simplify with Canceling Terms

```js
const fraction1 = createFraction([
    createTerm(5, { x: 2 }),
    createTerm(-5, { x: 2 }),
    createTerm(7)
], 1);

const fraction2 = createFraction([
    createTerm(2, { y: 1 }),
    createTerm(3, { y: 1 })
], 1);

const product = [fraction1, fraction2];

const result = simplifyProduct(product);

console.log(result);
// [
//   {
//     numi: {
//       terms: [{ coeff: 7 }]   // 5x² - 5x² + 7 = 7
//     },
//     deno: 1
//   },
//   {
//     numi: {
//       terms: [{ coeff: 5, var: { y: 1 } }]   // 2y + 3y = 5y
//     },
//     deno: 1
//   }
// ]
// Mathematical: (5x² - 5x² + 7) × (2y + 3y) = 7 × 5y
```

### Empty Product

```js
const product = [];

const result = simplifyProduct(product);

console.log(result);
// []
// Empty array remains empty
```

### Already Simplified

```js
const fraction1 = createFraction([createTerm(3, { x: 2 })], 1);
const fraction2 = createFraction([createTerm(5, { y: 1 })], 1);

const product = [fraction1, fraction2];

const result = simplifyProduct(product);

console.log(result);
// [
//   {
//     numi: { terms: [{ coeff: 3, var: { x: 2 } }] },
//     deno: 1
//   },
//   {
//     numi: { terms: [{ coeff: 5, var: { y: 1 } }] },
//     deno: 1
//   }
// ]
// Mathematical: 3x² × 5y (already simplified, no change)
```

### Complex Product

```js
const fraction1 = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(4, { x: 2 })   // Like term with first
], 1);

const fraction2 = createFraction([
    createTerm(5),
    createTerm(2),
    createTerm(-3)
], 1);

const fraction3 = createFraction([
    createTerm(1, { z: 3 }),
    createTerm(2, { z: 3 }),
    createTerm(3, { z: 3 })
], 3);

const product = [fraction1, fraction2, fraction3];

const result = simplifyProduct(product);

console.log(result);
// [
//   {
//     numi: {
//       terms: [
//         { coeff: 6, var: { x: 2 } },   // 2x² + 4x² = 6x²
//         { coeff: 3, var: { x: 1 } }
//       ]
//     },
//     deno: 1
//   },
//   {
//     numi: {
//       terms: [{ coeff: 4 }]   // 5 + 2 - 3 = 4
//     },
//     deno: 1
//   },
//   {
//     numi: {
//       terms: [{ coeff: 6, var: { z: 3 } }]   // 1z³ + 2z³ + 3z³ = 6z³
//     },
//     deno: 3
//   }
// ]
// Mathematical: (6x² + 3x) × 4 × (6z³/3)
```

## Step-by-Step Example

Let's simplify the product `[(2x + 3x)/1] × [(4y² + 2y²)/2]`:

```js
const fraction1 = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(3, { x: 1 })
], 1);

const fraction2 = createFraction([
    createTerm(4, { y: 2 }),
    createTerm(2, { y: 2 })
], 2);

const product = [fraction1, fraction2];

const result = simplifyProduct(product);
```

**Step by step:**
1. Start with array: `[fraction1, fraction2]`
2. Map over the array
3. Process `fraction1`:
   - Call `simplifyFraction(fraction1)`
   - Combines `2x + 3x = 5x`
   - Result: `{ numi: { terms: [{ coeff: 5, var: { x: 1 } }] }, deno: 1 }`
4. Process `fraction2`:
   - Call `simplifyFraction(fraction2)`
   - Combines `4y² + 2y² = 6y²`
   - Result: `{ numi: { terms: [{ coeff: 6, var: { y: 2 } }] }, deno: 2 }`
5. Return array with both simplified fractions

**Mathematical verification**: `(2x + 3x) × (4y² + 2y²)/2 = 5x × 6y²/2` ✓

## What This Does NOT Do

This function:
- ✅ Simplifies each fraction individually
- ✗ Does NOT multiply the fractions together
- ✗ Does NOT combine the fractions into one
- ✗ Does NOT simplify across fractions

**Example**:
```js
// Input: [2x/1] × [3x/1]
// Output: [2x/1] × [3x/1] (each simplified, but not multiplied)
// Does NOT output: [6x²/1]
```

To multiply fractions together, you would need a separate function.

## Use Case

This is useful when you have a product of fractions and want to:
- Clean up each fraction before multiplying
- Combine like terms within each fraction
- Prepare expressions for evaluation
- Make intermediate steps clearer

**Example workflow**:
1. Perform differentiation → messy fractions
2. Call `simplifyProduct` → clean fractions
3. Evaluate or continue operations

## Dependencies

This function requires:
- **`simplifyFraction`** — To simplify each individual fraction
  - Which requires **`deepClone`**

## Why Use This?

This function is useful for:

- Cleaning up products after mathematical operations
- Simplifying intermediate results in calculations
- Preparing products for evaluation
- Making expressions more readable
- Building algebra systems
- Educational tools for showing step-by-step simplification