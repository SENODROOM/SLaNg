# surfaceAreaOfRevolution

Compute the surface area when a curve y = f(x) is revolved around the x-axis.

## The Formula

SA = 2π ∫ₐᵇ y√(1 + (dy/dx)²) dx

## The Code

```js
/**
 * Surface area when y=f(x) is revolved around x-axis
 * SA = 2π ∫ₐᵇ y√(1 + (dy/dx)²) dx
 */
function surfaceAreaOfRevolution(func, variable, a, b, numSteps = 1000) {
    const derivative = differentiateFraction(func, variable);

    let totalArea = 0;
    const step = (b - a) / numSteps;

    for (let i = 0; i < numSteps; i++) {
        const x = a + i * step;
        const y = evaluateEquation([[func]], { [variable]: x });
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
        const integrand = y * Math.sqrt(1 + dydx * dydx);
        totalArea += integrand * step;
    }

    return {
        surfaceArea: 2 * Math.PI * totalArea,
        interval: [a, b],
        method: 'numerical integration',
        note: 'Surface area = 2π ∫ y√(1 + (dy/dx)²) dx'
    };
}
```

## Line-by-Line Explanation

```js
function surfaceAreaOfRevolution(func, variable, a, b, numSteps = 1000) {
```
- **`func`** — The function y = f(x) to revolve (fraction object)
- **`variable`** — Variable name (e.g., 'x')
- **`a`** — Start of interval
- **`b`** — End of interval
- **`numSteps`** — Number of segments for numerical integration (default: 1000)

```js
    const derivative = differentiateFraction(func, variable);
```
- Compute f'(x)
- Needed for the √(1 + (dy/dx)²) term

```js
    let totalArea = 0;
```
- Initialize accumulator for the integral result
- Will sum before multiplying by 2π

```js
    const step = (b - a) / numSteps;
```
- Width of each rectangle in Riemann sum
- Smaller step → more accurate approximation

```js
    for (let i = 0; i < numSteps; i++) {
```
- Loop through each segment
- Numerical integration using rectangles

```js
        const x = a + i * step;
```
- Current x position (left endpoint of rectangle)

```js
        const y = evaluateEquation([[func]], { [variable]: x });
```
- Evaluate f(x) at current point
- This is the radius of the circular cross-section

```js
        const dydx = evaluateEquation([[derivative]], { [variable]: x });
```
- Evaluate f'(x) at current point
- Rate of change of the curve

```js
        const integrand = y * Math.sqrt(1 + dydx * dydx);
```
- Calculate y√(1 + (dy/dx)²)
- This is the surface area integrand
- Combines radius with arc length element

```js
        totalArea += integrand * step;
```
- Add area of this slice: integrand × width
- Accumulates the integral

```js
    return {
        surfaceArea: 2 * Math.PI * totalArea,
        interval: [a, b],
        method: 'numerical integration',
        note: 'Surface area = 2π ∫ y√(1 + (dy/dx)²) dx'
    };
```
- Multiply by 2π to get final surface area
- Return with metadata

## How It Works

The function computes surface area by:

