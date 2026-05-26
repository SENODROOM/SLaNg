# arcLength

Compute the arc length of a curve y = f(x) from a to b using numerical integration.

## The Formula

L = ∫ₐᵇ √(1 + (f'(x))²) dx

## The Code

```js
/**
 * Compute arc length of curve y = f(x) from a to b
 * L = ∫ₐᵇ √(1 + (f'(x))²) dx
 * 
 * Note: This uses numerical integration since √ is not polynomial
 */
function arcLength(func, variable, a, b, numSteps = 1000) {
    const derivative = differentiateFraction(func, variable);

    let totalLength = 0;
    const step = (b - a) / numSteps;

    for (let i = 0; i < numSteps; i++) {
        const x = a + i * step;
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
        const integrand = Math.sqrt(1 + dydx * dydx);
        totalLength += integrand * step;
    }

    return {
        length: totalLength,
        interval: [a, b],
        method: 'numerical integration',
        note: 'Arc length = ∫√(1 + (dy/dx)²) dx'
    };
}
```

## Line-by-Line Explanation

```js
function arcLength(func, variable, a, b, numSteps = 1000) {
```
- **`func`** — The function y = f(x) (fraction object)
- **`variable`** — Variable name (e.g., 'x')
- **`a`** — Start of interval
- **`b`** — End of interval
- **`numSteps`** — Number of rectangles for numerical integration (default: 1000)

```js
    const derivative = differentiateFraction(func, variable);
```
- Compute f'(x)
- Need this for the arc length formula

```js
    let totalLength = 0;
```
- Initialize accumulator for the total arc length
- Will sum up many small segments

```js
    const step = (b - a) / numSteps;
```
- Calculate width of each rectangle
- Divides interval [a, b] into numSteps equal parts

```js
    for (let i = 0; i < numSteps; i++) {
```
- Loop through each small segment
- Using Riemann sum approximation

```js
        const x = a + i * step;
```
- Calculate current x position
- Left endpoint of each rectangle

```js
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
```
- Evaluate f'(x) at current point
- This is dy/dx

```js
        const integrand = Math.sqrt(1 + dydx * dydx);
```
- Calculate √(1 + (dy/dx)²)
- This is the arc length integrand
- Represents the "speed" along the curve

```js
        totalLength += integrand * step;
```
- Add area of this rectangle: height × width
- Accumulates the total arc length

```js
    return {
        length: totalLength,
        interval: [a, b],
        method: 'numerical integration',
        note: 'Arc length = ∫√(1 + (dy/dx)²) dx'
    };
```
- Return comprehensive result object

## How It Works

The function computes arc length using:

1. **Differentiate**: Get f'(x)
2. **Set Up Integral**: Use formula √(1 + (f'(x))²)
3. **Numerical Integration**:
   - Divide [a, b] into many small segments
   - Evaluate integrand at each segment
   - Sum up: integrand × width
4. **Return Total**: Sum approximates the integral

**Geometric Intuition**: Arc length is the distance traveled along the curve, accounting for both horizontal and vertical movement.

## Usage Examples

### Straight Line

```js
// y = 2x from x=0 to x=3
// Exact length = 3√5 ≈ 6.708

const line = createFraction([createTerm(2, { x: 1 })], 1);
const result = arcLength(line, 'x', 0, 3);

console.log(result);
// {
//   length: 6.708203932499369,
//   interval: [0, 3],
//   method: 'numerical integration',
//   note: 'Arc length = ∫√(1 + (dy/dx)²) dx'
// }

// Verify: √((3-0)² + (6-0)²) = √(9+36) = √45 ≈ 6.708 ✓
```

### Parabola

```js
// y = x² from x=0 to x=1

const parabola = createFraction([createTerm(1, { x: 2 })], 1);
const result = arcLength(parabola, 'x', 0, 1);

console.log(result.length);
// ≈ 1.478... (exact: (√5 + sinh⁻¹(2))/2)
```

### Semicircle (Partial)

```js
// y = √(r² - x²) gives a circle of radius r
// For polynomial approximation or using specific function

const r = 5;
// Would need to set up function appropriately
const result = arcLength(semicircle, 'x', -r, r);

console.log(result.length);
// Should approximate πr (half circumference)
```

### Cubic Function

```js
// y = x³ from x=0 to x=2

const cubic = createFraction([createTerm(1, { x: 3 })], 1);
const result = arcLength(cubic, 'x', 0, 2);

console.log(result.length);
// ≈ 8.631
```

### Higher Precision

```js
// Use more steps for better accuracy
const func = createFraction([createTerm(1, { x: 2 })], 1);

const lowPrecision = arcLength(func, 'x', 0, 1, 100);
const highPrecision = arcLength(func, 'x', 0, 1, 10000);

console.log('100 steps:', lowPrecision.length);
console.log('10000 steps:', highPrecision.length);
// Higher numSteps → more accurate result
```

### Negative Interval

```js
// y = x² from x=-2 to x=2

const func = createFraction([createTerm(1, { x: 2 })], 1);
const result = arcLength(func, 'x', -2, 2);

console.log(result.length);
// Arc length is always positive
```

## Step-by-Step Example

Let's compute arc length of y = x from x=0 to x=3:

```js
const func = createFraction([createTerm(1, { x: 1 })], 1);
const result = arcLength(func, 'x', 0, 3, 3);
```

**Step by step (with 3 steps for simplicity):**

1. **Setup**:
   - a=0, b=3, numSteps=3
   - step = 3/3 = 1

2. **Derivative**:
   - f(x) = x
   - f'(x) = 1

3. **Iteration 1** (x=0):
   - dydx = 1
   - integrand = √(1 + 1²) = √2 ≈ 1.414
   - totalLength = 0 + 1.414×1 = 1.414

4. **Iteration 2** (x=1):
   - dydx = 1
   - integrand = √2 ≈ 1.414
   - totalLength = 1.414 + 1.414 = 2.828

5. **Iteration 3** (x=2):
   - dydx = 1
   - integrand = √2 ≈ 1.414
   - totalLength = 2.828 + 1.414 = 4.243

**Result**: length ≈ 4.243

**Exact answer**: Distance from (0,0) to (3,3) = √(3² + 3²) = 3√2 ≈ 4.243 ✓

## Mathematical Background

### Arc Length Formula Derivation

For a curve y = f(x):

1. Small segment has:
   - Horizontal change: dx
   - Vertical change: dy = f'(x)dx

2. By Pythagorean theorem:
   - ds = √(dx² + dy²)
   - ds = √(dx² + (f'(x)dx)²)
   - ds = √(1 + (f'(x))²) dx

3. Total length:
   - L = ∫ ds = ∫ₐᵇ √(1 + (f'(x))²) dx

### Parametric Form

For parametric curves x(t), y(t):

L = ∫ₐᵇ √((dx/dt)² + (dy/dt)²) dt

### Polar Form

For polar curves r(θ):

L = ∫ₐᵇ √(r² + (dr/dθ)²) dθ

### Why Numerical Integration?

The arc length integrand √(1 + (f'(x))²) usually cannot be integrated symbolically, even for simple polynomials. Numerical methods are necessary.

## Dependencies

This function requires:
- **`differentiateFraction`** — To compute f'(x)
- **`evaluateEquation`** — To evaluate derivative at points
- **`Math.sqrt`** — Square root function

## Why Use This?

This function is useful for:

- Computing distance along curved paths
- Physics problems (path length)
- Engineering applications (cable length, road design)
- Computer graphics (curve rendering)
- Calculus problems and verification

## Real-World Applications

### Civil Engineering: Road Length

```js
// Highway follows terrain contour y = elevation(x)

const elevation = createFraction([
    createTerm(0.001, { x: 3 }),
    createTerm(-0.05, { x: 2 }),
    createTerm(10, { x: 1 })
], 1);

const result = arcLength(elevation, 'x', 0, 1000);

console.log('Road length:', result.length, 'meters');
console.log('Extra distance vs. horizontal:', 
    result.length - 1000, 'meters'
);
```

### Physics: Particle Path

```js
// Particle follows trajectory y = -4.9t² + 20t

const trajectory = createFraction([
    createTerm(-4.9, { t: 2 }),
    createTerm(20, { t: 1 })
], 1);

const result = arcLength(trajectory, 't', 0, 2);

console.log('Total distance traveled:', result.length, 'meters');
```

### Manufacturing: Cable/Wire Length

```js
// Wire follows curve between two points

const wire = createFraction([
    createTerm(0.01, { x: 2 })
], 1);

const result = arcLength(wire, 'x', 0, 100);

console.log('Wire needed:', result.length, 'cm');
```

### Computer Graphics: Curve Rendering

```js
// Bezier curve approximation

function estimateCurveComplexity(curve, start, end) {
    const length = arcLength(curve, 't', start, end);
    
    // More segments needed for longer curves
    const numSegments = Math.ceil(length / 0.1);
    
    return numSegments;
}
```

## Accuracy and Precision

### How numSteps Affects Accuracy

```js
const func = createFraction([createTerm(1, { x: 2 })], 1);

console.log('10 steps:', arcLength(func, 'x', 0, 1, 10).length);
console.log('100 steps:', arcLength(func, 'x', 0, 1, 100).length);
console.log('1000 steps:', arcLength(func, 'x', 0, 1, 1000).length);
console.log('10000 steps:', arcLength(func, 'x', 0, 1, 10000).length);

// Converges to the true value as numSteps increases
```

### Error Estimation

For Riemann sum approximation:
- Error ≈ O(1/numSteps)
- Doubling numSteps roughly halves the error

### Recommended Settings

- **Quick estimate**: numSteps = 100
- **Standard accuracy**: numSteps = 1000 (default)
- **High precision**: numSteps = 10000
- **Ultra precision**: numSteps = 100000

## Performance Notes

- **Time complexity**: O(numSteps)
- Each step requires:
  - One derivative evaluation
  - One square root
  - One multiplication
  - One addition
- Default (1000 steps) is fast for most applications
- Increase for very long curves or high precision needs

## Limitations

1. **Numerical Only**: No symbolic result
2. **Approximation**: Not exact (unless very high numSteps)
3. **Polynomial Functions**: Best suited for polynomial derivatives
4. **Smooth Curves**: Assumes function is differentiable on [a, b]
5. **Finite Derivatives**: Very steep slopes (large |f'(x)|) may need more steps

## Alternative Methods

### Simpson's Rule (More Accurate)

```js
function arcLengthSimpson(func, variable, a, b, numSteps = 1000) {
    // Ensure even number of steps
    if (numSteps % 2 !== 0) numSteps++;
    
    const derivative = differentiateFraction(func, variable);
    const h = (b - a) / numSteps;
    
    let sum = 0;
    
    for (let i = 0; i <= numSteps; i++) {
        const x = a + i * h;
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
        const f = Math.sqrt(1 + dydx * dydx);
        
        if (i === 0 || i === numSteps) {
            sum += f;
        } else if (i % 2 === 1) {
            sum += 4 * f;
        } else {
            sum += 2 * f;
        }
    }
    
    return {
        length: (h / 3) * sum,
        interval: [a, b],
        method: 'Simpson\'s rule',
        note: 'More accurate than rectangular approximation'
    };
}
```

### Adaptive Integration

```js
// Automatically adjust step size based on curve complexity
function arcLengthAdaptive(func, variable, a, b, tolerance = 0.001) {
    // Implementation would recursively subdivide
    // regions with high curvature
}
```

## Verification Examples

### Horizontal Line

```js
// y = 5, length should equal b - a
const horizontal = createFraction([createTerm(5)], 1);
const result = arcLength(horizontal, 'x', 0, 10);

console.log(result.length); // ≈ 10 ✓
// f'(x) = 0, so √(1 + 0²) = 1, integral = 10
```

### Vertical Scaling

```js
// Length of y = kx is proportional to k

const k2 = createFraction([createTerm(2, { x: 1 })], 1);
const k3 = createFraction([createTerm(3, { x: 1 })], 1);

const L2 = arcLength(k2, 'x', 0, 1);
const L3 = arcLength(k3, 'x', 0, 1);

console.log('Ratio:', L3.length / L2.length);
// Should be √10 / √5 = √2 ≈ 1.414
```