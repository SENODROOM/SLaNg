# integralOverRegion

Compute definite integral over a rectangular region using iterated integration.

## The Formula

∫∫...∫ f(x₁, x₂, ..., xₙ) dx₁ dx₂ ... dxₙ

Over region: [a₁,b₁] × [a₂,b₂] × ... × [aₙ,bₙ]

## The Code

```js
/**
 * Compute definite integral over a rectangular region
 * @param {Object} expr - Expression to integrate
 * @param {Object} bounds - {x: [lower, upper], y: [lower, upper], ...}
 * 
 * Example: 
 * integralOverRegion(xy, {x: [0, 2], y: [0, 3]})
 * computes ∫₀² ∫₀³ xy dy dx
 */
function integralOverRegion(expr, bounds) {
    let result = deepClone(expr);

    for (let [variable, [lower, upper]] of Object.entries(bounds)) {
        result = definiteIntegrateFraction(result, lower, upper, variable);
        result = simplifyFraction(result);
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function integralOverRegion(expr, bounds) {
```
- **`expr`** — Expression to integrate (fraction object)
- **`bounds`** — Object mapping variables to [lower, upper] limits
- Example: `{x: [0, 2], y: [0, 3]}` means integrate x from 0 to 2, y from 0 to 3

```js
    let result = deepClone(expr);
```
- **`deepClone`** — Create independent copy of expression
- Prevents modifying the original expression
- Important because we'll be transforming this repeatedly

```js
    for (let [variable, [lower, upper]] of Object.entries(bounds)) {
```
- **`Object.entries(bounds)`** — Convert bounds object to array of [key, value] pairs
- Example: `{x: [0,2], y: [0,3]}` → `[['x', [0,2]], ['y', [0,3]]]`
- **`[variable, [lower, upper]]`** — Destructure each entry
  - `variable` is the variable name (string)
  - `[lower, upper]` destructures the bounds array

```js
        result = definiteIntegrateFraction(result, lower, upper, variable);
```
- **Integrate with respect to one variable**
- Computes ∫_{lower}^{upper} result d(variable)
- Evaluates antiderivative at bounds and subtracts
- Updates result for next iteration

```js
        result = simplifyFraction(result);
```
- **Simplify after each integration**
- Combines like terms
- Reduces fractions
- Keeps expression manageable

```js
    }
```
- End of loop
- After all variables integrated, result contains final answer

```js
    return result;
```
- Return the final fraction
- Contains the numeric/symbolic result of the integration

## How It Works

The function computes iterated integrals by:

1. **Clone Expression**: Make working copy
2. **Loop Through Variables**: Integrate one variable at a time
3. **Integrate**: Compute definite integral for each variable
4. **Simplify**: Clean up after each integration
5. **Return Result**: Final integrated value

**Order Independence**: For rectangular regions, order of integration doesn't matter (Fubini's theorem).

## Usage Examples

### Double Integral: ∫∫ xy dA

```js
// ∫₀² ∫₀³ xy dy dx
const integrand = sum([[1, {x:1, y:1}]]); // xy

const result = integralOverRegion(
    integrand[0][0], 
    {x: [0, 2], y: [0, 3]}
);

const value = evaluateEquation([[result]], {});
console.log(value); // 9
```

**Step by step**:
1. First integrate with respect to x: ∫₀² xy dx = [x²y/2]₀² = 2y
2. Then integrate with respect to y: ∫₀³ 2y dy = [y²]₀³ = 9

### Double Integral: Polynomial

```js
// ∫₀¹ ∫₀¹ (x² + y²) dy dx
const integrand = sum([[1, {x:2}], [1, {y:2}]]);

const result = integralOverRegion(
    integrand[0][0],
    {x: [0, 1], y: [0, 1]}
);

const value = evaluateEquation([[result]], {});
console.log(value); // 2/3
```

**Calculation**:
- ∫(x² + y²) dy = x²y + y³/3
- Evaluate 0 to 1: x² + 1/3
- ∫₀¹ (x² + 1/3) dx = x³/3 + x/3 |₀¹ = 1/3 + 1/3 = 2/3

### Triple Integral

```js
// ∫₀¹ ∫₀² ∫₀³ xyz dz dy dx
const integrand = sum([[1, {x:1, y:1, z:1}]]);

const result = integralOverRegion(
    integrand[0][0],
    {x: [0, 1], y: [0, 2], z: [0, 3]}
);

const value = evaluateEquation([[result]], {});
console.log(value); // 4.5
```

**Calculation**: (1/2)(2/2)(9/2) = 9/2 = 4.5

