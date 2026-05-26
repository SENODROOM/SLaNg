# directionalDerivative

Compute the directional derivative of a function in the direction of a vector.

## The Formula

D_v f = ∇f · v

## The Code

```js
/**
 * Directional derivative of f in direction of vector v
 * D_v f = ∇f · v
 */
function directionalDerivative(func, variables, point, direction) {
    const grad = gradient(func, variables);

    // Evaluate gradient at point
    const gradAtPoint = {};
    for (let variable of variables) {
        gradAtPoint[variable] = evaluateEquation([[grad.gradient[variable]]], point);
    }

    // Dot product with direction vector
    let dotProduct = 0;
    for (let variable of variables) {
        dotProduct += gradAtPoint[variable] * direction[variable];
    }

    return {
        directionalDerivative: dotProduct,
        gradientAtPoint: gradAtPoint,
        direction,
        point,
        note: 'D_v f = ∇f · v'
    };
}
```

## Line-by-Line Explanation

```js
function directionalDerivative(func, variables, point, direction) {
```
- **`func`** — The function to analyze (fraction object)
- **`variables`** — Array of variable names (e.g., ['x', 'y'])
- **`point`** — Point at which to compute derivative (e.g., {x: 2, y: 3})
- **`direction`** — Direction vector (e.g., {x: 1, y: 0})

```js
    const grad = gradient(func, variables);
```
- Compute the gradient ∇f
- Returns symbolic partial derivatives

```js
    const gradAtPoint = {};
    for (let variable of variables) {
        gradAtPoint[variable] = evaluateEquation([[grad.gradient[variable]]], point);
    }
```
- Evaluate each component of ∇f at the given point
- Convert from symbolic to numeric gradient vector
- Example: ∇f = (2x, 3y) at (1, 2) → (2, 6)

```js
    let dotProduct = 0;
    for (let variable of variables) {
        dotProduct += gradAtPoint[variable] * direction[variable];
    }
```
- Compute dot product: ∇f · v
- Multiply corresponding components and sum
- Example: (2, 6) · (1, 0) = 2×1 + 6×0 = 2

```js
    return {
        directionalDerivative: dotProduct,
        gradientAtPoint: gradAtPoint,
        direction,
        point,
        note: 'D_v f = ∇f · v'
    };
```
- Return comprehensive result object
- Includes the derivative value and all inputs for reference

## How It Works

The function computes directional derivative by:

1. **Compute Gradient**: Get ∇f symbolically
2. **Evaluate at Point**: Convert ∇f to numbers at specific point
3. **Dot Product**: Multiply ∇f · v component-wise
4. **Return Result**: Single number indicating rate of change

**Geometric Intuition**: The directional derivative tells you how fast f is changing as you move in direction v from the point.

## Usage Examples

### 2D Function - Horizontal Direction

```js
// f(x,y) = x² + y² at point (3, 4) in direction (1, 0)
// ∇f = (2x, 2y) = (6, 8) at (3, 4)
// D_v f = (6, 8) · (1, 0) = 6

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const result = directionalDerivative(
    func,
    ['x', 'y'],
    { x: 3, y: 4 },
    { x: 1, y: 0 }
);

console.log(result.directionalDerivative); // 6
```

### 2D Function - Vertical Direction

```js
// Same function, same point, but direction (0, 1)
// D_v f = (6, 8) · (0, 1) = 8

const result = directionalDerivative(
    func,
    ['x', 'y'],
    { x: 3, y: 4 },
    { x: 0, y: 1 }
);

console.log(result.directionalDerivative); // 8
```

### 2D Function - Diagonal Direction

```js
// Direction (1, 1) - moving at 45 degrees
// Should normalize: v = (1/√2, 1/√2)
// D_v f = (6, 8) · (1/√2, 1/√2) = 14/√2 ≈ 9.899

const norm = Math.sqrt(2);
const result = directionalDerivative(
    func,
    ['x', 'y'],
    { x: 3, y: 4 },
    { x: 1/norm, y: 1/norm }
);

console.log(result.directionalDerivative); // ≈ 9.899
```

### 3D Function

```js
// f(x,y,z) = x² + y² + z²
// At point (1, 1, 1), direction (1, 0, 0)

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 }),
    createTerm(1, { z: 2 })
], 1);

const result = directionalDerivative(
    func,
    ['x', 'y', 'z'],
    { x: 1, y: 1, z: 1 },
    { x: 1, y: 0, z: 0 }
);

console.log(result);
// {
//   directionalDerivative: 2,
//   gradientAtPoint: { x: 2, y: 2, z: 2 },
//   direction: { x: 1, y: 0, z: 0 },
//   point: { x: 1, y: 1, z: 1 },
//   note: 'D_v f = ∇f · v'
// }
```

