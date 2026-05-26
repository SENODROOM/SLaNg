# sum

Create a sum of monomials (polynomial expression with multiple terms).

## The Formula

term₁ + term₂ + term₃ + ... + termₙ

Where each term is: coefficient × variable₁^power₁ × variable₂^power₂ × ...

## The Code

```js
/**
 * Create a sum of monomials
 * @param {Array} terms - Array of [coeff, powers] pairs
 * 
 * Example: sum([[2, {x:2}], [3, {x:1}], [1, {}]]) creates 2x² + 3x + 1
 */
function sum(terms) {
    const slangTerms = terms.map(([coeff, powers]) => createTerm(coeff, powers));
    return [[createFraction(slangTerms, 1)]];
}
```

## Line-by-Line Explanation

```js
function sum(terms) {
```
- **`terms`** — Array of term specifications
- Each element is a 2-element array: `[coefficient, powers]`
- **coefficient** — Number (can be positive, negative, integer, or decimal)
- **powers** — Object mapping variable names to exponents
- Example: `[[2, {x:2}], [3, {x:1}]]` → 2x² + 3x

```js
    const slangTerms = terms.map(([coeff, powers]) => createTerm(coeff, powers));
```
- **`map`** — Transform each input pair into a term object
- **`[coeff, powers]`** — Destructure the array: first element is coefficient, second is powers object
- **`createTerm(coeff, powers)`** — Creates internal term representation
- **Result** — Array of term objects ready to be combined
- Example transformation:
  - Input: `[2, {x:2}]`
  - Output: `{coeff: 2, var: {x: 2}}`

```js
    return [[createFraction(slangTerms, 1)]];
```
- **`createFraction(slangTerms, 1)`** — Combine all terms in numerator, denominator is 1
- **First `[]`** — Wrap in product array (single product, one fraction)
- **Second `[]`** — Wrap in equation array (equation with one product)
- Returns standard SLaNg equation format: `[[fraction]]`

## How It Works

The function creates a polynomial sum by:

1. **Parse Input**: Read array of `[coefficient, powers]` pairs
2. **Transform to Terms**: Convert each pair into term object using `createTerm`
3. **Combine Terms**: Put all terms in a single fraction numerator
4. **Package**: Wrap in standard equation format
5. **Return**: Ready-to-use equation structure

**Key Advantage**: Unlike `polynomial`, allows any combination of terms with different variables and powers.

## Usage Examples

### Simple Quadratic

```js
// 2x² + 3x + 1
const quad = sum([
    [2, { x: 2 }],
    [3, { x: 1 }],
    [1, {}]
]);

const result = evaluateEquation(quad, { x: 4 });
console.log(result); // 2(16) + 3(4) + 1 = 32 + 12 + 1 = 45
```

**Breakdown**:
- `[2, {x:2}]` → 2x²
- `[3, {x:1}]` → 3x
- `[1, {}]` → 1 (constant, no variables)
- Combined: 2x² + 3x + 1

### Two Variables

```js
// 3x² + 2xy + y²
const twoVar = sum([
    [3, { x: 2 }],
    [2, { x: 1, y: 1 }],
    [1, { y: 2 }]
]);

const result = evaluateEquation(twoVar, { x: 2, y: 3 });
console.log(result); // 3(4) + 2(2)(3) + 9 = 12 + 12 + 9 = 33
```

**Breakdown**:
- `[3, {x:2}]` → 3x²
- `[2, {x:1, y:1}]` → 2xy (x to first power, y to first power)
- `[1, {y:2}]` → y²
- At (2,3): 3(4) + 2(6) + 9 = 33

### Sparse Polynomial

```js
// x³ + x (skip x² term)
const sparse = sum([
    [1, { x: 3 }],
    [1, { x: 1 }]
]);

const result = evaluateEquation(sparse, { x: 2 });
console.log(result); // 8 + 2 = 10
```

**Breakdown**:
- No need for zero coefficient
- Unlike `polynomial([1, 0, 1, 0])`, directly specify only non-zero terms
- Cleaner and more efficient

### Three Variables

```js
// x²y + xy² + xyz
const mixed = sum([
    [1, { x: 2, y: 1 }],
    [1, { x: 1, y: 2 }],
    [1, { x: 1, y: 1, z: 1 }]
]);

const result = evaluateEquation(mixed, { x: 2, y: 3, z: 4 });
console.log(result); // 4(3) + 2(9) + 2(3)(4) = 12 + 18 + 24 = 54
```

**Breakdown**:
- `[1, {x:2, y:1}]` → x²y
- `[1, {x:1, y:2}]` → xy²
- `[1, {x:1, y:1, z:1}]` → xyz
- Multi-variable terms are natural with this format

### Negative Coefficients

