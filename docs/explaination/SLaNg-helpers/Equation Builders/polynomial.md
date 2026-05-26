# polynomial

Create a polynomial from an array of coefficients.

## The Formula

For coefficients [a₀, a₁, a₂, ..., aₙ]: a₀xⁿ + a₁xⁿ⁻¹ + ... + aₙ

## The Code

```js
/**
 * Create a polynomial from coefficients
 * @param {Array<number>} coeffs - Coefficients from highest to lowest degree
 * @param {string} variable - Variable name (default 'x')
 * 
 * Example: polynomial([1, -2, 1], 'x') creates x² - 2x + 1
 */
function polynomial(coeffs, variable = 'x') {
    const terms = [];
    const degree = coeffs.length - 1;

    for (let i = 0; i < coeffs.length; i++) {
        const power = degree - i;
        const coeff = coeffs[i];

        if (coeff === 0) continue;

        if (power === 0) {
            terms.push(createTerm(coeff));
        } else {
            terms.push(createTerm(coeff, { [variable]: power }));
        }
    }

    return [[createFraction(terms, 1)]];
}
```

## Line-by-Line Explanation

```js
function polynomial(coeffs, variable = 'x') {
```
- **`coeffs`** — Array of coefficients from highest to lowest degree
- **`variable`** — Variable name (default: 'x')
- Example: `[1, -2, 1]` with variable 'x' → x² - 2x + 1

```js
    const terms = [];
```
- Initialize empty array to store term objects
- Will build up the polynomial term by term

```js
    const degree = coeffs.length - 1;
```
- Calculate highest degree of polynomial
- For 3 coefficients: degree = 2 (quadratic)
- For 4 coefficients: degree = 3 (cubic)

```js
    for (let i = 0; i < coeffs.length; i++) {
```
- Loop through each coefficient
- Index 0 is highest degree, last index is constant term

```js
        const power = degree - i;
```
- Calculate power for this term
- First coefficient (i=0) gets highest power (degree)
- Last coefficient gets power 0 (constant)
- Example: degree=2 → powers are 2, 1, 0

```js
        const coeff = coeffs[i];
```
- Get coefficient value at current position

```js
        if (coeff === 0) continue;
```
- Skip zero coefficients
- Don't create terms like 0x² (unnecessary)

```js
        if (power === 0) {
            terms.push(createTerm(coeff));
```
- For constant term (power 0), create term without variable
- Just the coefficient value

```js
        } else {
            terms.push(createTerm(coeff, { [variable]: power }));
        }
```
- For non-constant terms, create term with variable and power
- Example: coefficient=3, variable='x', power=2 → 3x²

```js
    return [[createFraction(terms, 1)]];
```
- Wrap terms in fraction with denominator 1
- Wrap in product array (single fraction)
- Wrap in equation array (single product)
- Returns standard equation format

## How It Works

The function creates a polynomial by:

1. **Determine Degree**: Calculate highest power from array length
2. **Loop Through Coefficients**: Process each coefficient in order
3. **Calculate Powers**: Assign decreasing powers (degree, degree-1, ..., 1, 0)
4. **Skip Zeros**: Ignore zero coefficients
5. **Create Terms**: Build term objects with coefficients and powers
6. **Return Equation**: Package as standard equation format

**Key Pattern**: Coefficients are in descending power order: [highest, ..., lowest, constant]

## Usage Examples

### Quadratic Polynomial

```js
// x² - 2x + 1
const poly = polynomial([1, -2, 1], 'x');

console.log(poly);
// [[{numi: {terms: [{coeff:1, var:{x:2}}, {coeff:-2, var:{x:1}}, {coeff:1}]}, deno: 1}]]

// Evaluate at x=3
const result = evaluateEquation(poly, { x: 3 });
console.log(result); // 3² - 2(3) + 1 = 9 - 6 + 1 = 4
```

### Cubic Polynomial

```js
// 2x³ - 5x² + 3x - 1
const cubic = polynomial([2, -5, 3, -1], 'x');

const result = evaluateEquation(cubic, { x: 2 });
console.log(result); // 2(8) - 5(4) + 3(2) - 1 = 16 - 20 + 6 - 1 = 1
```

### Linear Function

```js
// 3x + 5
const linear = polynomial([3, 5], 'x');

const result = evaluateEquation(linear, { x: 10 });
console.log(result); // 3(10) + 5 = 35
```

### Constant (Zero Degree)

```js
// Just 7
const constant = polynomial([7], 'x');

const result = evaluateEquation(constant, { x: 100 });
console.log(result); // 7 (independent of x)
```

