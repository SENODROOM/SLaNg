# 📚 SLaNg Math Library 
### Saad's Language for Analytical Numerics and Geometry - ****

🎯 **Symbolic Mathematics with Full Rational Function Support**

A powerful, dependency-free JavaScript library for symbolic and numerical calculus with **complete polynomial denominator support**. Compute derivatives, integrals, rational functions, Taylor series, optimize functions, and solve complex multivariable problems—all with clean, readable code.

```javascript
import { createFraction, createTerm, differentiateFraction } from './slang-math.js';

//: Full polynomial denominator support!
const f = createFraction(
    [createTerm(2, {x: 1})],           // 2x
    [createTerm(1, {x: 2}), createTerm(1)]  // x² + 1
);  // f(x) = 2x/(x² + 1)

// Differentiate using quotient rule automatically
const fPrime = differentiateFraction(f, 'x');  
// f'(x) = (2(x² + 1) - 2x(2x))/(x² + 1)² = (2 - 2x²)/(x² + 1)²
```

**No dependencies. Pure JavaScript. Fully documented.**

---

## 🚀 

### ✨ Major Features

1. **📊 Full Polynomial Denominator Support**
   - Create rational functions with polynomial numerators AND denominators
   - Automatic quotient rule differentiation
   - Enhanced simplification with GCD reduction
   - Smart handling of mixed denominator types

2. **🧮 Enhanced Integration**
   - Simpson's rule for numerical integration (more accurate)
   - Better handling of complex rational functions
   - Improved definite integration with mixed bounds

3. **🎯 Advanced Calculus Operations**
   - U-substitution detection for integrals
   - Partial fraction decomposition (foundation laid)
   - Improved chain rule support
   - Better Taylor series for rational functions

4. **⚡ Performance & Accuracy**
   - GCD-based fraction simplification
   - Smarter polynomial term ordering
   - More robust numerical methods
   - Better error handling

---

## 📖 Quick Start

### Installation
```bash
# Clone or download the repository
git clone https://github.com/yourusername/slang-math.git
cd slang-math

# No npm install needed - pure JavaScript!
```

### Basic Examples

#### Example 1: Simple Polynomial
```javascript
import { polynomial, evaluateAt } from './slang-helpers.js';

// Create f(x) = x² - 4x + 4
const f = polynomial([1, -4, 4], 'x');

// Evaluate at x = 2
console.log(evaluateAt(f[0], { x: 2 }));  // 0
```

#### Example 2: Rational Function ()
```javascript
import { createFraction, createTerm, differentiateFraction } from './slang-math.js';

// Create f(x) = x/(x + 1)
const f = createFraction(
    [createTerm(1, {x: 1})],                    // numerator: x
    [createTerm(1, {x: 1}), createTerm(1)]     // denominator: x + 1
);

// Differentiate using quotient rule
const fPrime = differentiateFraction(f, 'x');
// Result: 1/(x + 1)²
```

#### Example 3: Complex Integration
```javascript
import { numericalIntegrateFraction } from './slang-math.js';

// Integrate a rational function
const result = numericalIntegrateFraction(
    complexFraction,
    0,  // lower bound
    1,  // upper bound
    'x',
    1000  // steps for accuracy
);
```

---

## 🎓 Complete Feature List

### Core Operations

#### 📐 Expression Creation

**Polynomial Creation**
```javascript
import { polynomial, sum, monomial } from './slang-helpers.js';

// Method 1: Array of coefficients
const f = polynomial([1, -2, 1], 'x');  // x² - 2x + 1

// Method 2: Sum of monomials
const g = sum([
    [3, {x: 2}],
    [-2, {x: 1}],
    [1, {}]
]);  // 3x² - 2x + 1

// Method 3: Single monomial
const h = monomial(5, {x: 3, y: 2});  // 5x³y²
```

**Rational Function Creation ()**
```javascript
import { createFraction, createTerm } from './slang-math.js';

// Simple: polynomial / constant
const f1 = createFraction(
    [createTerm(2, {x: 1}), createTerm(3)],  // 2x + 3
    4                                         // constant denominator
);  // (2x + 3)/4

// Advanced: polynomial / polynomial
const f2 = createFraction(
    [createTerm(1, {x: 1})],                          // x
    [createTerm(1, {x: 2}), createTerm(-1)]          // x² - 1
);  // x/(x² - 1)

// Complex: multivariable rational function
const f3 = createFraction(
    [createTerm(1, {x: 2, y: 1})],                   // x²y
    [createTerm(1, {x: 1}), createTerm(1, {y: 1})]  // x + y
);  // (x²y)/(x + y)
```