### Area Under Surface

```js
// Volume under z = x + y over [0,1] × [0,1]
// ∫₀¹ ∫₀¹ (x + y) dy dx
const surface = sum([[1, {x:1}], [1, {y:1}]]);

const volume = integralOverRegion(
    surface[0][0],
    {x: [0, 1], y: [0, 1]}
);

const V = evaluateEquation([[volume]], {});
console.log(V); // 1
```

### Different Bounds

```js
// ∫₁⁴ ∫₂⁵ xy dy dx
const integrand = sum([[1, {x:1, y:1}]]);

const result = integralOverRegion(
    integrand[0][0],
    {x: [1, 4], y: [2, 5]}
);

const value = evaluateEquation([[result]], {});
console.log(value); 
// (4²-1²)/2 × (5²-2²)/2 = 7.5 × 10.5 = 78.75
```

### Constant Integrand (Area)

```js
// ∫₀⁵ ∫₀³ 1 dy dx = 5 × 3 = 15
const one = createFraction([createTerm(1)], 1);

const area = integralOverRegion(
    one,
    {x: [0, 5], y: [0, 3]}
);

const A = evaluateEquation([[area]], {});
console.log(A); // 15
```

### Higher Degree Polynomial

```js
// ∫₀¹ ∫₀¹ (x²y + xy²) dy dx
const integrand = sum([
    [1, {x:2, y:1}],
    [1, {x:1, y:2}]
]);

const result = integralOverRegion(
    integrand[0][0],
    {x: [0, 1], y: [0, 1]}
);

const value = evaluateEquation([[result]], {});
console.log(value); // 1/3 + 1/3 = 2/3
```

### Negative Bounds

```js
// ∫₋₁¹ ∫₋₁¹ x²y² dy dx
const integrand = sum([[1, {x:2, y:2}]]);

const result = integralOverRegion(
    integrand[0][0],
    {x: [-1, 1], y: [-1, 1]}
);

const value = evaluateEquation([[result]], {});
console.log(value); // 4/9
```

## Step-by-Step Example

Compute ∫₀² ∫₀¹ 2xy dy dx:

```js
const integrand = sum([[2, {x:1, y:1}]]); // 2xy
const result = integralOverRegion(
    integrand[0][0],
    {x: [0, 2], y: [0, 1]}
);
```

**Step by step**:

1. **Initial state**:
   - result = 2xy
   - bounds = {x: [0,2], y: [0,1]}

2. **First iteration** (x):
   - variable = 'x'
   - lower = 0, upper = 2
   - Integrate: ∫₀² 2xy dx
   - Antiderivative: x²y
   - Evaluate: [x²y]₀² = 4y - 0 = 4y
   - result = 4y

3. **Simplify**: result = 4y (already simple)

4. **Second iteration** (y):
   - variable = 'y'
   - lower = 0, upper = 1
   - Integrate: ∫₀¹ 4y dy
   - Antiderivative: 2y²
   - Evaluate: [2y²]₀¹ = 2 - 0 = 2
   - result = 2

5. **Simplify**: result = 2

6. **Return**: 2

**Verify**: ∫₀² ∫₀¹ 2xy dy dx = ∫₀² [xy²]₀¹ dx = ∫₀² x dx = [x²/2]₀² = 2 ✓

## Mathematical Background

### Iterated Integrals

For a rectangular region R = [a,b] × [c,d]:

∫∫_R f(x,y) dA = ∫ₐᵇ ∫_c^d f(x,y) dy dx = ∫_c^d ∫ₐᵇ f(x,y) dx dy

### Fubini's Theorem

For continuous functions on rectangular regions:
- Order of integration doesn't matter
- Can integrate in any order
- This function uses the order provided in bounds object

### Higher Dimensions

Extends naturally to 3D, 4D, etc.:

∫∫∫_R f(x,y,z) dV = ∫∫∫ f(x,y,z) dz dy dx

### Volume Under Surface

For z = f(x,y):

V = ∫∫_R f(x,y) dA

## Dependencies

This function requires:
- **`deepClone`** — Creates independent copy
- **`definiteIntegrateFraction`** — Computes definite integral
- **`simplifyFraction`** — Simplifies expressions
- **`Object.entries`** — JavaScript built-in

## Why Use This?

This function is useful for:

- **Multi-dimensional Integration**: Handle 2D, 3D, and higher
- **Volume Calculations**: Find volumes under surfaces
- **Probability**: Compute probabilities over regions
- **Physics**: Mass, center of mass, moment of inertia
- **Area Calculations**: Find areas of regions