### Maximum Rate of Change

```js
// Direction of gradient gives maximum rate
// Magnitude of gradient is the maximum rate

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const point = { x: 3, y: 4 };

// Compute gradient at point
const grad = gradient(func, ['x', 'y']);
const gradX = evaluateEquation([[grad.gradient.x]], point); // 6
const gradY = evaluateEquation([[grad.gradient.y]], point); // 8

// Normalize gradient to get unit direction
const magnitude = Math.sqrt(gradX * gradX + gradY * gradY); // 10

const result = directionalDerivative(
    func,
    ['x', 'y'],
    point,
    { x: gradX/magnitude, y: gradY/magnitude }
);

console.log(result.directionalDerivative); // 10 (maximum rate)
```

### Zero Directional Derivative

```js
// Perpendicular to gradient gives zero derivative
// For ∇f = (6, 8), perpendicular is (-8, 6) or (8, -6)

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const norm = Math.sqrt(64 + 36); // 10

const result = directionalDerivative(
    func,
    ['x', 'y'],
    { x: 3, y: 4 },
    { x: -8/norm, y: 6/norm }
);

console.log(result.directionalDerivative); // ≈ 0
// Moving along level curve (no change in f)
```

## Step-by-Step Example

Let's compute D_v f for f(x,y) = 2x² + 3y at point (1, 2) in direction (3, 4):

```js
const func = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { y: 1 })
], 1);

const result = directionalDerivative(
    func,
    ['x', 'y'],
    { x: 1, y: 2 },
    { x: 3, y: 4 }
);
```

**Step by step:**

1. **Compute gradient**:
   - ∂f/∂x = 4x
   - ∂f/∂y = 3
   - ∇f = (4x, 3)

2. **Evaluate at point (1, 2)**:
   - ∂f/∂x at (1, 2) = 4(1) = 4
   - ∂f/∂y at (1, 2) = 3
   - ∇f|(1,2) = (4, 3)

3. **Dot product with direction (3, 4)**:
   - D_v f = (4, 3) · (3, 4)
   - = 4×3 + 3×4
   - = 12 + 12
   - = 24

**Result**: directionalDerivative = 24

## Mathematical Background

### Definition

The directional derivative of f at point P in direction v is:

D_v f(P) = lim(h→0) [f(P + hv) - f(P)] / h

### Relationship to Gradient

For differentiable functions:

D_v f = ∇f · v = ||∇f|| ||v|| cos(θ)

Where θ is angle between ∇f and v.

### Properties

1. **Maximum**: D_v f is maximum when v is parallel to ∇f
   - Max value = ||∇f||

2. **Minimum**: D_v f is minimum when v is opposite to ∇f
   - Min value = -||∇f||

3. **Zero**: D_v f = 0 when v ⊥ ∇f
   - Moving along level curve

4. **Linearity**: D_{av+bw} f = a D_v f + b D_w f

### Unit Direction Vectors

For meaningful comparison, v should be a unit vector (||v|| = 1):

v_unit = v / ||v||

Then |D_v f| ≤ ||∇f|| with equality when v || ∇f.

## Dependencies

This function requires:
- **`gradient`** — To compute ∇f
- **`evaluateEquation`** — To evaluate gradient components at point

## Why Use This?

This function is useful for:

- **Rate of Change Analysis**: How fast is f changing in a specific direction?
- **Optimization**: Finding directions of increase/decrease
- **Constraint Navigation**: Moving along specific paths
- **Physics**: Analyzing fields and potentials
- **Engineering**: Directional sensitivity analysis

## Real-World Applications

### Hiking: Steepest Ascent

```js
// Elevation function h(x,y)
// Which direction from current position is steepest?

const elevation = createFraction([
    createTerm(0.02, { x: 2 }),
    createTerm(0.01, { y: 2 }),
    createTerm(-0.1, { x: 1, y: 1 })
], 1);

const currentPos = { x: 100, y: 150 };

// Try different directions
const directions = [
    { name: 'North', x: 0, y: 1 },
    { name: 'East', x: 1, y: 0 },
    { name: 'Northeast', x: 1/Math.sqrt(2), y: 1/Math.sqrt(2) }
];

directions.forEach(dir => {
    const result = directionalDerivative(
        elevation,
        ['x', 'y'],
        currentPos,
        { x: dir.x, y: dir.y }
    );
    
    console.log(`${dir.name}: ${result.directionalDerivative.toFixed(3)} m/m`);
});
```

### Heat Transfer: Temperature Gradient

