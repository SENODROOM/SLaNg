# evaluateEquation

Evaluate an entire equation by calculating the sum of products.

## The Code

```js
/**
 * Evaluate entire equation (sum of products)
 */
function evaluateEquation(equation, values) {
    let result = 0;

    for (let product of equation) {
        result += evaluateProduct(product, values);
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function evaluateEquation(equation, values) {
```
- **`equation`** — An array of products (where each product is an array of fractions)
- **`values`** — Variable values to substitute (e.g., `{x: 2, y: 3}`)

```js
    let result = 0;
```
- Initialize `result` to 0 (the additive identity)
- Starting at 0 because we'll be adding products together

```js
    for (let product of equation) {
```
- Loop through each product in the equation array
- Each product is itself an array of fractions to be multiplied

```js
        result += evaluateProduct(product, values);
```
- Evaluate each product using the `evaluateProduct` function
- Add the result to the running sum
- **`+=`** — Shorthand for `result = result + evaluateProduct(...)`

```js
    }
```
- Close the for loop

```js
    return result;
```
- Return the final equation value

```js
}
```
- Close the function

## How It Works

The function evaluates an equation by:

1. Starting with a sum of 0
2. Evaluating each product in the array
3. Adding all product values together
4. Returning the final sum

**Formula**: `product₁ + product₂ + ... + productₙ`

**Full structure**: Each product is made of fractions, each fraction has terms:
```
Equation = Product₁ + Product₂ + ...
Product = Fraction₁ × Fraction₂ × ...
Fraction = (Term₁ + Term₂ + ...) / denominator
Term = coefficient × x^a × y^b × ...
```

## Usage Examples

### Single Product

```js
const fraction1 = createFraction([createTerm(6)], 2);
const product1 = [fraction1];
const equation = [product1];

const result = evaluateEquation(equation, {});

console.log(result); // 3
// Calculation: 6/2 = 3
```

### Two Products (Addition)

```js
const fraction1 = createFraction([createTerm(10)], 2);
const fraction2 = createFraction([createTerm(6)], 3);

const product1 = [fraction1];
const product2 = [fraction2];

const equation = [product1, product2];

const result = evaluateEquation(equation, {});

console.log(result); // 7
// Calculation: (10/2) + (6/3) = 5 + 2 = 7
```

### Products with Multiplication

```js
const fraction1 = createFraction([createTerm(4)], 1);
const fraction2 = createFraction([createTerm(3)], 1);
const fraction3 = createFraction([createTerm(2)], 1);

const product1 = [fraction1, fraction2];  // 4 × 3
const product2 = [fraction3];              // 2

const equation = [product1, product2];

const result = evaluateEquation(equation, {});

console.log(result); // 14
// Calculation: (4 × 3) + 2 = 12 + 2 = 14
```

### Equation with Variables

```js
const fraction1 = createFraction([createTerm(2, { x: 2 })], 1);
const fraction2 = createFraction([createTerm(3, { x: 1 })], 1);
const fraction3 = createFraction([createTerm(5)], 1);

const product1 = [fraction1];  // 2x²
const product2 = [fraction2];  // 3x
const product3 = [fraction3];  // 5

const equation = [product1, product2, product3];

const result = evaluateEquation(equation, { x: 2 });

console.log(result); // 19
// Calculation: 2×2² + 3×2 + 5
//            = 2×4 + 6 + 5
//            = 8 + 6 + 5 = 19
```

### Complex Equation

```js
// Equation: (2x/3) × (x+1/2) + (x²-1)/4

const fraction1 = createFraction([createTerm(2, { x: 1 })], 3);
const fraction2 = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1)
], 2);

const fraction3 = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(-1)
], 4);

const product1 = [fraction1, fraction2];  // First product
const product2 = [fraction3];              // Second product

const equation = [product1, product2];

const result = evaluateEquation(equation, { x: 3 });

console.log(result); // 6
// Calculation: ((2×3)/3 × (3+1)/2) + ((3²-1)/4)
//            = (2 × 2) + (8/4)
//            = 4 + 2 = 6
```

### Equation with Negative Products

```js
const fraction1 = createFraction([createTerm(10)], 1);
const fraction2 = createFraction([createTerm(-3)], 1);
const fraction3 = createFraction([createTerm(2)], 1);

const product1 = [fraction1];
const product2 = [fraction2];
const product3 = [fraction3];

const equation = [product1, product2, product3];

const result = evaluateEquation(equation, {});

console.log(result); // 9
// Calculation: 10 + (-3) + 2 = 9
```

### Empty Equation

```js
const equation = [];

const result = evaluateEquation(equation, {});

console.log(result); // 0
// Empty equation returns 0 (additive identity)
```

## Step-by-Step Example

Let's evaluate `(x²/2) + (3x) + (5)` at `x = 4`:

```js
const fraction1 = createFraction([createTerm(1, { x: 2 })], 2);
const fraction2 = createFraction([createTerm(3, { x: 1 })], 1);
const fraction3 = createFraction([createTerm(5)], 1);

const product1 = [fraction1];  // x²/2
const product2 = [fraction2];  // 3x
const product3 = [fraction3];  // 5

const equation = [product1, product2, product3];

const result = evaluateEquation(equation, { x: 4 });
```

**Step by step:**
1. `result = 0`
2. Evaluate first product `x²/2`:
   - `evaluateProduct` → `evaluateFraction` → `(4²)/2 = 16/2 = 8`
   - `result = 0 + 8 = 8`
3. Evaluate second product `3x`:
   - `evaluateProduct` → `evaluateFraction` → `3×4 = 12`
   - `result = 8 + 12 = 20`
4. Evaluate third product `5`:
   - `evaluateProduct` → `evaluateFraction` → `5`
   - `result = 20 + 5 = 25`
5. Return `25`

**Mathematical verification**: `4²/2 + 3×4 + 5 = 8 + 12 + 5 = 25` ✓

## Equation Hierarchy

```
evaluateEquation
    ├─ evaluateProduct (for each product)
    │   └─ evaluateFraction (for each fraction in product)
    │       └─ evaluateTerm (for each term in numerator)
    ├─ evaluateProduct
    │   └─ ...
    └─ ...
```

## Dependencies

This function requires:
- **`evaluateProduct`** — To evaluate each product
  - Which requires **`evaluateFraction`**
    - Which requires **`evaluateTerm`**

## Why Use This?

This function is useful for:

- Evaluating complete mathematical expressions
- Building advanced algebra calculators
- Solving complex polynomial equations
- Working with multi-term rational expressions
- Creating symbolic math engines
- Computing mathematical formulas programmatically

## Real-World Example

Evaluating a physics formula like kinetic energy plus potential energy:

```js
// E = (1/2)mv² + mgh
// Where: m=2, v=3, g=10, h=5

const kineticEnergy = [
    createFraction([createTerm(1, { m: 1, v: 2 })], 2)
];

const potentialEnergy = [
    createFraction([createTerm(1, { m: 1, g: 1, h: 1 })], 1)
];

const equation = [kineticEnergy, potentialEnergy];

const result = evaluateEquation(equation, { m: 2, v: 3, g: 10, h: 5 });

console.log(result); // 109
// (1/2)×2×3² + 2×10×5 = 9 + 100 = 109
```