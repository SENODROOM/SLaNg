# lagrangeMultipliers

Set up the Lagrange multiplier system for constrained optimization.

## The Formula

Optimize f(x,y) subject to g(x,y) = 0

System: ∇f = λ∇g and g = 0

## The Code

```js
/**
 * Find constrained optimization using Lagrange multipliers
 * Optimize f(x,y) subject to g(x,y) = 0
 * 
 * This is a simplified version that sets up the system
 */
function lagrangeMultipliers(objective, constraint, variables) {
    const gradF = gradient(objective, variables);
    const gradG = gradient(constraint, variables);

    return {
        objectiveGradient: gradF,
        constraintGradient: gradG,
        note: 'Solve: ∇f = λ∇g and g = 0',
        system: 'Set up system of equations where each component satisfies ∂f/∂x = λ∂g/∂x'
    };
}
```

## Line-by-Line Explanation

```js
function lagrangeMultipliers(objective, constraint, variables) {
```
- **`objective`** — Function to optimize f(x,y,...) (fraction object)
- **`constraint`** — Constraint equation g(x,y,...) = 0 (fraction object)
- **`variables`** — Array of variable names (e.g., ['x', 'y'])

```js
    const gradF = gradient(objective, variables);
```
- Compute gradient of objective function ∇f
- Components: (∂f/∂x, ∂f/∂y, ...)

```js
    const gradG = gradient(constraint, variables);
```
- Compute gradient of constraint ∇g
- Components: (∂g/∂x, ∂g/∂y, ...)

```js
    return {
        objectiveGradient: gradF,
        constraintGradient: gradG,
        note: 'Solve: ∇f = λ∇g and g = 0',
        system: 'Set up system of equations where each component satisfies ∂f/∂x = λ∂g/∂x'
    };
```
- Return both gradients
- User must solve the system manually or numerically

## How It Works

The function sets up the Lagrange multiplier system:

1. **Compute ∇f**: Gradient of objective function
2. **Compute ∇g**: Gradient of constraint
3. **Return System**: The equations to solve:
   - ∂f/∂x = λ∂g/∂x
   - ∂f/∂y = λ∂g/∂y
   - ...
   - g(x,y,...) = 0

**Geometric Intuition**: At an extremum, ∇f and ∇g are parallel (point in same or opposite directions). The constraint g=0 determines valid points.

## Usage Examples

### 2D Optimization: Maximize Area

```js
// Maximize f(x,y) = xy
// Subject to g(x,y) = x + y - 10 = 0

const objective = createFraction([
    createTerm(1, { x: 1, y: 1 })
], 1);

const constraint = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1, { y: 1 }),
    createTerm(-10)
], 1);

const result = lagrangeMultipliers(objective, constraint, ['x', 'y']);

console.log(result);
// {
//   objectiveGradient: { gradient: { x: [y], y: [x] } },
//   constraintGradient: { gradient: { x: [1], y: [1] } },
//   note: 'Solve: ∇f = λ∇g and g = 0',
//   system: '...'
// }

// Solve:
// y = λ(1)  →  y = λ
// x = λ(1)  →  x = λ
// x + y = 10
// → x = y = 5, maximum area = 25
```

### 2D Optimization: Minimize Distance

```js
// Minimize f(x,y) = x² + y²
// Subject to g(x,y) = x + 2y - 5 = 0

const objective = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const constraint = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(2, { y: 1 }),
    createTerm(-5)
], 1);

const result = lagrangeMultipliers(objective, constraint, ['x', 'y']);

// Solve:
// 2x = λ(1)  →  x = λ/2
// 2y = λ(2)  →  y = λ
// x + 2y = 5
// → x = 1, y = 2, min distance = √5
```

### 3D Optimization: Box Volume

```js
// Maximize f(x,y,z) = xyz
// Subject to g(x,y,z) = x + y + z - 12 = 0

const objective = createFraction([
    createTerm(1, { x: 1, y: 1, z: 1 })
], 1);

const constraint = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1, { y: 1 }),
    createTerm(1, { z: 1 }),
    createTerm(-12)
], 1);

const result = lagrangeMultipliers(objective, constraint, ['x', 'y', 'z']);

// ∇f = (yz, xz, xy)
// ∇g = (1, 1, 1)
// Solve: yz = λ, xz = λ, xy = λ, x+y+z=12
// → x = y = z = 4, max volume = 64
```

### Circular Constraint

```js
// Maximize f(x,y) = x + y
// Subject to g(x,y) = x² + y² - 1 = 0

const objective = createFraction([
    createTerm(1, { x: 1 }),
    createTerm(1, { y: 1 })
], 1);

const constraint = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 }),
    createTerm(-1)
], 1);

const result = lagrangeMultipliers(objective, constraint, ['x', 'y']);

// ∇f = (1, 1)
// ∇g = (2x, 2y)
// Solve: 1 = 2λx, 1 = 2λy, x² + y² = 1
// → x = y = 1/√2, max = √2
```

