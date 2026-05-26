# gradient

Compute the gradient vector of a multivariable function.

## The Formula

∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z, ...)

## The Code

```js
/**
 * Compute gradient ∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z, ...)
 */
function gradient(func, variables) {
    const grad = {};

    for (let variable of variables) {
        grad[variable] = differentiateFraction(func, variable);
    }

    return {
        gradient: grad,
        note: 'Gradient vector ∇f with components for each variable'
    };
}
```

## Line-by-Line Explanation

```js
function gradient(func, variables) {
```
- **`func`** — The multivariable function (fraction object)
- **`variables`** — Array of variable names (e.g., ['x', 'y', 'z'])

```js
    const grad = {};
```
- Initialize empty object to store gradient components
- Each key will be a variable name, value will be its partial derivative

```js
    for (let variable of variables) {
```
- Loop through each variable
- Compute partial derivative with respect to each

```js
        grad[variable] = differentiateFraction(func, variable);
```
- Compute ∂f/∂(variable)
- Store as a component of the gradient vector
- Example: `grad['x']` = ∂f/∂x

```js
    return {
        gradient: grad,
        note: 'Gradient vector ∇f with components for each variable'
    };
```
- Return object containing the gradient components

## How It Works

The function computes the gradient by:

1. **Loop Through Variables**: Process each variable one at a time
2. **Partial Differentiation**: Differentiate with respect to each variable
   - Treat other variables as constants
3. **Store Components**: Build gradient vector component by component
4. **Return Vector**: As object with named components

**Geometric Intuition**: The gradient points in the direction of steepest ascent and its magnitude indicates the rate of increase.

## Usage Examples

### Two Variables (2D)

```js
// f(x,y) = x² + y²
// ∇f = (2x, 2y)

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const result = gradient(func, ['x', 'y']);

console.log(result);
// {
//   gradient: {
//     x: { /* 2x */ },
//     y: { /* 2y */ }
//   },
//   note: 'Gradient vector ∇f with components for each variable'
// }
```

### Three Variables (3D)

```js
// f(x,y,z) = x² + 2xy + z²
// ∇f = (2x + 2y, 2x, 2z)

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(2, { x: 1, y: 1 }),
    createTerm(1, { z: 2 })
], 1);

const result = gradient(func, ['x', 'y', 'z']);

console.log(result.gradient);
// {
//   x: { /* 2x + 2y */ },
//   y: { /* 2x */ },
//   z: { /* 2z */ }
// }
```

### Linear Function

```js
// f(x,y) = 3x + 4y + 5
// ∇f = (3, 4)

const func = createFraction([
    createTerm(3, { x: 1 }),
    createTerm(4, { y: 1 }),
    createTerm(5)
], 1);

const result = gradient(func, ['x', 'y']);
// Gradient is constant: (3, 4)
```

### Mixed Partial Terms

```js
// f(x,y) = xy² + x²y
// ∇f = (y² + 2xy, 2xy + x²)

const func = createFraction([
    createTerm(1, { x: 1, y: 2 }),
    createTerm(1, { x: 2, y: 1 })
], 1);

const result = gradient(func, ['x', 'y']);
```

### Higher Degree

```js
// f(x,y) = x³ + y³ - 3xy
// ∇f = (3x² - 3y, 3y² - 3x)

const func = createFraction([
    createTerm(1, { x: 3 }),
    createTerm(1, { y: 3 }),
    createTerm(-3, { x: 1, y: 1 })
], 1);

const result = gradient(func, ['x', 'y']);
```

## Step-by-Step Example

Let's compute ∇f for f(x,y) = 2x² + 3xy + y²:

```js
const func = createFraction([
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1, y: 1 }),
    createTerm(1, { y: 2 })
], 1);

const result = gradient(func, ['x', 'y']);
```

**Step by step:**

1. **Initialize**: grad = {}

2. **First variable (x)**:
   - Differentiate f with respect to x
   - ∂f/∂x = ∂(2x²)/∂x + ∂(3xy)/∂x + ∂(y²)/∂x
   - = 4x + 3y + 0
   - grad.x = 4x + 3y

3. **Second variable (y)**:
   - Differentiate f with respect to y
   - ∂f/∂y = ∂(2x²)/∂y + ∂(3xy)/∂y + ∂(y²)/∂y
   - = 0 + 3x + 2y
   - grad.y = 3x + 2y

