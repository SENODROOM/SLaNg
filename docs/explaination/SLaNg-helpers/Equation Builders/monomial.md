# monomial

Create a single-term monomial expression.

## The Formula

coeff × x^px × y^py × z^pz × ...

## The Code

```js
/**
 * Create a monomial: coeff * x^px * y^py * z^pz * ...
 */
function monomial(coeff, powers = {}) {
    return [[createFraction([createTerm(coeff, powers)], 1)]];
}
```

## Line-by-Line Explanation

```js
function monomial(coeff, powers = {}) {
```
- **`coeff`** — The coefficient (numerical multiplier)
- **`powers`** — Object mapping variables to their exponents (default: {})
- Example: `coeff=5, powers={x:2, y:1}` → 5x²y

```js
    return [[createFraction([createTerm(coeff, powers)], 1)]];
```
- Create a single term with the coefficient and powers
- Wrap in fraction with denominator 1
- Wrap in product array (single fraction)
- Wrap in equation array (single product)
- Returns standard equation format

## How It Works

The function creates a monomial by:

1. **Create Term**: Single term with coefficient and variable powers
2. **Wrap in Fraction**: Denominator of 1 (whole number)
3. **Return Equation Format**: Properly structured for equation system

**Simplicity**: Most direct way to create a single-term expression

## Usage Examples

### Simple Monomial (One Variable)

```js
// 3x²
const mono = monomial(3, { x: 2 });

const result = evaluateEquation(mono, { x: 4 });
console.log(result); // 3 × 16 = 48
```

### Constant (No Variables)

```js
// Just 7
const constant = monomial(7);

const result = evaluateEquation(constant, { x: 100 });
console.log(result); // 7 (independent of any variable)
```

### Linear Term

```js
// 5x
const linear = monomial(5, { x: 1 });

const result = evaluateEquation(linear, { x: 3 });
console.log(result); // 15
```

### Multiple Variables

```js
// 2x³y²z
const multi = monomial(2, { x: 3, y: 2, z: 1 });

const result = evaluateEquation(multi, { x: 2, y: 3, z: 4 });
console.log(result); // 2 × 8 × 9 × 4 = 576
```

### Negative Coefficient

```js
// -4x²
const negative = monomial(-4, { x: 2 });

const result = evaluateEquation(negative, { x: 3 });
console.log(result); // -4 × 9 = -36
```

### Fractional Coefficient

```js
// 0.5x³
const fractional = monomial(0.5, { x: 3 });

const result = evaluateEquation(fractional, { x: 2 });
console.log(result); // 0.5 × 8 = 4
```

### High Powers

```js
// x⁵
const power5 = monomial(1, { x: 5 });

const result = evaluateEquation(power5, { x: 2 });
console.log(result); // 32
```

### Mixed Variables

```js
// 6ab²c³
const mixed = monomial(6, { a: 1, b: 2, c: 3 });

const result = evaluateEquation(mixed, { a: 2, b: 3, c: 1 });
console.log(result); // 6 × 2 × 9 × 1 = 108
```

## Step-by-Step Example

Let's create 4x²y³:

```js
const mono = monomial(4, { x: 2, y: 3 });
```

**Step by step:**

1. **Create term**:
   - coefficient: 4
   - variables: {x: 2, y: 3}
   - term: {coeff: 4, var: {x: 2, y: 3}}

2. **Create fraction**:
   - numerator: [term]
   - denominator: 1
   - fraction: {numi: {terms: [...]}, deno: 1}

3. **Wrap in arrays**:
   - Product: [fraction]
   - Equation: [[fraction]]

**Evaluate at x=2, y=3**:
- 4 × 2² × 3³ = 4 × 4 × 27 = 432

## Mathematical Background

### Monomial Definition

A monomial is an algebraic expression consisting of:
- One term only
- Product of a coefficient and variables with non-negative integer exponents

**General form**: c × x₁^n₁ × x₂^n₂ × ... × xₖ^nₖ

Where:
- c is the coefficient
- xᵢ are variables
- nᵢ are non-negative integer exponents

### Degree of a Monomial

The degree is the sum of all exponents:

- `5x²y³` → degree = 2 + 3 = 5
- `7x⁴` → degree = 4
- `3xy` → degree = 1 + 1 = 2
- `8` → degree = 0

### Like Terms

Monomials are "like terms" if they have the same variable parts:
- `3x²y` and `5x²y` are like (differ only in coefficient)
- `3x²y` and `3xy²` are NOT like (different powers)

## Dependencies

This function requires:
- **`createTerm`** — To create the term object
- **`createFraction`** — To wrap term in fraction

## Why Use This?

This function is useful for:

- **Single Term Creation**: Quick way to make one-term expressions
- **Building Blocks**: Combine multiple monomials into polynomials
- **Area/Volume Formulas**: Many geometric formulas are monomials
- **Physical Laws**: Power laws, proportionalities
- **Testing**: Creating simple test cases

## Real-World Applications

### Physics: Kinetic Energy

```js
// KE = (1/2)mv²
const kineticEnergy = monomial(0.5, { m: 1, v: 2 });

const KE = evaluateEquation(kineticEnergy, { m: 5, v: 10 });
console.log('Kinetic Energy:', KE, 'J'); // 0.5 × 5 × 100 = 250 J
```

### Geometry: Circle Area

```js
// A = πr²
const circleArea = monomial(Math.PI, { r: 2 });

const area = evaluateEquation(circleArea, { r: 5 });
console.log('Area:', area, 'units²'); // π × 25 ≈ 78.54
```

