# evaluateProduct

Evaluate a product by multiplying an array of fractions together.

## The Code

```js
/**
 * Evaluate a product (array of fractions multiplied together)
 */
function evaluateProduct(product, values) {
    let result = 1;

    for (let fraction of product) {
        result *= evaluateFraction(fraction, values);
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function evaluateProduct(product, values) {
```
- **`product`** — An array of fraction objects to multiply together
- **`values`** — Variable values to substitute (e.g., `{x: 2, y: 3}`)

```js
    let result = 1;
```
- Initialize `result` to 1 (the multiplicative identity)
- Starting at 1 because we'll be multiplying values
- (Starting at 0 would make everything 0!)

```js
    for (let fraction of product) {
```
- Loop through each fraction in the product array
- **`of`** — Iterates over the actual fraction objects

```js
        result *= evaluateFraction(fraction, values);
```
- Evaluate each fraction using the `evaluateFraction` function
- Multiply the result by this evaluated value
- **`*=`** — Shorthand for `result = result * evaluateFraction(...)`

```js
    }
```
- Close the for loop

```js
    return result;
```
- Return the final product value

```js
}
```
- Close the function

## How It Works

The function evaluates a product by:

1. Starting with a result of 1
2. Evaluating each fraction in the array
3. Multiplying all fraction values together
4. Returning the final product

**Formula**: `fraction₁ × fraction₂ × ... × fractionₙ`

## Usage Examples

### Single Fraction

```js
const fraction1 = createFraction([createTerm(6)], 2);
const product = [fraction1];

const result = evaluateProduct(product, {});

console.log(result); // 3
// Calculation: 6/2 = 3
```

### Two Fractions

```js
const fraction1 = createFraction([createTerm(6)], 2);
const fraction2 = createFraction([createTerm(4)], 3);
const product = [fraction1, fraction2];

const result = evaluateProduct(product, {});

console.log(result); // 4
// Calculation: (6/2) × (4/3) = 3 × 1.333... = 4
```

### Fractions with Variables

```js
const fraction1 = createFraction([createTerm(2, { x: 1 })], 1);
const fraction2 = createFraction([createTerm(3, { x: 1 })], 1);
const product = [fraction1, fraction2];

const result = evaluateProduct(product, { x: 4 });

console.log(result); // 96
// Calculation: (2×4/1) × (3×4/1) = 8 × 12 = 96
```

### Complex Product

```js
const fraction1 = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(1)
], 2);

const fraction2 = createFraction([createTerm(3)], 1);

const product = [fraction1, fraction2];

const result = evaluateProduct(product, { x: 2 });

console.log(result); // 13.5
// Calculation: ((2×2² + 1)/2) × (3/1)
//            = ((2×4 + 1)/2) × 3
//            = (9/2) × 3
//            = 4.5 × 3 = 13.5
```

### Three Fractions

```js
const fraction1 = createFraction([createTerm(10)], 2);
const fraction2 = createFraction([createTerm(6)], 3);
const fraction3 = createFraction([createTerm(4)], 1);

const product = [fraction1, fraction2, fraction3];

const result = evaluateProduct(product, {});

console.log(result); // 40
// Calculation: (10/2) × (6/3) × (4/1)
//            = 5 × 2 × 4 = 40
```

### Product with Zero

```js
const fraction1 = createFraction([createTerm(5)], 1);
const fraction2 = createFraction([createTerm(0)], 1);
const fraction3 = createFraction([createTerm(10)], 1);

const product = [fraction1, fraction2, fraction3];

const result = evaluateProduct(product, {});

console.log(result); // 0
// Calculation: 5 × 0 × 10 = 0
```

### Empty Product

```js
const product = [];

const result = evaluateProduct(product, {});

console.log(result); // 1
// Empty product returns 1 (multiplicative identity)
```

## Step-by-Step Example

Let's evaluate `(2x/3) × (x+1/2)` at `x = 3`:

```js
const fraction1 = createFraction([createTerm(2, { x: 1 })], 3);
const fraction2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 2);

const product = [fraction1, fraction2];

const result = evaluateProduct(product, { x: 3 });
```

**Step by step:**
1. `result = 1`
2. Evaluate first fraction `(2×3)/3`:
   - `evaluateFraction` returns `6/3 = 2`
   - `result = 1 × 2 = 2`
3. Evaluate second fraction `(3+1)/2`:
   - `evaluateFraction` returns `4/2 = 2`
   - `result = 2 × 2 = 4`
4. Return `4`

**Mathematical verification**: `(2×3/3) × (3+1/2) = 2 × 2 = 4` ✓

## Dependencies

This function requires:
- **`evaluateFraction`** — To evaluate each individual fraction
  - Which in turn requires **`evaluateTerm`**

## Why Use This?

This function is useful for:

- Multiplying rational expressions
- Evaluating compound fractions
- Building algebra calculators
- Calculating products of polynomial divisions
- Working with complex mathematical expressions