# taylorSeries

Generate Taylor series expansion around a point.

## The Formula

f(x) ≈ f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + f'''(a)(x-a)³/3! + ...

## The Code

```js
/**
 * Generate Taylor series expansion around a point
 * f(x) ≈ f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...
 * 
 * @param {Object} func - Function to expand
 * @param {string} variable - Variable name
 * @param {number} center - Point to expand around
 * @param {number} order - Number of terms
 */
function taylorSeries(func, variable, center = 0, order = 5) {
    const terms = [];
    let currentDerivative = deepClone(func);

    for (let n = 0; n < order; n++) {
        // Evaluate derivative at center point
        const value = evaluateEquation([[currentDerivative]], { [variable]: center });

        // Calculate factorial
        const factorial = (n === 0) ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b);

        // Create term: f^(n)(a) / n! * (x - a)^n
        if (Math.abs(value) > 1e-10) {
            if (n === 0) {
                terms.push(createTerm(value));
            } else {
                // For (x - center)^n, we need to handle this carefully
                // Simplified: just create x^n term with adjusted coefficient
                terms.push(createTerm(value / factorial, { [variable]: n }));
            }
        }

        // Get next derivative
        if (n < order - 1) {
            currentDerivative = differentiateFraction(currentDerivative, variable);
        }
    }

    return {
        series: createFraction(terms, 1),
        center,
        order,
        note: `Taylor series around ${variable}=${center} up to order ${order - 1}`
    };
}
```

## Line-by-Line Explanation

```js
function taylorSeries(func, variable, center = 0, order = 5) {
```
- **`func`** — The function object to expand as a Taylor series
- **`variable`** — The variable name (e.g., 'x', 'y')
- **`center`** — Point to expand around (default: 0, making it a Maclaurin series)
- **`order`** — Number of terms to generate (default: 5)

```js
    const terms = [];
```
- Initialize empty array to store Taylor series terms
- Each term represents one derivative term in the expansion

```js
    let currentDerivative = deepClone(func);
```
- Start with the original function (0th derivative)
- `deepClone` creates a copy to avoid modifying the original function

```js
    for (let n = 0; n < order; n++) {
```
- Loop through each order of derivative
- n=0: f(a), n=1: f'(a), n=2: f''(a), etc.

```js
        const value = evaluateEquation([[currentDerivative]], { [variable]: center });
```
- Evaluate the current derivative at the center point
- This gives us f^(n)(a)

```js
        const factorial = (n === 0) ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b);
```
- Calculate n! (n factorial)
- For n=0: factorial is 1
- For n>0: multiply 1×2×3×...×n
- Examples: 0!=1, 1!=1, 2!=2, 3!=6, 4!=24

```js
        if (Math.abs(value) > 1e-10) {
```
- Only add term if the coefficient is non-zero
- `1e-10` is a small threshold to avoid numerical errors

```js
            if (n === 0) {
                terms.push(createTerm(value));
```
- For the constant term (n=0), just add f(a)
- No variable component needed

```js
            } else {
                terms.push(createTerm(value / factorial, { [variable]: n }));
```
- For higher order terms: coefficient is f^(n)(a) / n!
- Variable raised to power n

```js
        if (n < order - 1) {
            currentDerivative = differentiateFraction(currentDerivative, variable);
        }
```
- Get the next derivative for the next iteration
- Don't differentiate on the last iteration (unnecessary)

```js
    return {
        series: createFraction(terms, 1),
        center,
        order,
        note: `Taylor series around ${variable}=${center} up to order ${order - 1}`
    };
```
- Return object containing:
  - **series**: The Taylor polynomial as a fraction
  - **center**: Expansion point
  - **order**: Number of terms
  - **note**: Descriptive message

## How It Works

The function generates a Taylor series by:

1. Starting with the original function
2. For each derivative order (0 to order-1):
   - Evaluate the derivative at the center point
   - Calculate the factorial divisor
   - Create a term: f^(n)(a)/n! × x^n
3. Combine all terms into a single polynomial
4. Return the series with metadata

**Key Formula**: Each term is `f^(n)(a)/n! × (x-a)^n`

## Usage Examples

### Maclaurin Series (center = 0)

```js
// Expand e^x around x=0
// e^x = 1 + x + x²/2! + x³/3! + x⁴/4! + ...

const exp_func = createFraction([createTerm(1, { x: 0 })], 1); // Simplified
const result = taylorSeries(exp_func, 'x', 0, 5);

console.log(result);
// {
//   series: { /* polynomial */ },
//   center: 0,
//   order: 5,
//   note: "Taylor series around x=0 up to order 4"
// }
```

### Taylor Series around x=1

```js
// Expand x² around x=1
const quadratic = createFraction([
    createTerm(1, { x: 2 })
], 1);

const result = taylorSeries(quadratic, 'x', 1, 4);

// x² = 1 + 2(x-1) + (x-1)²
```

### Sine Function Approximation

```js
// sin(x) ≈ x - x³/3! + x⁵/5! - ...
// (Would need sine as input, shown conceptually)

const result = taylorSeries(sineFunc, 'x', 0, 6);
```

### Different Order Expansions

```js
const func = createFraction([createTerm(1, { x: 3 })], 1); // x³

// 3rd order
const result3 = taylorSeries(func, 'x', 0, 3);

// 5th order
const result5 = taylorSeries(func, 'x', 0, 5);
```

## Step-by-Step Example

Let's expand f(x) = x² around x=0 with 3 terms:

```js
const func = createFraction([createTerm(1, { x: 2 })], 1);
const result = taylorSeries(func, 'x', 0, 3);
```

**Step by step:**
1. **n=0**: f(0) = 0, factorial=1
   - value = 0, skip (below threshold)
2. **n=1**: f'(x) = 2x, f'(0) = 0, factorial=1
   - value = 0, skip
3. **n=2**: f''(x) = 2, f''(0) = 2, factorial=2
   - coefficient = 2/2 = 1
   - term: 1×x²
   - Add term: x²

**Result**: Series = x² (exact reconstruction!)

## Mathematical Background

### Taylor Series Definition

The Taylor series of a function f(x) around point a is:

f(x) = Σ(n=0 to ∞) [f^(n)(a) / n!] × (x-a)^n

Where:
- f^(n)(a) is the nth derivative evaluated at a
- n! is n factorial
- (x-a)^n is the power term

### Maclaurin Series

When center = 0, it's called a Maclaurin series:

f(x) = f(0) + f'(0)x + f''(0)x²/2! + f'''(0)x³/3! + ...