```js
// 5x - 3y + 2
const expr = sum([
    [5, { x: 1 }],
    [-3, { y: 1 }],
    [2, {}]
]);

const result = evaluateEquation(expr, { x: 2, y: 4 });
console.log(result); // 10 - 12 + 2 = 0
```

**Breakdown**:
- Negative coefficients work naturally
- `[-3, {y:1}]` → -3y
- Result: 5(2) - 3(4) + 2 = 10 - 12 + 2 = 0

### Fractional Coefficients

```js
// 0.5x² + 1.5x + 2.5
const decimal = sum([
    [0.5, { x: 2 }],
    [1.5, { x: 1 }],
    [2.5, {}]
]);

const result = evaluateEquation(decimal, { x: 4 });
console.log(result); // 0.5(16) + 1.5(4) + 2.5 = 8 + 6 + 2.5 = 16.5
```

### High Degree Polynomial

```js
// x⁵ - 2x⁴ + 3x³ - 4x² + 5x - 6
const highDegree = sum([
    [1, { x: 5 }],
    [-2, { x: 4 }],
    [3, { x: 3 }],
    [-4, { x: 2 }],
    [5, { x: 1 }],
    [-6, {}]
]);

const result = evaluateEquation(highDegree, { x: 2 });
console.log(result); 
// 32 - 32 + 24 - 16 + 10 - 6 = 12
```

### Just a Constant

```js
// 42 (no variables)
const constant = sum([
    [42, {}]
]);

const result = evaluateEquation(constant, { x: 999 });
console.log(result); // 42 (independent of x)
```

### Linear Combination

```js
// 3a + 4b + 5c
const linearCombo = sum([
    [3, { a: 1 }],
    [4, { b: 1 }],
    [5, { c: 1 }]
]);

const result = evaluateEquation(linearCombo, { a: 2, b: 3, c: 4 });
console.log(result); // 6 + 12 + 20 = 38
```

### Different Powers Same Variable

```js
// x⁴ + x³ + x² + x + 1
const powers = sum([
    [1, { x: 4 }],
    [1, { x: 3 }],
    [1, { x: 2 }],
    [1, { x: 1 }],
    [1, {}]
]);

const result = evaluateEquation(powers, { x: 2 });
console.log(result); // 16 + 8 + 4 + 2 + 1 = 31
```

### Mixed Positive and Negative

```js
// x² - y²
const difference = sum([
    [1, { x: 2 }],
    [-1, { y: 2 }]
]);

const result = evaluateEquation(difference, { x: 5, y: 3 });
console.log(result); // 25 - 9 = 16
```

## Step-by-Step Example

Let's create x² + 2x + 3 and trace the execution:

```js
const expr = sum([
    [1, { x: 2 }],
    [2, { x: 1 }],
    [3, {}]
]);
```

**Step by step:**

1. **Input array**:
   ```js
   [
     [1, {x: 2}],
     [2, {x: 1}],
     [3, {}]
   ]
   ```

2. **Map iteration 1** (first term):
   - Input: `[1, {x: 2}]`
   - Destructure: `coeff = 1, powers = {x: 2}`
   - Call: `createTerm(1, {x: 2})`
   - Output: `{coeff: 1, var: {x: 2}}`

3. **Map iteration 2** (second term):
   - Input: `[2, {x: 1}]`
   - Destructure: `coeff = 2, powers = {x: 1}`
   - Call: `createTerm(2, {x: 1})`
   - Output: `{coeff: 2, var: {x: 1}}`

4. **Map iteration 3** (third term):
   - Input: `[3, {}]`
   - Destructure: `coeff = 3, powers = {}`
   - Call: `createTerm(3, {})`
   - Output: `{coeff: 3, var: undefined}` (constant term)

5. **Create slangTerms array**:
   ```js
   [
     {coeff: 1, var: {x: 2}},
     {coeff: 2, var: {x: 1}},
     {coeff: 3}
   ]
   ```

6. **Create fraction**:
   - Numerator: slangTerms array
   - Denominator: 1
   - Fraction: `{numi: {terms: slangTerms}, deno: 1}`

7. **Wrap in arrays**:
   - Product array: `[fraction]`
   - Equation array: `[[fraction]]`

8. **Return**: Complete equation structure

**Evaluate at x=5**:
- 1(25) + 2(5) + 3 = 25 + 10 + 3 = 38

## Mathematical Background

### Polynomial Definition

A polynomial is a sum of monomials:

P(x₁, x₂, ..., xₙ) = Σ cᵢ × x₁^(p₁ᵢ) × x₂^(p₂ᵢ) × ... × xₙ^(pₙᵢ)

Where:
- cᵢ are coefficients
- pⱼᵢ are non-negative integer exponents

### Flexibility of `sum`

