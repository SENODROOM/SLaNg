# partialDerivative

Compute partial derivative of an expression with respect to a variable.

## The Formula

∂ⁿf/∂xⁿ (nth partial derivative)

## The Code

```js
/**
 * Compute partial derivative with respect to variable
 * @param {Object} expr - Expression to differentiate
 * @param {string} variable - Variable to differentiate with respect to
 * @param {number} order - Order of derivative (default 1)
 */
function partialDerivative(expr, variable, order = 1) {
    let result = deepClone(expr);

    for (let i = 0; i < order; i++) {
        result = differentiateFraction(result, variable);
        result = simplifyFraction(result);
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function partialDerivative(expr, variable, order = 1) {
```
- **`expr`** — Expression to differentiate (fraction object)
- **`variable`** — Variable name to differentiate with respect to
- **`order`** — How many times to differentiate (default: 1)
- Example: `order=2` computes ∂²f/∂x²

```js
    let result = deepClone(expr);
```
- **Clone expression** — Create independent copy
- Prevents modifying original expression
- Important for repeated differentiation

```js
    for (let i = 0; i < order; i++) {
```
- **Loop `order` times** — Take derivative repeatedly
- First iteration: first derivative
- Second iteration: second derivative
- etc.

```js
        result = differentiateFraction(result, variable);
```
- **Differentiate once** — Take derivative with respect to variable
- Updates result with derivative
- Treats other variables as constants

```js
        result = simplifyFraction(result);
```
- **Simplify after each derivative** — Clean up expression
- Combines like terms
- Reduces coefficients
- Prevents expression bloat

```js
    }
    return result;
}
```
- **Return final result** — After `order` differentiations

## How It Works

1. **Clone**: Make working copy
2. **Loop**: Differentiate `order` times
3. **Differentiate**: Apply derivative rules
4. **Simplify**: Clean up after each step
5. **Return**: Final derivative

## Usage Examples

### First Partial Derivative

```js
// f(x,y) = x²y
const f = sum([[1, {x:2, y:1}]]);

// ∂f/∂x = 2xy
const dfdx = partialDerivative(f[0][0], 'x');

const result = evaluateEquation([[dfdx]], {x: 3, y: 4});
console.log(result); // 2(3)(4) = 24
```

### Second Partial Derivative

```js
// f(x,y) = x³y²
const f = sum([[1, {x:3, y:2}]]);

// ∂²f/∂x² = 6xy²
const d2fdx2 = partialDerivative(f[0][0], 'x', 2);

const result = evaluateEquation([[d2fdx2]], {x: 2, y: 3});
console.log(result); // 6(2)(9) = 108
```

### Mixed Partial Derivatives

```js
// f(x,y) = x²y³
const f = sum([[1, {x:2, y:3}]]);

// ∂f/∂x = 2xy³
const dfdx = partialDerivative(f[0][0], 'x');

// ∂²f/∂y∂x = 6xy²
const d2fdydx = partialDerivative(dfdx, 'y');

const result = evaluateEquation([[d2fdydx]], {x: 1, y: 2});
console.log(result); // 6(1)(4) = 24
```

### Third Derivative

```js
// f(x) = x⁴
const f = sum([[1, {x:4}]]);

// d³f/dx³ = 24x
const d3f = partialDerivative(f[0][0], 'x', 3);

const result = evaluateEquation([[d3f]], {x: 2});
console.log(result); // 24(2) = 48
```

## Dependencies

- **`deepClone`** — Copy expression
- **`differentiateFraction`** — Take derivative
- **`simplifyFraction`** — Simplify result

## Why Use This?

- **Higher Derivatives**: Easy to compute ∂ⁿf/∂xⁿ
- **Auto-Simplification**: Built-in simplification
- **Convenience**: Cleaner than manual loops

## Real-World Applications

### Physics: Acceleration

```js
// s(t) = -16t² + 64t + 10
const position = sum([[-16, {t:2}], [64, {t:1}], [10, {}]]);

// v(t) = ds/dt = -32t + 64
const velocity = partialDerivative(position[0][0], 't');

// a(t) = d²s/dt² = -32
const acceleration = partialDerivative(position[0][0], 't', 2);

console.log('Acceleration:', evaluateEquation([[acceleration]], {})); // -32
```

### Economics: Marginal Analysis

```js
// C(x) = 0.01x² + 5x + 100
const cost = sum([[0.01, {x:2}], [5, {x:1}], [100, {}]]);

// Marginal cost = dC/dx
const marginalCost = partialDerivative(cost[0][0], 'x');

const MC = evaluateEquation([[marginalCost]], {x: 50});
console.log('Marginal cost at x=50:', MC);
```