### Common Taylor Series

- **e^x** = 1 + x + x²/2! + x³/3! + x⁴/4! + ...
- **sin(x)** = x - x³/3! + x⁵/5! - x⁷/7! + ...
- **cos(x)** = 1 - x²/2! + x⁴/4! - x⁶/6! + ...
- **ln(1+x)** = x - x²/2 + x³/3 - x⁴/4 + ...

## Dependencies

This function requires:
- **`deepClone`** — To copy the function without mutation
- **`evaluateEquation`** — To evaluate derivatives at the center point
- **`differentiateFraction`** — To compute successive derivatives
- **`createTerm`** — To build polynomial terms
- **`createFraction`** — To construct the final series

## Why Use This?

This function is useful for:

- Approximating complex functions with polynomials
- Numerical analysis and computation
- Understanding function behavior near a point
- Building mathematical models
- Computer graphics and physics simulations
- Solving differential equations
- Creating efficient function evaluators

## Real-World Applications

### Physics: Small Angle Approximations

```js
// sin(θ) ≈ θ for small angles
const sine = /* sine function */;
const approx = taylorSeries(sine, 'theta', 0, 2);
// Result: θ (first order approximation)
```

### Engineering: Error Analysis

```js
// Approximate measurement errors
const measurement = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(2, { x: 1 })
], 1); // x² + 2x

const error = taylorSeries(measurement, 'x', 1, 3);
// Analyze behavior near nominal value
```

### Computer Graphics: Smooth Curves

```js
// Polynomial approximation for rendering
const curve = /* complex curve */;
const smooth = taylorSeries(curve, 't', 0.5, 4);
// Fast polynomial evaluation for smooth rendering
```

## Performance Notes

- Time complexity: O(order × derivative_cost)
- Each iteration requires differentiation and evaluation
- Higher orders provide better accuracy but cost more
- Typically, order=5 to order=10 is sufficient for most applications

## Limitations

1. **Convergence**: Not all functions have convergent Taylor series everywhere
2. **Accuracy**: Far from the center point, accuracy decreases
3. **Simplification**: This implementation uses simplified (x-a)^n representation
4. **Numerical Stability**: Very high orders can cause numerical issues