### Different Variable

```js
// t² + 4t - 3
const timePoly = polynomial([1, 4, -3], 't');

const result = evaluateEquation(timePoly, { t: 5 });
console.log(result); // 25 + 20 - 3 = 42
```

### Zero Coefficients

```js
// x³ + 0x² + 0x + 8 = x³ + 8
const sparse = polynomial([1, 0, 0, 8], 'x');

// Only creates two terms: x³ and 8
const result = evaluateEquation(sparse, { x: 2 });
console.log(result); // 8 + 8 = 16
```

### High Degree

```js
// x⁵ - x⁴ + x³ - x² + x - 1
const highDegree = polynomial([1, -1, 1, -1, 1, -1], 'x');

const result = evaluateEquation(highDegree, { x: 2 });
console.log(result); // 32 - 16 + 8 - 4 + 2 - 1 = 21
```

### All Negative

```js
// -2x² - 3x - 4
const negative = polynomial([-2, -3, -4], 'x');

const result = evaluateEquation(negative, { x: 1 });
console.log(result); // -2 - 3 - 4 = -9
```

## Step-by-Step Example

Let's create the polynomial 3x² - 5x + 2:

```js
const poly = polynomial([3, -5, 2], 'x');
```

**Step by step:**

1. **Initialize**:
   - terms = []
   - degree = 3 - 1 = 2

2. **i = 0** (coefficient 3):
   - power = 2 - 0 = 2
   - coeff = 3
   - Not zero, power ≠ 0
   - Create term: {coeff: 3, var: {x: 2}}
   - terms = [{coeff: 3, var: {x: 2}}]

3. **i = 1** (coefficient -5):
   - power = 2 - 1 = 1
   - coeff = -5
   - Not zero, power ≠ 0
   - Create term: {coeff: -5, var: {x: 1}}
   - terms = [{coeff: 3, var: {x: 2}}, {coeff: -5, var: {x: 1}}]

4. **i = 2** (coefficient 2):
   - power = 2 - 2 = 0
   - coeff = 2
   - Not zero, power = 0
   - Create term: {coeff: 2}
   - terms = [{coeff: 3, var: {x: 2}}, {coeff: -5, var: {x: 1}}, {coeff: 2}]

5. **Return**:
   - Create fraction with terms, denominator 1
   - Wrap in product array [[fraction]]

**Result**: Equation representing 3x² - 5x + 2

## Mathematical Background

### Polynomial Definition

A polynomial in variable x is:

P(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀

Where:
- n is the degree (highest power)
- aᵢ are coefficients
- a₀ is the constant term

### Coefficient Array Convention

**Standard form**: Coefficients from highest to lowest degree

- `[1, 0, -3, 5]` → x³ + 0x² - 3x + 5 = x³ - 3x + 5
- Matches how we write polynomials mathematically

### Polynomial Degree

- **Linear**: degree 1 (2 coefficients)
- **Quadratic**: degree 2 (3 coefficients)
- **Cubic**: degree 3 (4 coefficients)
- **Quartic**: degree 4 (5 coefficients)
- **Quintic**: degree 5 (6 coefficients)

## Dependencies

This function requires:
- **`createTerm`** — To create individual term objects
- **`createFraction`** — To combine terms into a fraction

## Why Use This?

This function is useful for:

- **Quick Polynomial Creation**: Easy way to build polynomials from coefficients
- **Standard Format**: Ensures consistent equation structure
- **Integration/Differentiation**: Can be used with calculus functions
- **Mathematical Modeling**: Representing polynomial models
- **Testing**: Creating test cases for polynomial operations

## Real-World Applications

### Physics: Projectile Motion

```js
// Height: h(t) = -16t² + 64t + 10
const height = polynomial([-16, 64, 10], 't');

// Height at t=2 seconds
const h2 = evaluateEquation(height, { t: 2 });
console.log('Height at 2s:', h2, 'feet');
// -16(4) + 64(2) + 10 = -64 + 128 + 10 = 74 feet
```

### Economics: Cost Functions

```js
// Total cost: C(x) = 0.01x³ - 0.5x² + 20x + 500
const cost = polynomial([0.01, -0.5, 20, 500], 'x');

// Cost to produce 100 units
const C100 = evaluateEquation(cost, { x: 100 });
console.log('Cost for 100 units: $', C100);
```

### Engineering: Stress-Strain

```js
// Stress: σ(ε) = Eε + Bε³
// Using [0, E, 0, B] format won't work cleanly
// Better: σ(ε) = aε³ + bε
const stress = polynomial([0.001, 0, 200000, 0], 'epsilon');
```

### Chemistry: Reaction Rates

```js
// Rate: r(T) = AT² + BT + C
const rate = polynomial([0.05, 2.3, -10], 'T');

const r_at_300 = evaluateEquation(rate, { T: 300 });
console.log('Reaction rate at 300K:', r_at_300);
```

## Common Patterns

### Perfect Squares

```js
// (x - 3)² = x² - 6x + 9
const square1 = polynomial([1, -6, 9], 'x');

// (x + 5)² = x² + 10x + 25
const square2 = polynomial([1, 10, 25], 'x');
```

### Difference of Squares

```js
// x² - 16 = (x-4)(x+4)
const diff = polynomial([1, 0, -16], 'x');
```

### Factored Forms

```js
// (x-1)(x-2)(x-3) = x³ - 6x² + 11x - 6
const factored = polynomial([1, -6, 11, -6], 'x');
```

## Integration and Differentiation

```js
// Original: x² - 3x + 2
const original = polynomial([1, -3, 2], 'x');

// Differentiate: 2x - 3
const derivative = differentiateFraction(original[0][0], 'x');
console.log(derivative);

// Integrate: x³/3 - 3x²/2 + 2x
const integral = integrateFraction(original[0][0], 'x');
console.log(integral);
```

## Finding Roots (Numerical)

```js
// Find where polynomial = 0
function findRoots(coeffs, variable, range = [-10, 10], samples = 1000) {
    const poly = polynomial(coeffs, variable);
    const roots = [];
    
    const [min, max] = range;
    const step = (max - min) / samples;
    
    let prevValue = evaluateEquation(poly, { [variable]: min });
    
    for (let i = 1; i <= samples; i++) {
        const x = min + i * step;
        const currValue = evaluateEquation(poly, { [variable]: x });
        
        // Sign change indicates root
        if (prevValue * currValue < 0) {
            roots.push(x);
        }
        
        prevValue = currValue;
    }
    
    return roots;
}

// Example: x² - 5x + 6 = 0 has roots at x=2 and x=3
const roots = findRoots([1, -5, 6], 'x');
console.log('Roots:', roots); // Approximately [2, 3]
```

## Conversion from Factored Form

```js
// Convert (x-r₁)(x-r₂)...(x-rₙ) to standard form
// For roots r₁, r₂, ..., rₙ

function fromRoots(roots, variable = 'x') {
    // Start with 1
    let coeffs = [1];
    
    for (let root of roots) {
        // Multiply by (x - root)
        const newCoeffs = new Array(coeffs.length + 1).fill(0);
        
        for (let i = 0; i < coeffs.length; i++) {
            newCoeffs[i] += coeffs[i];
            newCoeffs[i + 1] -= coeffs[i] * root;
        }
        
        coeffs = newCoeffs;
    }
    
    return polynomial(coeffs, variable);
}

// Example: roots at 2 and 3
// (x-2)(x-3) = x² - 5x + 6
const poly = fromRoots([2, 3], 'x');
console.log(evaluateEquation(poly, { x: 0 })); // 6 (constant term)
```

## Performance Notes

- **Time complexity**: O(n) where n = number of coefficients
- Very fast for typical polynomial sizes
- Zero coefficients are skipped efficiently

## Limitations

1. **Polynomial Only**: Cannot represent rational functions, radicals, or transcendental functions
2. **Single Variable**: Each polynomial is in one variable
3. **Real Coefficients**: Works with real numbers, not symbolic coefficients
4. **Order Matters**: Coefficients must be in descending power order

## Tips

### Always Use Descending Order

```js
// CORRECT: [a₂, a₁, a₀] for a₂x² + a₁x + a₀
const correct = polynomial([1, 2, 3], 'x'); // x² + 2x + 3

// WRONG: Don't use ascending order
// polynomial([3, 2, 1]) creates 3x² + 2x + 1, NOT x² + 2x + 3
```

### Include Zero Coefficients for Clarity

```js
// x³ + 5 (no x² or x terms)
const sparse = polynomial([1, 0, 0, 5], 'x');

// More clear than just [1, 5] which would be x + 5
```

### Choose Meaningful Variable Names

```js
const position = polynomial([4.9, 0, 100], 't'); // s(t) = 4.9t² + 100
const voltage = polynomial([0.001, -0.5, 120], 'V'); // P(V)
const temperature = polynomial([1, -273.15], 'C'); // K(C) = C - 273.15
```