## Real-World Applications

### Physics: Center of Mass

```js
// Find center of mass of rectangular plate
// density ρ(x,y) = x + y

const density = sum([[1, {x:1}], [1, {y:1}]]);

// Total mass
const mass = integralOverRegion(
    density[0][0],
    {x: [0, 2], y: [0, 3]}
);

// Moment about y-axis
const xDensity = sum([[1, {x:2}], [1, {x:1, y:1}]]);
const Mx = integralOverRegion(
    xDensity[0][0],
    {x: [0, 2], y: [0, 3]}
);

const M = evaluateEquation([[mass]], {});
const mx = evaluateEquation([[Mx]], {});

const x_bar = mx / M;
console.log('Center of mass x-coordinate:', x_bar);
```

### Engineering: Heat Distribution

```js
// Average temperature T(x,y) = x² + y² over [0,1] × [0,1]

const temperature = sum([[1, {x:2}], [1, {y:2}]]);

const totalTemp = integralOverRegion(
    temperature[0][0],
    {x: [0, 1], y: [0, 1]}
);

const area = 1 * 1; // 1×1 square
const avgTemp = evaluateEquation([[totalTemp]], {}) / area;

console.log('Average temperature:', avgTemp); // 2/3
```

### Probability: Joint Distribution

```js
// P(0 ≤ X ≤ 0.5, 0 ≤ Y ≤ 0.5) for f(x,y) = 4xy

const pdf = sum([[4, {x:1, y:1}]]);

const probability = integralOverRegion(
    pdf[0][0],
    {x: [0, 0.5], y: [0, 0.5]}
);

const P = evaluateEquation([[probability]], {});
console.log('Probability:', P); // 0.0625
```

### Economics: Total Revenue

```js
// Revenue per unit area R(x,y) = 100 - x - y
// Over region [0,10] × [0,10]

const revenue = sum([[100, {}], [-1, {x:1}], [-1, {y:1}]]);

const totalRevenue = integralOverRegion(
    revenue[0][0],
    {x: [0, 10], y: [0, 10]}
);

const TR = evaluateEquation([[totalRevenue]], {});
console.log('Total revenue:', TR);
```

## Order of Integration

```js
// Can specify any order via bounds object

// Order 1: integrate x first, then y
const result1 = integralOverRegion(expr, {x: [0,1], y: [0,2]});

// Order 2: integrate y first, then x  
const result2 = integralOverRegion(expr, {y: [0,2], x: [0,1]});

// For rectangular regions, results are identical
```

**Note**: JavaScript object property order is preserved (ES2015+), so bounds order determines integration order.

## Symbolic Results

```js
// Can keep bounds symbolic

const integrand = sum([[1, {x:1}]]);

// Would need symbolic bounds support
// const result = integralOverRegion(integrand[0][0], {x: [0, 'a']});
// Currently requires numeric bounds
```

## Performance Notes

- **Time complexity**: O(n × m) where n = number of variables, m = expression complexity
- Each integration step processes entire expression
- Simplification after each step prevents expression bloat
- For 2D: typically very fast
- For 3D+: can be slower with complex expressions

## Limitations

1. **Rectangular Regions Only**: Bounds must be constants
   - Cannot handle y-dependent x bounds directly
   - For non-rectangular regions, need multiple integrals

2. **Numeric Bounds Required**: Bounds must be numbers
   - Cannot use symbolic bounds easily

3. **Order Matters for Non-Rectangular**: 
   - For non-rectangular regions (not supported directly)
   - Would need different approach

4. **Expression Must Be Integrable**: Polynomial expressions only
   - No trigonometric, exponential, etc.

## Tips and Best Practices

### Always Simplify

```js
// Simplification is built-in, but good to know it happens
// Keeps expressions manageable
```

### Check Bounds Carefully

```js
// Make sure bounds are in correct order
const correct = {x: [0, 2], y: [1, 5]};  // lower < upper

const wrong = {x: [2, 0], y: [5, 1]};    // upper < lower (negative result)
```

### Use Descriptive Variable Names

```js
// Good: meaningful names
const volume = integralOverRegion(
    density[0][0],
    {x: [0, width], y: [0, height], z: [0, depth]}
);

// Less clear
const result = integralOverRegion(expr, {a: [0,1], b: [0,1], c: [0,1]});
```

### Verify with Simple Cases

```js
// Test with f(x,y) = 1 to verify area
const one = createFraction([createTerm(1)], 1);
const area = integralOverRegion(one, {x: [0,5], y: [0,3]});
// Should equal 5 × 3 = 15
```