Unlike traditional polynomial notation (descending powers of single variable), `sum` allows:

1. **Multiple variables**: x, y, z simultaneously
2. **Any order**: Terms don't need to be in decreasing power order
3. **Sparse representation**: Skip zero coefficients
4. **Mixed degree**: Different variables can have different maximum degrees

### Degree of Polynomial

The degree is the maximum sum of exponents in any term:

- `x² + xy + y³` → degree 3 (from y³)
- `x²y + xy²` → degree 3 (both terms: 2+1=3, 1+2=3)
- `5x + 3` → degree 1

### Like Terms

Terms with identical variable parts can be combined:
- `3x² + 5x²` = `8x²` (like terms)
- `2xy + 3xy` = `5xy` (like terms)
- `x²y` and `xy²` cannot be combined (not like terms)

## Dependencies

This function requires:
- **`createTerm`** — Creates individual term objects from coefficient and powers
- **`createFraction`** — Combines terms into a fraction structure

## Why Use This?

This function is useful for:

- **Flexible Polynomial Creation**: Any combination of terms
- **Multi-variable Expressions**: Natural representation for several variables
- **Sparse Polynomials**: Only specify non-zero terms
- **Explicit Control**: Exact control over each term
- **Mathematical Modeling**: Representing complex mathematical relationships
- **Quick Expression Building**: Fast way to create polynomial expressions

## Real-World Applications

### Physics: Total Energy

```js
// E = ½mv² + mgh (kinetic + potential energy)
const totalEnergy = sum([
    [0.5, { m: 1, v: 2 }],
    [9.8, { m: 1, h: 1 }]
]);

const E = evaluateEquation(totalEnergy, { m: 2, v: 10, h: 5 });
console.log('Total energy:', E, 'J'); 
// 0.5(2)(100) + 9.8(2)(5) = 100 + 98 = 198 J
```

### Economics: Cost Function

```js
// C(x) = 0.01x² + 5x + 100
// Fixed cost + variable cost + economies of scale
const cost = sum([
    [0.01, { x: 2 }],   // Diminishing returns
    [5, { x: 1 }],      // Variable cost per unit
    [100, {}]           // Fixed cost
]);

const totalCost = evaluateEquation(cost, { x: 50 });
console.log('Cost for 50 units: $', totalCost);
// 0.01(2500) + 5(50) + 100 = 25 + 250 + 100 = 375
```

### Chemistry: Reaction Rate

```js
// Rate = k₁[A]² + k₂[A][B] + k₃[B]²
const reactionRate = sum([
    [0.5, { A: 2 }],
    [1.2, { A: 1, B: 1 }],
    [0.3, { B: 2 }]
]);

const rate = evaluateEquation(reactionRate, { A: 2, B: 3 });
console.log('Reaction rate:', rate);
// 0.5(4) + 1.2(2)(3) + 0.3(9) = 2 + 7.2 + 2.7 = 11.9
```

### Engineering: Stress Analysis

```js
// σ = E₁ε + E₂ε² + E₃ε³ (stress-strain relationship)
const stress = sum([
    [200000, { epsilon: 1 }],
    [5000, { epsilon: 2 }],
    [100, { epsilon: 3 }]
]);

const sigma = evaluateEquation(stress, { epsilon: 0.002 });
console.log('Stress:', sigma, 'MPa');
```

### Geometry: Area of Composite Shape

```js
// Area = l×w + πr²/2 (rectangle + semicircle)
const area = sum([
    [1, { l: 1, w: 1 }],
    [Math.PI / 2, { r: 2 }]
]);

const A = evaluateEquation(area, { l: 10, w: 5, r: 3 });
console.log('Total area:', A);
// 10(5) + (π/2)(9) = 50 + 14.14 = 64.14
```

### Statistics: Polynomial Regression

```js
// ŷ = β₀ + β₁x + β₂x²
const regression = sum([
    [2.5, {}],
    [1.3, { x: 1 }],
    [0.05, { x: 2 }]
]);

const predicted = evaluateEquation(regression, { x: 10 });
console.log('Predicted value:', predicted);
// 2.5 + 1.3(10) + 0.05(100) = 2.5 + 13 + 5 = 20.5
```

## Comparison with Other Builders

### sum vs polynomial

```js
// sum: Explicit term specification
const s = sum([[1, {x:2}], [2, {x:1}], [3, {}]]);

// polynomial: Coefficient array
const p = polynomial([1, 2, 3], 'x');

// Both create: x² + 2x + 3
```

**Use `sum` when:**
- Multiple variables needed
- Non-sequential powers (sparse polynomials)
- Explicit control over each term
- Mixing different variable combinations

**Use `polynomial` when:**
- Single variable only
- Standard polynomial form (sequential powers)
- Simple coefficient array input