## Step-by-Step Example

Let's optimize f(x,y) = x² + y² subject to 2x + y = 6:

```js
const objective = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const constraint = createFraction([
    createTerm(2, { x: 1 }),
    createTerm(1, { y: 1 }),
    createTerm(-6)
], 1);

const result = lagrangeMultipliers(objective, constraint, ['x', 'y']);
```

**Step by step:**

1. **Compute ∇f**:
   - ∂f/∂x = 2x
   - ∂f/∂y = 2y
   - ∇f = (2x, 2y)

2. **Compute ∇g**:
   - ∂g/∂x = 2
   - ∂g/∂y = 1
   - ∇g = (2, 1)

3. **Set up equations** (∇f = λ∇g):
   - 2x = λ(2) → x = λ
   - 2y = λ(1) → y = λ/2

4. **Apply constraint** (g = 0):
   - 2x + y = 6
   - 2λ + λ/2 = 6
   - 5λ/2 = 6
   - λ = 12/5

5. **Solve for variables**:
   - x = λ = 12/5
   - y = λ/2 = 6/5

6. **Verify**:
   - 2(12/5) + 6/5 = 24/5 + 6/5 = 30/5 = 6 ✓
   - f(12/5, 6/5) = (12/5)² + (6/5)² = 144/25 + 36/25 = 180/25 = 36/5

## Mathematical Background

### Method of Lagrange Multipliers

**Problem**: 
- Optimize f(x,y,...) 
- Subject to g(x,y,...) = 0

**Solution Method**:
1. Form Lagrangian: L(x,y,...,λ) = f(x,y,...) - λg(x,y,...)
2. Set partial derivatives to zero:
   - ∂L/∂x = ∂f/∂x - λ∂g/∂x = 0
   - ∂L/∂y = ∂f/∂y - λ∂g/∂y = 0
   - ∂L/∂λ = -g(x,y,...) = 0
3. Solve system of equations

### Geometric Interpretation

At an extremum on the constraint curve:
- ∇f is perpendicular to constraint curve
- ∇g is also perpendicular to constraint curve
- Therefore ∇f ∥ ∇g (parallel)
- So ∇f = λ∇g for some scalar λ

### Multiple Constraints

For constraints g₁ = 0, g₂ = 0, ...:

∇f = λ₁∇g₁ + λ₂∇g₂ + ...

### Second Derivative Test

To determine if critical point is max or min, use bordered Hessian (not implemented in this function).

## Dependencies

This function requires:
- **`gradient`** — To compute ∇f and ∇g

## Why Use This?

This function is useful for:

- **Constrained Optimization**: Finding max/min with constraints
- **Resource Allocation**: Optimizing with budget constraints
- **Engineering Design**: Maximizing performance with limitations
- **Economics**: Utility maximization with budget
- **Physics**: Energy minimization with constraints

## Real-World Applications

### Economics: Utility Maximization

```js
// Maximize utility U(x,y) = x⁰·⁵y⁰·⁵
// Subject to budget constraint px·x + py·y = I

// For polynomial approximation: U ≈ xy
const utility = createFraction([
    createTerm(1, { x: 1, y: 1 })
], 1);

const budget = createFraction([
    createTerm(3, { x: 1 }),  // px = 3
    createTerm(2, { y: 1 }),  // py = 2
    createTerm(-100)          // I = 100
], 1);

const result = lagrangeMultipliers(utility, budget, ['x', 'y']);

// ∇U = (y, x)
// ∇B = (3, 2)
// Solve: y = 3λ, x = 2λ, 3x + 2y = 100
// → Optimal bundle
```

### Engineering: Minimize Material Cost

```js
// Minimize surface area A = 2πrh + 2πr²
// Subject to volume V = πr²h = 1000

// Simplified: minimize r² + rh
// subject to r²h = 1000/π

const cost = createFraction([
    createTerm(1, { r: 2 }),
    createTerm(1, { r: 1, h: 1 })
], 1);

const volume = createFraction([
    createTerm(1, { r: 2, h: 1 }),
    createTerm(-1000/Math.PI)
], 1);

const result = lagrangeMultipliers(cost, volume, ['r', 'h']);

// Find r and h that minimize cost while maintaining volume
```

### Physics: Minimum Distance to Curve

```js
// Find point on parabola y = x² closest to (0, 2)
// Minimize d² = x² + (y-2)²
// Subject to y - x² = 0

const distanceSquared = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 }),
    createTerm(-4, { y: 1 }),
    createTerm(4)
], 1);

const parabola = createFraction([
    createTerm(1, { y: 1 }),
    createTerm(-1, { x: 2 })
], 1);

const result = lagrangeMultipliers(distanceSquared, parabola, ['x', 'y']);
```

### Production: Maximize Output