1. **Differentiate**: Get f'(x)
2. **Set Up Integral**: Formula is y√(1 + (f'(x))²)
3. **Numerical Integration**:
   - Divide [a, b] into small segments
   - Evaluate integrand at each point
   - Sum: integrand × width
4. **Multiply by 2π**: Final surface area

**Geometric Intuition**: Each thin slice creates a circular band (frustum). The formula sums the lateral surface areas of all these bands.

## Usage Examples

### Cylinder (Straight Line)

```js
// y = 3 from x=0 to x=5
// Creates cylinder: r=3, h=5
// Exact: 2πrh = 2π(3)(5) = 30π ≈ 94.248

const line = createFraction([createTerm(3)], 1);
const result = surfaceAreaOfRevolution(line, 'x', 0, 5);

console.log(result.surfaceArea);
// ≈ 94.248 (matches 30π ✓)
```

### Cone (Linear Function)

```js
// y = x from x=0 to x=4
// Creates cone: base radius=4, height=4
// Exact: πr√(r² + h²) = π(4)√(16+16) = 16π√2 ≈ 71.05

const line = createFraction([createTerm(1, { x: 1 })], 1);
const result = surfaceAreaOfRevolution(line, 'x', 0, 4);

console.log(result.surfaceArea);
// ≈ 71.05
```

### Sphere (Semicircle)

```js
// y = √(r² - x²) from x=-r to x=r
// For a circle of radius 5
// Exact surface area: 4πr² = 4π(25) = 100π ≈ 314.159

// Note: Would need special function setup for sqrt
// Polynomial approximation or exact representation needed
```

### Paraboloid

```js
// y = √x from x=0 to x=4
// (Would need sqrt function representation)

const result = surfaceAreaOfRevolution(sqrtFunc, 'x', 0, 4);
console.log(result.surfaceArea);
```

### Parabola

```js
// y = x² from x=0 to x=1

const parabola = createFraction([createTerm(1, { x: 2 })], 1);
const result = surfaceAreaOfRevolution(parabola, 'x', 0, 1);

console.log(result.surfaceArea);
// Exact: π/6(√5 + sinh⁻¹(2)) ≈ 3.81
```

### Higher Precision

```js
const func = createFraction([createTerm(2)], 1); // y = 2

const standard = surfaceAreaOfRevolution(func, 'x', 0, 10, 1000);
const precise = surfaceAreaOfRevolution(func, 'x', 0, 10, 10000);

console.log('1000 steps:', standard.surfaceArea);
console.log('10000 steps:', precise.surfaceArea);
```

## Step-by-Step Example

Let's compute surface area of y = 2 from x=0 to x=5 (cylinder):

```js
const func = createFraction([createTerm(2)], 1);
const result = surfaceAreaOfRevolution(func, 'x', 0, 5, 5);
```

**Step by step (with 5 steps for simplicity):**

1. **Setup**:
   - a=0, b=5, numSteps=5
   - step = 5/5 = 1

2. **Derivative**:
   - f(x) = 2
   - f'(x) = 0

3. **Iteration 1** (x=0):
   - y = 2
   - dydx = 0
   - integrand = 2 × √(1 + 0²) = 2 × 1 = 2
   - totalArea = 0 + 2×1 = 2

4. **Iteration 2** (x=1):
   - y = 2
   - dydx = 0
   - integrand = 2
   - totalArea = 2 + 2 = 4

5. **Iterations 3-5**: Same pattern
   - totalArea = 4 + 2 + 2 + 2 = 10

6. **Final**:
   - surfaceArea = 2π × 10 = 20π ≈ 62.83

**Exact answer**: 2πrh = 2π(2)(5) = 20π ≈ 62.83 ✓

## Mathematical Background

### Surface Area of Revolution Formula

When y = f(x) is rotated around the x-axis:

1. **Small surface element**:
   - Circumference: 2πy
   - Arc length element: ds = √(1 + (dy/dx)²) dx
   - Surface area element: dS = 2πy ds

2. **Total surface area**:
   - SA = ∫ dS = ∫ₐᵇ 2πy√(1 + (dy/dx)²) dx

### Alternative: Revolution Around y-axis

For revolution around y-axis:

SA = 2π ∫_c^d x√(1 + (dx/dy)²) dy

### Frustum Connection

Each thin slice is approximately a frustum of a cone:
- Surface area of frustum = π(r₁ + r₂)s
- Where s is slant height

The integral sums infinite frustums.

### Derivation

Consider rotating curve from x to x+dx:
- Creates a band (frustum)
- Average radius ≈ y
- Slant height ≈ √(dx² + dy²) = √(1 + (dy/dx)²) dx
- Surface area ≈ 2πy × slant height

## Dependencies

This function requires:
- **`differentiateFraction`** — To compute f'(x)
- **`evaluateEquation`** — To evaluate f(x) and f'(x) at points
- **`Math.sqrt`** — Square root function
- **`Math.PI`** — π constant

## Why Use This?

This function is useful for:

- Computing surface areas of solids of revolution
- Physics and engineering calculations
- Container and tank design
- Calculus problems and verification
- 3D modeling and CAD applications

## Real-World Applications

### Manufacturing: Tank Design

```js
// Water tank with parabolic sides
// y = 0.1x² from x=0 to x=10

const tank = createFraction([
    createTerm(0.1, { x: 2 })
], 1);

const result = surfaceAreaOfRevolution(tank, 'x', 0, 10);

console.log('Material needed:', result.surfaceArea, 'square meters');
console.log('Add 10% for waste:', result.surfaceArea * 1.1);
```

### Architecture: Dome Design

```js
// Spherical dome (hemisphere)
// Surface area calculation for coating material

const dome = /* hemisphere function */;
const result = surfaceAreaOfRevolution(dome, 'x', 0, radius);

console.log('Paint required for', result.surfaceArea, 'm²');
```

### Physics: Heat Transfer

```js
// Rotating object with temperature gradient
// Surface area determines heat dissipation rate

const component = createFraction([
    createTerm(2),
    createTerm(0.1, { x: 1 })
], 1);

const result = surfaceAreaOfRevolution(component, 'x', 0, 50);

const heatTransferRate = result.surfaceArea * heatTransferCoefficient * tempDiff;
console.log('Heat loss:', heatTransferRate, 'watts');
```

### Engineering: Pressure Vessel

```js
// Cylindrical vessel with hemispherical ends

function vesselSurfaceArea(radius, length) {
    // Cylinder part
    const cylinder = createFraction([createTerm(radius)], 1);
    const cylinderSA = surfaceAreaOfRevolution(cylinder, 'x', 0, length);
    
    // Two hemisphere ends (= one full sphere)
    const sphereSA = 4 * Math.PI * radius * radius;
    
    return {
        total: cylinderSA.surfaceArea + sphereSA,
        cylinder: cylinderSA.surfaceArea,
        ends: sphereSA
    };
}

const vessel = vesselSurfaceArea(2, 10);
console.log('Total surface area:', vessel.total, 'm²');
```

## Common Solids of Revolution

### Cylinder
- **Function**: y = r (constant)
- **Formula**: SA = 2πrh
- **Example**: Can, pipe

### Cone
- **Function**: y = rx/h
- **Formula**: SA = πr√(r² + h²)
- **Example**: Cone, funnel

### Sphere
- **Function**: y = √(r² - x²)
- **Formula**: SA = 4πr²
- **Example**: Ball, planet

### Paraboloid
- **Function**: y = ax²
- **Formula**: (Complex integral)
- **Example**: Satellite dish, headlight reflector

## Accuracy and Performance

### Effect of numSteps

```js
const func = createFraction([createTerm(3)], 1); // y = 3 (cylinder)

[100, 1000, 10000].forEach(steps => {
    const result = surfaceAreaOfRevolution(func, 'x', 0, 5, steps);
    console.log(`${steps} steps: ${result.surfaceArea}`);
});

// All should be close to 30π ≈ 94.248
```

### Performance Notes

- **Time complexity**: O(numSteps)
- Each step: 2 evaluations + arithmetic
- Default (1000 steps) is fast
- Increase for complex curves

### Recommended Settings

- **Quick estimate**: 100 steps
- **Standard**: 1000 steps (default)
- **High precision**: 10000 steps
- **Critical applications**: 100000 steps

## Limitations

1. **Numerical Approximation**: Not exact
2. **Positive y Values**: Function must be ≥ 0 on [a, b]
3. **Smooth Curves**: Assumes differentiable function
4. **X-axis Revolution Only**: This version only handles x-axis
5. **Polynomial Derivatives**: Best with polynomial f'(x)

## Verification Examples

### Cylinder Check

```js
// y = r should give 2πrh

function verifyCylinder(r, h) {
    const func = createFraction([createTerm(r)], 1);
    const result = surfaceAreaOfRevolution(func, 'x', 0, h);
    const exact = 2 * Math.PI * r * h;
    
    console.log('Numerical:', result.surfaceArea);
    console.log('Exact:', exact);
    console.log('Error:', Math.abs(result.surfaceArea - exact));
}

verifyCylinder(3, 5); // Should match 30π
```

### Cone Check

```js
// y = x should give πr√(r² + h²)

function verifyCone(h) {
    const func = createFraction([createTerm(1, { x: 1 })], 1);
    const result = surfaceAreaOfRevolution(func, 'x', 0, h);
    const exact = Math.PI * h * Math.sqrt(h * h + h * h); // r = h
    
    console.log('Numerical:', result.surfaceArea);
    console.log('Exact:', exact);
    console.log('Relative error:', 
        Math.abs(result.surfaceArea - exact) / exact * 100, '%');
}

verifyCone(4);
```

## Extension: Revolution Around y-axis

```js
/**
 * Surface area when x=g(y) is revolved around y-axis
 * SA = 2π ∫_c^d x√(1 + (dx/dy)²) dy
 */
function surfaceAreaRevolutionYAxis(func, variable, c, d, numSteps = 1000) {
    // Similar implementation but with x and y swapped
    const derivative = differentiateFraction(func, variable);
    
    let totalArea = 0;
    const step = (d - c) / numSteps;
    
    for (let i = 0; i < numSteps; i++) {
        const y = c + i * step;
        const x = evaluateEquation([[func]], { [variable]: y });
        const dxdy = evaluateEquation([[derivative]], { [variable]: y });
        const integrand = x * Math.sqrt(1 + dxdy * dxdy);
        totalArea += integrand * step;
    }
    
    return {
        surfaceArea: 2 * Math.PI * totalArea,
        interval: [c, d],
        axis: 'y-axis',
        method: 'numerical integration'
    };
}
```

## Advanced: Gabriel's Horn

```js
// Famous example: y = 1/x for x ≥ 1
// Finite volume but infinite surface area!

const horn = createFraction([createTerm(1)], 1); // Would need 1/x representation

// Surface area from 1 to large number diverges
const result1 = surfaceAreaOfRevolution(horn, 'x', 1, 100);
const result2 = surfaceAreaOfRevolution(horn, 'x', 1, 1000);

console.log('1 to 100:', result1.surfaceArea);
console.log('1 to 1000:', result2.surfaceArea);
// Continues to grow without bound
```