4. **Return**:
   ```js
   {
     gradient: {
       x: { /* 4x + 3y */ },
       y: { /* 3x + 2y */ }
     },
     note: '...'
   }
   ```

**Mathematical verification**: ∇(2x² + 3xy + y²) = (4x + 3y, 3x + 2y) ✓

## Evaluating the Gradient at a Point

```js
// Compute gradient and evaluate at a specific point

function gradientAtPoint(func, variables, point) {
    const grad = gradient(func, variables);
    
    const gradientValues = {};
    for (let variable of variables) {
        gradientValues[variable] = evaluateEquation(
            [[grad.gradient[variable]]], 
            point
        );
    }
    
    return {
        point,
        gradient: gradientValues,
        magnitude: Math.sqrt(
            Object.values(gradientValues).reduce((sum, val) => sum + val * val, 0)
        )
    };
}

// Example: f(x,y) = x² + y² at point (3, 4)
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const result = gradientAtPoint(func, ['x', 'y'], { x: 3, y: 4 });

console.log(result);
// {
//   point: { x: 3, y: 4 },
//   gradient: { x: 6, y: 8 },
//   magnitude: 10
// }
```

## Mathematical Background

### Definition

For a scalar function f(x₁, x₂, ..., xₙ), the gradient is:

∇f = (∂f/∂x₁, ∂f/∂x₂, ..., ∂f/∂xₙ)

### Properties

1. **Direction**: Points in direction of maximum increase
2. **Magnitude**: Rate of maximum increase
3. **Perpendicular to Level Curves**: ∇f ⊥ level curves of f
4. **Linearity**: ∇(af + bg) = a∇f + b∇g

### Geometric Interpretation

- **2D**: Vector field in the plane
- **3D**: Vector field in space
- Points "uphill" at each point

### Gradient vs. Derivative

- **Single variable**: f'(x) is a number
- **Multiple variables**: ∇f is a vector

## Dependencies

This function requires:
- **`differentiateFraction`** — To compute partial derivatives

## Why Use This?

This function is useful for:

- **Optimization**: Finding maxima/minima
- **Direction of Change**: Understanding how function varies
- **Level Curves**: Finding perpendicular directions
- **Vector Calculus**: Foundation for many operations
- **Machine Learning**: Gradient descent algorithms
- **Physics**: Conservative force fields

## Real-World Applications

### Optimization: Cost Minimization

```js
// Cost function C(x,y) = x² + y² + 2xy + 10x + 15y

const cost = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 }),
    createTerm(2, { x: 1, y: 1 }),
    createTerm(10, { x: 1 }),
    createTerm(15, { y: 1 })
], 1);

const grad = gradient(cost, ['x', 'y']);

// Set ∇C = 0 to find minimum cost
// ∂C/∂x = 2x + 2y + 10 = 0
// ∂C/∂y = 2y + 2x + 15 = 0
```

### Physics: Electric Potential

```js
// Potential field V(x,y) = x² + y²
// Electric field E = -∇V

const potential = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const grad = gradient(potential, ['x', 'y']);

// E_x = -∂V/∂x = -2x
// E_y = -∂V/∂y = -2y
```

### Machine Learning: Gradient Descent

```js
// Loss function L(w₁, w₂)
// Update rule: w_new = w_old - α∇L

function gradientDescentStep(lossFunc, weights, learningRate) {
    const variables = Object.keys(weights);
    const grad = gradient(lossFunc, variables);
    
    // Evaluate gradient at current weights
    const gradValues = {};
    for (let variable of variables) {
        gradValues[variable] = evaluateEquation(
            [[grad.gradient[variable]]], 
            weights
        );
    }
    
    // Update weights
    const newWeights = {};
    for (let variable of variables) {
        newWeights[variable] = weights[variable] - learningRate * gradValues[variable];
    }
    
    return newWeights;
}

// Example
const loss = createFraction([
    createTerm(1, { w1: 2 }),
    createTerm(2, { w1: 1, w2: 1 }),
    createTerm(1, { w2: 2 })
], 1);

let weights = { w1: 5, w2: 5 };
weights = gradientDescentStep(loss, weights, 0.1);
console.log('Updated weights:', weights);
```

### Geography: Slope and Aspect

```js
// Elevation function h(x,y)

const elevation = createFraction([
    createTerm(0.01, { x: 2 }),
    createTerm(0.02, { y: 2 }),
    createTerm(-0.05, { x: 1, y: 1 })
], 1);

const grad = gradient(elevation, ['x', 'y']);

// Gradient magnitude = slope
// Gradient direction = aspect (direction of steepest ascent)
```