```js
// Temperature field T(x,y)
// Rate of temperature change in direction of material flow

const temperature = createFraction([
    createTerm(100),
    createTerm(-0.5, { x: 2 }),
    createTerm(-0.5, { y: 2 })
], 1);

const location = { x: 5, y: 5 };
const flowDirection = { x: 0.6, y: 0.8 }; // Unit vector

const result = directionalDerivative(
    temperature,
    ['x', 'y'],
    location,
    flowDirection
);

console.log('Temperature change rate:', result.directionalDerivative, '°C/m');
```

### Economics: Marginal Analysis

```js
// Profit function P(L, K) where L=labor, K=capital
// How does profit change with specific resource allocation?

const profit = createFraction([
    createTerm(10, { L: 1 }),
    createTerm(15, { K: 1 }),
    createTerm(-0.1, { L: 2 }),
    createTerm(-0.2, { K: 2 })
], 1);

const current = { L: 20, K: 30 };
const strategy = { L: 0.8, K: 0.6 }; // Normalized direction

const result = directionalDerivative(
    profit,
    ['L', 'K'],
    current,
    strategy
);

console.log('Profit rate of change:', result.directionalDerivative);
```

### Flight Path: Altitude Change

```js
// Terrain elevation function
// Aircraft flying at heading

const terrain = createFraction([
    createTerm(500),
    createTerm(0.1, { x: 2 }),
    createTerm(0.2, { y: 2 })
], 1);

const position = { x: 1000, y: 2000 };
const heading = { x: Math.cos(Math.PI/4), y: Math.sin(Math.PI/4) }; // 45°

const result = directionalDerivative(
    terrain,
    ['x', 'y'],
    position,
    heading
);

console.log('Rate of altitude change:', result.directionalDerivative, 'm/m');
```

## Finding All Directional Derivatives

```js
// Sample directional derivatives in all directions

function sampleDirectionalDerivatives(func, variables, point, numDirections = 8) {
    const results = [];
    
    for (let i = 0; i < numDirections; i++) {
        const angle = (2 * Math.PI * i) / numDirections;
        const direction = {
            [variables[0]]: Math.cos(angle),
            [variables[1]]: Math.sin(angle)
        };
        
        const result = directionalDerivative(func, variables, point, direction);
        
        results.push({
            angle: angle * 180 / Math.PI,
            direction,
            derivative: result.directionalDerivative
        });
    }
    
    return results;
}

// Usage
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const samples = sampleDirectionalDerivatives(func, ['x', 'y'], { x: 3, y: 4 });

samples.forEach(s => {
    console.log(`${s.angle.toFixed(0)}°: ${s.derivative.toFixed(2)}`);
});
```

## Normalizing Direction Vectors

```js
// Helper function to normalize direction vector

function normalizeDirection(direction, variables) {
    let magnitude = 0;
    for (let variable of variables) {
        magnitude += direction[variable] ** 2;
    }
    magnitude = Math.sqrt(magnitude);
    
    const normalized = {};
    for (let variable of variables) {
        normalized[variable] = direction[variable] / magnitude;
    }
    
    return normalized;
}

// Usage
const direction = { x: 3, y: 4 };
const normalized = normalizeDirection(direction, ['x', 'y']);

console.log(normalized); // { x: 0.6, y: 0.8 }

// Now use in directional derivative
const result = directionalDerivative(func, ['x', 'y'], point, normalized);
```

## Comparing Multiple Directions

```js
// Find which of several directions has maximum increase

function findBestDirection(func, variables, point, candidateDirections) {
    let best = null;
    let maxDerivative = -Infinity;
    
    candidateDirections.forEach(dir => {
        // Normalize first
        const normalized = normalizeDirection(dir, variables);
        
        const result = directionalDerivative(func, variables, point, normalized);
        
        if (result.directionalDerivative > maxDerivative) {
            maxDerivative = result.directionalDerivative;
            best = {
                direction: dir,
                derivative: result.directionalDerivative
            };
        }
    });
    
    return best;
}

// Example: Which path increases profit most?
const profit = createFraction([
    createTerm(5, { L: 1 }),
    createTerm(3, { K: 1 })
], 1);

const strategies = [
    { L: 1, K: 0 },      // Pure labor increase
    { L: 0, K: 1 },      // Pure capital increase
    { L: 1, K: 1 },      // Equal increase
    { L: 2, K: 1 }       // 2:1 labor to capital
];

const best = findBestDirection(profit, ['L', 'K'], { L: 10, K: 20 }, strategies);
console.log('Best strategy:', best);
```

## Performance Notes

- **Time complexity**: O(n) where n = number of variables
- Requires one gradient computation
- Then n evaluations and n multiplications
- Very fast for small n (<10)

## Limitations

1. **Requires Differentiability**: Function must be differentiable at point
2. **Local Information**: Only gives rate at one specific point
3. **Direction Must Be Specified**: Doesn't find optimal direction automatically
4. **No Curvature Info**: First-order only, doesn't indicate acceleration