### sum vs monomial

```js
// monomial: Single term only
const m = monomial(5, {x: 2}); // 5x²

// sum: Can have multiple terms (or just one)
const s = sum([[5, {x: 2}]]); // Also 5x²

// For single terms, monomial is cleaner
// For multiple terms, must use sum
```

### sum vs product

```js
// sum: Addition of terms
const s = sum([[1, {x:1}], [1, {}]]); // x + 1

// product: Multiplication of factors
// (Would need to use product() function)

// sum is for addition, product is for multiplication
```

## Combining with Other Operations

### Differentiation

```js
// f(x) = 3x² + 2x + 1
const f = sum([
    [3, { x: 2 }],
    [2, { x: 1 }],
    [1, {}]
]);

// f'(x) = 6x + 2
const derivative = differentiateFraction(f[0][0], 'x');

const fPrime = evaluateEquation([[derivative]], { x: 5 });
console.log("f'(5) =", fPrime); // 6(5) + 2 = 32
```

### Integration

```js
// f(x) = 2x + 3
const f = sum([
    [2, { x: 1 }],
    [3, {}]
]);

// ∫f(x)dx = x² + 3x (+ C)
const integral = integrateFraction(f[0][0], 'x');

const antiderivative = evaluateEquation([[integral]], { x: 4 });
console.log('∫f(x)dx at x=4:', antiderivative); // 16 + 12 = 28
```

### Definite Integration

```js
// ∫₀² (x² + 1) dx
const integrand = sum([
    [1, { x: 2 }],
    [1, {}]
]);

const result = definiteIntegrateFraction(integrand[0][0], 0, 2, 'x');
const value = evaluateEquation([[result]], {});
console.log('Definite integral:', value); 
// [x³/3 + x] from 0 to 2 = 8/3 + 2 = 14/3 ≈ 4.67
```

## Building Complex Expressions

### Factored Forms Before Expansion

```js
// Build (x+1)² = x² + 2x + 1
const factor1 = sum([[1, {x:1}], [1, {}]]);  // x + 1
const factor2 = sum([[1, {x:1}], [1, {}]]);  // x + 1

// Would multiply and expand separately
```

### Multi-variable Polynomials

```js
// x³ + y³ + z³ - 3xyz
const expression = sum([
    [1, { x: 3 }],
    [1, { y: 3 }],
    [1, { z: 3 }],
    [-3, { x: 1, y: 1, z: 1 }]
]);

const result = evaluateEquation(expression, { x: 1, y: 2, z: 3 });
console.log(result); // 1 + 8 + 27 - 18 = 18
```

### Homogeneous Polynomials

```js
// All terms have same total degree
// x² + 2xy + y² (all degree 2)
const homogeneous = sum([
    [1, { x: 2 }],
    [2, { x: 1, y: 1 }],
    [1, { y: 2 }]
]);
```

## Performance Notes

- **Time complexity**: O(n) where n = number of terms
- Very fast for typical polynomial sizes (<100 terms)
- Map operation is linear in number of terms
- No optimization or combining of like terms (done elsewhere)

## Limitations

1. **No Automatic Simplification**: Doesn't combine like terms
   - `sum([[2, {x:1}], [3, {x:1}]])` keeps as two separate terms
   - Use `simplifyFraction` if needed

2. **Manual Term Specification**: Must explicitly list each term
   - More verbose than `polynomial` for standard polynomials

3. **No Validation**: Doesn't check if powers are valid
   - Can create negative or fractional exponents (may cause issues)

4. **Single Numerator**: All terms in one fraction
   - Cannot represent more complex rational expressions

## Tips and Best Practices

### Order Doesn't Matter

```js
// These are equivalent:
const a = sum([[1, {x:2}], [2, {x:1}], [3, {}]]);
const b = sum([[3, {}], [2, {x:1}], [1, {x:2}]]);
const c = sum([[2, {x:1}], [1, {x:2}], [3, {}]]);
// All represent x² + 2x + 3
```

### Use Empty Object for Constants

```js
// Correct: {} for constant terms
const correct = sum([[5, {}]]);

// Don't omit the powers parameter
// const wrong = sum([[5]]); // Error!
```

### Organize by Variable for Readability

```js
// Good: group by variable
const readable = sum([
    // x terms
    [3, { x: 2 }],
    [2, { x: 1 }],
    // y terms
    [4, { y: 2 }],
    [1, { y: 1 }],
    // constant
    [5, {}]
]);
```

### Use Comments for Complex Expressions

```js
const formula = sum([
    [9.8, { h: 1 }],           // mgh term
    [0.5, { v: 2 }],           // ½mv² term
    [0.5, { k: 1, x: 2 }]      // ½kx² term
]);
```