#### 🔢 Evaluation

```javascript
import { evaluateFraction, evaluateEquation } from './slang-math.js';

// Evaluate rational function
const value = evaluateFraction(fraction, { x: 2, y: 3 });

// Evaluate entire equation
const result = evaluateEquation(equation, { x: 1 });
```

#### ∂ Differentiation

**Simple Polynomials**
```javascript
import { differentiateFraction } from './slang-math.js';

const f = polynomial([1, 0, -3, 0], 'x');  // x³ - 3x
const fPrime = differentiateFraction(f[0][0], 'x');
// Result: 3x² - 3
```

**Quotient Rule (Automatic!)**
```javascript
// For f(x) = x/(x² + 1)
const f = createFraction(
    [createTerm(1, {x: 1})],
    [createTerm(1, {x: 2}), createTerm(1)]
);

const fPrime = differentiateFraction(f, 'x');
// Automatically applies: d/dx[u/v] = (u'v - uv')/v²
// Result: ((x² + 1) - x(2x))/(x² + 1)² = (1 - x²)/(x² + 1)²
```

**Partial Derivatives**
```javascript
import { partialDerivative } from './slang-helpers.js';

const f = createFraction(
    [createTerm(1, {x: 2, y: 1})],  // x²y
    [createTerm(1, {x: 1, y: 1})]   // xy
);

const fx = partialDerivative(f, 'x');  // ∂f/∂x
const fy = partialDerivative(f, 'y');  // ∂f/∂y
```

#### ∫ Integration

**Symbolic Integration**
```javascript
import { integrateFraction } from './slang-math.js';

// Works for polynomial / constant
const F = integrateFraction(
    createFraction([createTerm(2, {x: 1})], 1),
    'x'
);  // x²
```