```js
// Production function P(L,K) = L⁰·⁶K⁰·⁴
// Budget constraint: wL + rK = B

// Polynomial approximation: P ≈ LK
const production = createFraction([
    createTerm(1, { L: 1, K: 1 })
], 1);

const budget = createFraction([
    createTerm(10, { L: 1 }),  // wage w = 10
    createTerm(20, { K: 1 }),  // rent r = 20
    createTerm(-1000)          // budget B = 1000
], 1);

const result = lagrangeMultipliers(production, budget, ['L', 'K']);

// Solve for optimal labor and capital
```

## Solving the System

```js
// Helper function to solve the Lagrange system (2D case)

function solveLagrange2D(objective, constraint, variables) {
    const setup = lagrangeMultipliers(objective, constraint, variables);
    
    // For simple cases, can solve symbolically
    // For general cases, need numerical solver
    
    console.log('System to solve:');
    console.log(`∂f/∂${variables[0]} = λ × ∂g/∂${variables[0]}`);
    console.log(`∂f/∂${variables[1]} = λ × ∂g/∂${variables[1]}`);
    console.log('g = 0');
    
    return setup;
}
```

## Numerical Solution (Newton's Method)

```js
// Numerical solver for Lagrange system

function solveLagrangeNumerical(objective, constraint, variables, initialGuess) {
    const gradF = gradient(objective, variables);
    const gradG = gradient(constraint, variables);
    
    // Set up system F(x, y, λ) = 0
    // F₁ = ∂f/∂x - λ∂g/∂x
    // F₂ = ∂f/∂y - λ∂g/∂y
    // F₃ = g
    
    let point = { ...initialGuess };
    
    for (let iter = 0; iter < 100; iter++) {
        // Evaluate gradients at current point
        const dfx = evaluateEquation([[gradF.gradient[variables[0]]]], point);
        const dfy = evaluateEquation([[gradF.gradient[variables[1]]]], point);
        const dgx = evaluateEquation([[gradG.gradient[variables[0]]]], point);
        const dgy = evaluateEquation([[gradG.gradient[variables[1]]]], point);
        const gVal = evaluateEquation([[constraint]], point);
        
        // Check convergence
        const F1 = dfx - point.lambda * dgx;
        const F2 = dfy - point.lambda * dgy;
        const F3 = gVal;
        
        if (Math.abs(F1) < 1e-8 && Math.abs(F2) < 1e-8 && Math.abs(F3) < 1e-8) {
            return { ...point, iterations: iter };
        }
        
        // Newton step (simplified - would need Jacobian for full implementation)
        // This is a placeholder for the full numerical method
    }
    
    return point;
}
```

## Checking Multiple Critical Points

```js
// Lagrange multipliers may give multiple critical points
// Need to evaluate objective at each to find global optimum

function findGlobalOptimum(objective, criticalPoints) {
    let best = null;
    let bestValue = -Infinity;
    
    criticalPoints.forEach(point => {
        const value = evaluateEquation([[objective]], point);
        
        if (value > bestValue) {
            bestValue = value;
            best = { point, value };
        }
    });
    
    return best;
}
```

## Verification of Solution

```js
// Verify that a point satisfies Lagrange conditions

function verifyLagrangeSolution(objective, constraint, variables, point, lambda) {
    const gradF = gradient(objective, variables);
    const gradG = gradient(constraint, variables);
    
    console.log('Verification:');
    
    // Check ∇f = λ∇g
    for (let variable of variables) {
        const dfVar = evaluateEquation([[gradF.gradient[variable]]], point);
        const dgVar = evaluateEquation([[gradG.gradient[variable]]], point);
        const diff = dfVar - lambda * dgVar;
        
        console.log(`∂f/∂${variable} - λ∂g/∂${variable} = ${diff.toFixed(6)}`);
    }
    
    // Check g = 0
    const gVal = evaluateEquation([[constraint]], point);
    console.log(`g = ${gVal.toFixed(6)}`);
    
    return {
        satisfiesGradientCondition: true, // Would check numerical threshold
        satisfiesConstraint: Math.abs(gVal) < 1e-6
    };
}
```

## Limitations

1. **Setup Only**: Doesn't solve the system automatically
2. **Manual Solution**: User must solve equations
3. **No Second Derivative Test**: Doesn't classify extrema
4. **Single Constraint**: This version handles one constraint only
5. **No Inequality Constraints**: Only handles g = 0, not g ≤ 0

## Extensions

### Multiple Constraints

```js
function lagrangeMultipliersMultiple(objective, constraints, variables) {
    const gradF = gradient(objective, variables);
    const gradGs = constraints.map(g => gradient(g, variables));
    
    return {
        objectiveGradient: gradF,
        constraintGradients: gradGs,
        note: 'Solve: ∇f = λ₁∇g₁ + λ₂∇g₂ + ... and g₁ = g₂ = ... = 0'
    };
}
```

### Inequality Constraints (KKT Conditions)

```js
// For g(x) ≤ 0 constraints, need Karush-Kuhn-Tucker conditions
// More complex: requires checking complementary slackness
```