### Geometry: Sphere Volume

```js
// V = (4/3)πr³
const sphereVolume = monomial(4 * Math.PI / 3, { r: 3 });

const volume = evaluateEquation(sphereVolume, { r: 3 });
console.log('Volume:', volume, 'units³'); // (4π/3) × 27 ≈ 113.1
```

### Physics: Gravitational Force

```js
// F = Gm₁m₂/r² (without division, just Gm₁m₂)
const gravForce = monomial(6.674e-11, { m1: 1, m2: 1 });

// Would need to divide by r² separately
```

### Chemistry: Ideal Gas Law Term

```js
// PV = nRT → P = nRT/V
// Just the nRT part
const numerator = monomial(8.314, { n: 1, T: 1 });

const result = evaluateEquation(numerator, { n: 2, T: 300 });
console.log('nRT:', result); // 8.314 × 2 × 300 = 4988.4
```

### Economics: Revenue

```js
// Revenue R = p × q (price × quantity)
const revenue = monomial(1, { p: 1, q: 1 });

const R = evaluateEquation(revenue, { p: 25, q: 100 });
console.log('Revenue: $', R); // 2500
```

## Combining Monomials

### Addition (Create Sum)

```js
// 3x² + 5x² = 8x²
const term1 = monomial(3, { x: 2 });
const term2 = monomial(5, { x: 2 });

// Would need to use sum() function or manual combination
```

### Multiplication

```js
// 2x² × 3x³ = 6x⁵
const factor1 = monomial(2, { x: 2 });
const factor2 = monomial(3, { x: 3 });

// Multiply as products
const product = [factor1[0], factor2[0]];
const expanded = expandProduct(product);
// Result: 6x⁵
```

### Powers

```js
// (2x)³ = 8x³
const base = monomial(2, { x: 1 });

// Cube it: 2³ × x³
const cubed = monomial(Math.pow(2, 3), { x: 3 });

const result = evaluateEquation(cubed, { x: 5 });
console.log(result); // 8 × 125 = 1000
```

## Special Cases

### Unit Monomial

```js
// 1 × x¹ = x
const x = monomial(1, { x: 1 });

// 1 × y¹ = y
const y = monomial(1, { y: 1 });
```

### Zero Monomial

```js
// 0x² = 0
const zero = monomial(0, { x: 2 });

const result = evaluateEquation(zero, { x: 1000 });
console.log(result); // 0
```

### Zero Power (Any Variable)

```js
// 5x⁰ = 5
const zeropower = monomial(5, { x: 0 });

const result = evaluateEquation(zeropower, { x: 999 });
console.log(result); // 5 (x⁰ = 1)
```

## Differentiation and Integration

```js
// Original: 6x³
const original = monomial(6, { x: 3 });

// Differentiate: d/dx(6x³) = 18x²
const derivative = differentiateFraction(original[0][0], 'x');
console.log(derivative); // 18x²

// Integrate: ∫6x³dx = (6/4)x⁴ = 1.5x⁴
const integral = integrateFraction(original[0][0], 'x');
console.log(integral); // 1.5x⁴
```

## Comparison with Other Builders

### monomial vs polynomial

```js
// monomial: Single term
const mono = monomial(3, { x: 2 }); // 3x²

// polynomial: Multiple terms
const poly = polynomial([3, 0, 0], 'x'); // 3x² + 0x + 0 = 3x²

// Same result, but polynomial adds zeros, monomial is cleaner
```

### monomial vs sum

```js
// monomial: One term
const mono = monomial(5, { x: 1 });

// sum: Can have multiple terms
const sumExpr = sum([[5, { x: 1 }]]); // Also 5x, but sum allows more

// For single terms, monomial is simpler
```

## Building Complex Expressions

```js
// Build x³ + 2x²y + xy² + y³ from monomials

const term1 = monomial(1, { x: 3 });
const term2 = monomial(2, { x: 2, y: 1 });
const term3 = monomial(1, { x: 1, y: 2 });
const term4 = monomial(1, { y: 3 });

// Would combine using sum() or manual term array
const polynomial = sum([
    [1, { x: 3 }],
    [2, { x: 2, y: 1 }],
    [1, { x: 1, y: 2 }],
    [1, { y: 3 }]
]);
```

## Performance Notes

- **Time complexity**: O(1) — constant time
- Extremely fast
- Just creates one term object
- Most lightweight builder function

## Limitations

1. **Single Term Only**: Cannot create polynomials directly
2. **No Operations**: Doesn't perform arithmetic
3. **Integer Exponents**: Powers should be non-negative integers for standard monomials
4. **No Division**: Represents numerator only, denominator is always 1

## Tips

### Use for Simplest Expressions

```js
// For single terms, monomial is cleanest
const simple = monomial(7, { x: 2 });

// Don't use polynomial if you only need one term
// polynomial([7, 0, 0]) is more complex than needed
```

### Named Constants

```js
// Create reusable monomial constants
const X = monomial(1, { x: 1 });
const X_SQUARED = monomial(1, { x: 2 });
const Y = monomial(1, { y: 1 });

// Use in formulas
```

### Physics Formulas

```js
// Many physics formulas are monomials
const GRAVITY = monomial(9.8, { t: 2 }); // -9.8t²/2 (use -4.9)
const DISTANCE = monomial(1, { v: 1, t: 1 }); // vt
const WORK = monomial(1, { F: 1, d: 1 }); // Fd
```