## Finding Critical Points

```js
// Critical points occur where ∇f = 0

function findCriticalPoints2D(func, xRange, yRange) {
    const grad = gradient(func, ['x', 'y']);
    
    // Need to solve ∂f/∂x = 0 AND ∂f/∂y = 0
    // This requires numerical methods for general case
    
    // For simple quadratics, can solve algebraically
    return {
        gradX: grad.gradient.x,
        gradY: grad.gradient.y,
        note: 'Solve grad_x = 0 and grad_y = 0 simultaneously'
    };
}
```

## Gradient Field Visualization

```js
// Generate gradient field for plotting

function generateGradientField(func, variables, xRange, yRange, gridSize = 10) {
    const grad = gradient(func, variables);
    const field = [];
    
    const xStep = (xRange[1] - xRange[0]) / gridSize;
    const yStep = (yRange[1] - yRange[0]) / gridSize;
    
    for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
            const x = xRange[0] + i * xStep;
            const y = yRange[0] + j * yStep;
            
            const gradX = evaluateEquation([[grad.gradient.x]], { x, y });
            const gradY = evaluateEquation([[grad.gradient.y]], { x, y });
            
            field.push({ x, y, gradX, gradY });
        }
    }
    
    return field;
}

// Usage
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const field = generateGradientField(func, ['x', 'y'], [-5, 5], [-5, 5]);
// Can be used to plot vector field
```

## Level Curves and Gradient

```js
// Gradient is perpendicular to level curves

function levelCurveNormal(func, variables, point) {
    const grad = gradientAtPoint(func, variables, point);
    
    // Gradient gives normal vector to level curve
    // Tangent to level curve is perpendicular
    
    if (variables.length === 2) {
        // In 2D, tangent = (-grad_y, grad_x)
        return {
            normal: grad.gradient,
            tangent: {
                [variables[0]]: -grad.gradient[variables[1]],
                [variables[1]]: grad.gradient[variables[0]]
            }
        };
    }
    
    return grad;
}
```

## Chain Rule with Gradient

```js
// If x and y are functions of t: x(t), y(t)
// Then df/dt = ∇f · (dx/dt, dy/dt)

function totalDerivative(func, variables, point, velocities) {
    const grad = gradientAtPoint(func, variables, point);
    
    let total = 0;
    for (let variable of variables) {
        total += grad.gradient[variable] * velocities[variable];
    }
    
    return {
        totalDerivative: total,
        gradient: grad.gradient,
        velocities,
        note: 'df/dt = ∇f · velocity'
    };
}

// Example: f(x,y) = x² + y², with x=cos(t), y=sin(t)
// At t=0: point=(1,0), velocity=(-sin(0), cos(0))=(0,1)

const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { y: 2 })
], 1);

const result = totalDerivative(
    func, 
    ['x', 'y'], 
    { x: 1, y: 0 }, 
    { x: 0, y: 1 }
);

console.log('df/dt =', result.totalDerivative);
// ∇f · v = (2x, 2y) · (0, 1) = 2y = 0
```

## Second-Order: Hessian Matrix

```js
// Hessian is matrix of second partial derivatives

function hessian(func, variables) {
    const grad = gradient(func, variables);
    const hess = {};
    
    for (let var1 of variables) {
        hess[var1] = {};
        for (let var2 of variables) {
            hess[var1][var2] = differentiateFraction(grad.gradient[var1], var2);
        }
    }
    
    return {
        hessian: hess,
        note: 'Matrix of second partial derivatives'
    };
}

// Example: f(x,y) = x² + xy + y²
const func = createFraction([
    createTerm(1, { x: 2 }),
    createTerm(1, { x: 1, y: 1 }),
    createTerm(1, { y: 2 })
], 1);

const H = hessian(func, ['x', 'y']);
// H = [[2, 1],
//      [1, 2]]
```

## Performance Notes

- **Time complexity**: O(n) where n = number of variables
- Each variable requires one differentiation
- Independent operations (could be parallelized)
- Very fast for small number of variables (<10)

## Limitations

1. **Symbolic Only**: Returns symbolic derivatives, not numeric values
2. **Requires Evaluation**: Must evaluate at points separately
3. **Polynomial Best**: Works best with polynomial functions
4. **No Simplification**: Doesn't automatically simplify results