**Numerical Integration (NEW: Simpson's Rule)**
```javascript
import { numericalIntegrateFraction } from './slang-math.js';

// For complex rational functions
const area = numericalIntegrateFraction(
    complexRational,
    0,      // lower
    1,      // upper
    'x',
    1000    // steps (even number for Simpson's rule)
);

// Uses Simpson's rule: h/3[f(x₀) + 4f(x₁) + 2f(x₂) + ...]
// Much more accurate than rectangle method!
```

**Definite Integration**
```javascript
import { definiteIntegrateFraction } from './slang-math.js';

const result = definiteIntegrateFraction(
    fraction,
    0,    // lower bound
    2,    // upper bound
    'x'
);
```

**Double/Triple Integrals**
```javascript
import { integralValue } from './slang-helpers.js';

// ∫∫ xy dx dy over [0,2] × [0,3]
const volume = integralValue(
    createFraction([createTerm(1, {x:1, y:1})], 1),
    { x: [0, 2], y: [0, 3] }
);  // 9
```

---

### Advanced Features

#### 🎯 Product & Quotient Rules

```javascript
import { productRuleDifferentiate, quotientRuleDifferentiate } from './slang-advanced.js';

// Product rule: d/dx[f·g] = f'·g + f·g'
const derivative1 = productRuleDifferentiate([f, g], 'x');

// Quotient rule: d/dx[f/g] = (f'·g - f·g')/g²
const derivative2 = quotientRuleDifferentiate(f, g, 'x');
```

#### 🔗 Chain Rule

```javascript
import { chainRuleDifferentiate } from './slang-advanced.js';

// For compositions like f(g(x))
const result = chainRuleDifferentiate(outer, inner, 'x');
```

#### 📊 Taylor Series

```javascript
import { taylorSeries } from './slang-advanced.js';

// Expand f(x) around x = 0 to order 5
const taylor = taylorSeries(f, 'x', 0, 5);
// f(x) ≈ f(0) + f'(0)x + f''(0)x²/2! + ...
```

#### 🎲 Optimization

**Critical Points**
```javascript
import { findCriticalPoints, secondDerivativeTest } from './slang-advanced.js';

// Find where f'(x) = 0
const critical = findCriticalPoints(f, 'x', [-10, 10]);

// Classify each point
for (let point of critical.criticalPoints) {
    const test = secondDerivativeTest(f, 'x', point);
    console.log(`x = ${point}: ${test.type}`);
    // "local minimum", "local maximum", or "inconclusive"
}
```

**Curve Analysis**
```javascript
import { analyzeCurve } from './slang-advanced.js';

const analysis = analyzeCurve(f, 'x', [-5, 5]);
// Returns: {
//   criticalPoints: [...],
//   extrema: [...],
//   inflectionPoints: [...],
//   firstDerivative: {...},
//   secondDerivative: {...}
// }
```

#### 📐 Geometry

**Arc Length**
```javascript
import { arcLength } from './slang-advanced.js';

// Length of curve y = f(x) from a to b
const L = arcLength(f, 'x', 0, 2);
// Uses: L = ∫√(1 + (dy/dx)²) dx
```

**Surface Area of Revolution**
```javascript
import { surfaceAreaOfRevolution } from './slang-advanced.js';

// Rotate y = f(x) around x-axis
const SA = surfaceAreaOfRevolution(f, 'x', 0, 1);
// Uses: SA = 2π ∫ y√(1 + (dy/dx)²) dx
```

**Volume Under Surface**
```javascript
import { volumeUnderSurface } from './slang-helpers.js';

// Volume under z = f(x,y)
const V = volumeUnderSurface(surface, [0, 1], [0, 1]);
```

#### 🌊 Multivariable Calculus

**Gradient**
```javascript
import { gradient } from './slang-advanced.js';

const grad = gradient(f, ['x', 'y']);
// ∇f = (∂f/∂x, ∂f/∂y)
```

**Directional Derivative**
```javascript
import { directionalDerivative } from './slang-advanced.js';

const Dvf = directionalDerivative(
    f,
    ['x', 'y'],
    {x: 1, y: 1},      // point
    {x: 1, y: 0}       // direction
);
// Rate of change in given direction
```

**Lagrange Multipliers**
```javascript
import { lagrangeMultipliers } from './slang-advanced.js';

const result = lagrangeMultipliers(
    objectiveFunction,
    constraintFunction,
    ['x', 'y']
);
// Sets up system: ∇f = λ∇g
```

---

## 🔧 Polynomial Arithmetic ()

```javascript
import {
    addPolynomials,
    subtractPolynomials,
    multiplyPolynomials,
    simplifyPolynomial
} from './slang-math.js';

// Addition
const sum = addPolynomials(poly1, poly2);

// Subtraction
const diff = subtractPolynomials(poly1, poly2);

// Multiplication
const product = multiplyPolynomials(poly1, poly2);

// Simplification (combines like terms)
const simplified = simplifyPolynomial(polynomial);
```

---

## 📊 Complete API Reference

### Core Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `createTerm(coeff, vars)` | Create single term | `createTerm(3, {x:2})` → 3x² |
| `createFraction(numi, deno)` | Create fraction | See examples above |
| `polynomial(coeffs, var)` | Quick polynomial | `polynomial([1,-2,1],'x')` |
| `evaluateFraction(frac, vals)` | Evaluate | `evaluateFraction(f, {x:2})` |
| `differentiateFraction(frac, var)` | Differentiate | Auto quotient rule |
| `integrateFraction(frac, var)` | Integrate | Symbolic when possible |
| `numericalIntegrateFraction(...)` | Numeric integration | Simpson's rule |
| `simplifyFraction(frac)` | Simplify | Combines terms, GCD |

### Helper Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `sum(terms)` | Build expression | See creation section |
| `integralValue(expr, bounds)` | Integrate & evaluate | One-liner |
| `volumeUnderSurface(f, xb, yb)` | 3D volume | Double integral |
| `partialDerivative(f, var)` | Partial derivative | Multivariable |

### Advanced Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `productRuleDifferentiate(fs, var)` | Product rule | d/dx[f·g·h] |
| `quotientRuleDifferentiate(f, g, var)` | Quotient rule | d/dx[f/g] |
| `taylorSeries(f, var, center, order)` | Taylor expansion | Approximate f |
| `findCriticalPoints(f, var, range)` | Find extrema | Optimization |
| `gradient(f, vars)` | Gradient vector | ∇f |
| `arcLength(f, var, a, b)` | Curve length | Geometry |

---

## 💡 Usage Patterns

### Pattern 1: Simple Calculus Problem
```javascript
// Find critical points of f(x) = x³ - 3x
const f = polynomial([1, 0, -3, 0], 'x');
const critical = findCriticalPoints(f[0][0], 'x', [-5, 5]);
const fPrime = differentiateFraction(f[0][0], 'x');

console.log('f(x) =', fractionToString(f[0][0]));
console.log('f\'(x) =', fractionToString(fPrime));
console.log('Critical points:', critical.criticalPoints);
```

### Pattern 2: Rational Function Analysis
```javascript
// Analyze f(x) = (x² - 1)/(x² + 1)
const f = createFraction(
    [createTerm(1, {x:2}), createTerm(-1)],
    [createTerm(1, {x:2}), createTerm(1)]
);

const fPrime = differentiateFraction(f, 'x');
const critical = findCriticalPoints({numi: f.numi, deno: 1}, 'x', [-5,5]);

console.log('Function:', fractionToString(f));
console.log('Derivative:', fractionToString(fPrime));
```

### Pattern 3: Multivariable Optimization
```javascript
// Find gradient of f(x,y) = x²y/(x + y)
const f = createFraction(
    [createTerm(1, {x:2, y:1})],
    [createTerm(1, {x:1}), createTerm(1, {y:1})]
);

const grad = gradient(f, ['x', 'y']);
console.log('∇f =', grad);

// Evaluate at point (1,1)
const gradAt = {
    x: evaluateFraction(grad.gradient.x, {x:1, y:1}),
    y: evaluateFraction(grad.gradient.y, {x:1, y:1})
};
console.log('∇f(1,1) =', gradAt);
```

### Pattern 4: Numerical Integration
```javascript
// Integrate complex rational function
const f = createFraction(
    [createTerm(1, {x:1})],
    [createTerm(1, {x:2}), createTerm(1)]
);  // x/(x² + 1)

const area = numericalIntegrateFraction(f, 0, 1, 'x', 10000);
console.log('∫₀¹ x/(x²+1) dx ≈', area);
// This is ln(2)/2 ≈ 0.3466
```

---

## 🎯 Real-World Applications

### Physics: Projectile Motion
```javascript
const h = polynomial([-4.9, 20, 2], 't');  // h(t) = -4.9t² + 20t + 2
const v = differentiateFraction(h[0][0], 't');  // v(t) = h'(t)
const a = differentiateFraction(v, 't');  // a(t) = v'(t)

const maxHeight = findCriticalPoints(h[0][0], 't', [0, 10]);
console.log('Max height at t =', maxHeight.criticalPoints[0]);
```

### Economics: Cost Minimization
```javascript
// Average cost: C(x) = (x² + 100x + 1000)/x
const AC = createFraction(
    [createTerm(1, {x:2}), createTerm(100, {x:1}), createTerm(1000)],
    [createTerm(1, {x:1})]
);

const minCost = findCriticalPoints({numi: AC.numi, deno: 1}, 'x', [1, 100]);
```

### Engineering: Surface Area Optimization
```javascript
// Minimize surface area of cylinder with volume V
// A = 2πr² + 2πrh, where V = πr²h
// Express h in terms of r: h = V/(πr²)
// Then optimize A(r)
```

---

## 🏗️ Architecture

### Module Structure
```
slang-math.js (exports all)
├─ slang-basic.js ( )
│  ├─ Core term/fraction creation
│  ├─ Polynomial arithmetic 
│  ├─ Quotient rule differentiation 
│  ├─ Simpson's rule integration 
│  └─ GCD simplification 
├─ slang-helpers.js
│  ├─ Easy builders
│  ├─ Common formulas
│  └─ Verification tools
└─ slang-advanced.js
   ├─ Product/quotient rules
   ├─ Taylor series
   ├─ Optimization
   └─ Multivariable calculus
```

### Data Structure (Enhanced)
```javascript
// FRACTION ()
{
    numi: {
        terms: [
            { coeff: 2, var: { x: 2 } },  // 2x²
            { coeff: 3, var: { x: 1 } }   // 3x
        ]
    },
    deno: {  //: Can be polynomial!
        terms: [
            { coeff: 1, var: { x: 1 } },  // x
            { coeff: 1 }                   // 1
        ]
    }
    // OR simple: deno: 5
}
```

---

## 📈 Performance Notes

### Symbolic Operations
- **Term creation**: O(1)
- **Polynomial addition**: O(n + m)
- **Polynomial multiplication**: O(nm)
- **Differentiation**: O(n)
- **Simplification**: O(n log n)

### Numerical Operations
- **Simpson's Rule**: ~3× faster convergence than rectangles
- **1000 steps**: Good balance (default)
- **10000 steps**: High accuracy for difficult integrals

### Best Practices
1. Use `simplifyFraction()` after operations
2. For complex rationals, use numerical methods
3. Cache frequently evaluated expressions
4. Use GCD simplification for cleaner results

---

## 🔥 What Makes  Special?

✨ **Full Rational Function Support** - Not just polynomials anymore!  
🎯 **Automatic Quotient Rule** - Differentiate rational functions seamlessly  
📊 **Simpson's Rule** - More accurate numerical integration  
⚡ **GCD Simplification** - Cleaner, simpler fractions  
🔧 **Polynomial Arithmetic** - Add, subtract, multiply polynomials  
📚 **Enhanced Documentation** - Every feature explained  
🎓 **Educational** - See the math, not just the answer  

---

## 🚀 Migration from 

### What Changed?
1. `createFraction()` now accepts polynomial denominators
2. `differentiateFraction()` automatically uses quotient rule
3. New `numericalIntegrateFraction()` with Simpson's rule
4. New polynomial arithmetic functions
5. Enhanced simplification with GCD

### fully compatible?
**YES!** All  code works in :
```javascript
//  code still works:
const f = createFraction([createTerm(1, {x:1})], 1);  // ✓
const fPrime = differentiateFraction(f, 'x');          // ✓

//  adds new capabilities:
const g = createFraction(
    [createTerm(1, {x:1})],
    [createTerm(1, {x:1}), createTerm(1)]  // 
);
```

---

## 🤝 Contributing

We love contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to add features
- Code style guidelines
- Testing requirements
- Documentation standards

### Current Priorities
1. Partial fraction decomposition
2. Trigonometric functions
3. Logarithms and exponentials
4. Matrix operations
5. Symbolic equation solving

---

## 📄 License

MIT License - use freely in your projects!

---

## 📞 Quick Links

- **Start Learning**: [SUMMARY.md](SUMMARY.md)
- **Feature Guide**: [FEATURES-EXPLAINED.md](FEATURES-EXPLAINED.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Full Tutorial**: Run `node complete-guide.js`
- **Quick Patterns**: Run `node quick-start.js`

---

## 📊 Quick Reference Card

| Need to... | Use... | File |
|------------|--------|------|
| Create polynomial | `polynomial([2,1,0], 'x')` | slang-helpers.js |
| Create rational | `createFraction(numi, deno)` | slang-math.js |
| Evaluate | `evaluateFraction(f, {x:3})` | slang-math.js |
| Differentiate | `differentiateFraction(f, 'x')` | slang-math.js |
| Integrate (numeric) | `numericalIntegrateFraction(...)` | slang-math.js |
| Find critical pts | `findCriticalPoints(f, 'x')` | slang-advanced.js |
| Simplify | `simplifyFraction(f)` | slang-math.js |
| Gradient | `gradient(f, ['x','y'])` | slang-advanced.js |

---

**Version**: 2.0.0  
**Last Updated**: February 2026  
**Total Lines of Code**: ~2,000+  
**Total Features**: 75+  
**Dependencies**: 0  

---

<div align="center">

**Made with ❤️ for the mathematical community**

**enhancementd to handle ANY rational function!** 🧮✨

[⭐ Star us on GitHub](https://github.com/yourusername/slang-math) • [🐛 Report Bug](https://github.com/yourusername/slang-math/issues) • [💡 Request Feature](https://github.com/yourusername/slang-math/issues)

**Happy Calculating!** 📊🚀

</div>
