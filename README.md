# 📚 SLaNg Math Library
### Saad's Language for Analytical Numerics and Geometry

🎯 **Symbolic Mathematics Made Simple**

A powerful, dependency-free JavaScript library for symbolic and numerical calculus. Compute derivatives, integrals, Taylor series, optimize functions, and solve multivariable problems—all with clean, readable code.

```javascript
import { polynomial, integralValue } from './slang-helpers.js';

const f = polynomial([1, 0], 'x');  // f(x) = x
const area = integralValue(f[0][0], { x: [0, 2] });  // ∫₀² x dx = 2
```

**No dependencies. Pure JavaScript. Fully documented.**

---

## 🚀 Quick Start

### Installation
```bash
# Clone or download the repository
git clone https://github.com/yourusername/slang-math.git
cd slang-math

# No npm install needed - pure JavaScript!
```

### Your First Calculation
```javascript
import { polynomial, integralValue } from './slang-helpers.js';

// Create f(x) = x²
const f = polynomial([2], 'x');

// Compute ∫₀³ x² dx
const result = integralValue(f[0][0], { x: [0, 3] });
console.log(result);  // 9
```

That's it! You just computed a definite integral symbolically.

---

## ✨ What Can You Do?

### 🧮 Calculus Operations
- **Derivatives**: Find derivatives of complex expressions
- **Integrals**: Definite and indefinite integration
- **Multivariable Calculus**: Partial derivatives, gradients, directional derivatives
- **Optimization**: Find critical points, local extrema
- **Taylor Series**: Expand functions around points
- **Arc Length & Surface Area**: Geometric calculations

### 📐 Expression Building
- **Polynomials**: Easy builders for any degree
- **Products**: Expand and simplify algebraic expressions
- **Fractions**: Full fraction arithmetic with simplification
- **Evaluation**: Symbolic expressions to numerical values

### 🔬 Advanced Features
- Product and quotient rules
- Integration by parts
- Numerical root finding
- Limit calculations
- Volume under surfaces
- Region integration

---

## 📖 Documentation

Every function in this library is fully documented! Here's where to find help:

### 📘 For Learning
- **[SUMMARY.md](SUMMARY.md)** ⭐ **START HERE** - Quick overview, what problems it solves, and quick examples
- **[FEATURES-EXPLAINED.md](FEATURES-EXPLAINED.md)** 📖 **BEST FOR LEARNING** - Every feature explained in detail with real-world applications
- **[README.md](README.md)** - Complete API reference (you're reading it!)

### 💡 Example Files
Run these to see the library in action:
- **`test-slang.js`** - Basic functionality tests
- **`quick-start.js`** - 9 common usage patterns
- **`demo-helpers.js`** - Helper functions demonstration
- **`complete-guide.js`** ⭐ **MOST COMPREHENSIVE** - Full tutorial with 7 parts

**Every function has detailed explanations in our markdown documentation!** Don't guess—read the docs and see examples.

---

## 💻 Core Modules

### 1. `slang-math.js` - Foundation
The core symbolic math engine.

```javascript
import {
    createTerm,
    createFraction,
    definiteIntegrateFraction,
    differentiateFraction,
    expandProduct,
    simplifyFraction,
    evaluateEquation
} from './slang-math.js';
```

**Contains:**
- Expression creation and manipulation
- Basic differentiation and integration
- Expression evaluation
- Simplification and expansion
- ~400 lines, ~12KB

### 2. `slang-helpers.js` - Easy Interface
Simplified functions for common tasks.

```javascript
import {
    polynomial,
    sum,
    integralValue,
    volumeUnderSurface,
    partialDerivative
} from './slang-helpers.js';
```

**Contains:**
- One-line expression builders
- Easy integration and differentiation
- Geometry helpers
- Common formulas
- ~300 lines, ~8KB

### 3. `slang-advanced.js` - Advanced Features
Sophisticated calculus operations.

```javascript
import {
    productRuleDifferentiate,
    quotientRuleDifferentiate,
    taylorSeries,
    findCriticalPoints,
    arcLength,
    gradient,
    directionalDerivative
} from './slang-advanced.js';
```

**Contains:**
- Product & quotient rules
- Integration by parts
- Taylor series expansion
- Optimization tools
- Multivariable calculus
- ~550 lines, ~17KB

---

## 🎓 Learning Path

### Level 1: Beginner (30 minutes)
1. Read [SUMMARY.md](SUMMARY.md) (5 min)
2. Run `node test-slang.js` (5 min)
3. Read first half of [FEATURES-EXPLAINED.md](FEATURES-EXPLAINED.md) (20 min)
4. Try modifying test-slang.js

### Level 2: Intermediate (2 hours)
1. Run `node quick-start.js` and study the code (30 min)
2. Read this README API reference (30 min)
3. Run `node demo-helpers.js` (20 min)
4. Build something yourself! (40 min)
   - Create a polynomial
   - Find its derivative
   - Find critical points
   - Evaluate at many points

### Level 3: Advanced (4 hours)
1. Run `node complete-guide.js` (30 min)
2. Read [FEATURES-EXPLAINED.md](FEATURES-EXPLAINED.md) completely (1 hour)
3. Study slang-advanced.js source code (1 hour)
4. Implement a new feature! (1.5 hours)

---

## 📊 Complete API Reference

### Expression Creation

#### `createTerm(variable, power, coefficient = 1)`
Creates a single term in a polynomial.

```javascript
const x = createTerm('x', 1);  // x
const x2 = createTerm('x', 2, 3);  // 3x²
```

#### `polynomial(powers, variable, coefficient = 1)`
Quick polynomial builder.

```javascript
const f = polynomial([2, 1, 0], 'x');  // x² + x + 1
const g = polynomial([3], 'y', 2);  // 2y³
```

#### `createFraction(numerator, denominator)`
Creates a fraction expression.

```javascript
const frac = createFraction([createTerm('x', 1)], [createTerm('x', 2)]);  // x/x²
```

### Evaluation

#### `evaluateEquation(equation, values)`
Evaluates an expression at given values.

```javascript
const expr = polynomial([2, 1], 'x');  // x² + x
const result = evaluateEquation(expr[0][0], { x: 3 });  // 12
```

#### `integralValue(numeratorTerms, bounds, numSteps = 1000)`
Computes definite integral value.

```javascript
const f = polynomial([1], 'x');  // x
const area = integralValue(f[0][0], { x: [0, 2] });  // 2
```

### Differentiation

#### `differentiateFraction(fraction, variable)`
Symbolic differentiation.

```javascript
const f = polynomial([2], 'x');  // x²
const df = differentiateFraction(f, 'x');  // 2x
```

#### `partialDerivative(numeratorTerms, variable)`
Partial derivative for multivariable functions.

```javascript
const f = [createTerm('x', 2), createTerm('y', 1)];  // x² + y
const df_dx = partialDerivative(f, 'x');  // 2x
```

#### `productRuleDifferentiate(f, g, variable)`
Product rule differentiation.

```javascript
const f = polynomial([1], 'x');  // x
const g = polynomial([2], 'x');  // x²
const result = productRuleDifferentiate(f, g, 'x');  // d/dx[x·x²]
```

#### `quotientRuleDifferentiate(f, g, variable)`
Quotient rule differentiation.

```javascript
const f = polynomial([1], 'x');  // x
const g = polynomial([2], 'x');  // x²
const result = quotientRuleDifferentiate(f, g, 'x');  // d/dx[x/x²]
```

### Integration

#### `definiteIntegrateFraction(fraction, variable, lower, upper, numSteps = 1000)`
Definite integration.

```javascript
const f = polynomial([2], 'x');  // x²
const area = definiteIntegrateFraction(f, 'x', 0, 3, 1000);  // 9
```

#### `indefiniteIntegrateFraction(fraction, variable)`
Symbolic indefinite integration.

```javascript
const f = polynomial([2], 'x');  // x²
const F = indefiniteIntegrateFraction(f, 'x');  // x³/3 + C
```

#### `integrationByParts(u, dv, variable, bounds = null)`
Integration by parts: ∫u dv = uv - ∫v du

```javascript
const u = polynomial([1], 'x');  // x
const dv = [createTerm('x', 1, 1)];  // x dx (treated as e^x in some cases)
const result = integrationByParts(u, dv, 'x', [0, 1]);
```

#### `volumeUnderSurface(numeratorTerms, xBounds, yBounds, numSteps = 100)`
Double integration for volume.

```javascript
const f = polynomial([1, 1], 'x');  // x (or could be xy)
const volume = volumeUnderSurface(f[0][0], [0, 1], [0, 1]);
```

### Simplification & Expansion

#### `simplifyFraction(fraction)`
Simplifies a fraction expression.

```javascript
const f = createFraction([createTerm('x', 2)], [createTerm('x', 1)]);
const simplified = simplifyFraction(f);  // x
```

#### `expandProduct(fraction1, fraction2)`
Expands the product of two expressions.

```javascript
const f = polynomial([1, 0], 'x');  // x + 1
const g = polynomial([1, 0], 'y');  // y + 1
const expanded = expandProduct(f, g);  // xy + x + y + 1
```

### Optimization

#### `findCriticalPoints(f, variable, searchStart = 0, searchEnd = 10, numTests = 50)`
Finds critical points (where derivative = 0).

```javascript
const f = polynomial([2, 0, -4], 'x');  // x² - 4
const criticalPoints = findCriticalPoints(f, 'x', -5, 5);
// Returns [{x: 0, y: -4, type: 'minimum'}]
```

#### `secondDerivativeTest(f, variable, criticalPoint)`
Determines if critical point is min, max, or saddle.

```javascript
const f = polynomial([2], 'x');  // x²
const type = secondDerivativeTest(f, 'x', 0);  // 'minimum'
```

### Series & Approximations

#### `taylorSeries(f, variable, center, order)`
Taylor series expansion around a point.

```javascript
const f = polynomial([2], 'x');  // x²
const series = taylorSeries(f, 'x', 0, 4);
// Returns polynomial approximation
```

#### `limit(f, variable, approach, direction = 'both')`
Compute limits (numerical approximation).

```javascript
const f = createFraction([createTerm('x', 2)], [createTerm('x', 1)]);
const lim = limit(f, 'x', 0, 'right');
```

### Multivariable Calculus

#### `gradient(f, variables)`
Computes gradient vector.

```javascript
const f = polynomial([2, 1], 'x');  // Could be f(x,y) = x² + y
const grad = gradient(f, ['x', 'y']);
// Returns [∂f/∂x, ∂f/∂y]
```

#### `directionalDerivative(f, variables, direction, point)`
Derivative in a specific direction.

```javascript
const f = [createTerm('x', 2), createTerm('y', 2)];  // x² + y²
const rate = directionalDerivative(f, ['x', 'y'], [1, 0], {x: 1, y: 1});
```

### Geometry

#### `arcLength(f, variable, a, b, numSteps = 1000)`
Computes arc length of a curve.

```javascript
const f = polynomial([2], 'x');  // y = x²
const length = arcLength(f, 'x', 0, 2);
```

#### `surfaceArea(f, variable, a, b, numSteps = 1000)`
Surface area of revolution.

```javascript
const f = polynomial([1], 'x');  // y = x
const area = surfaceArea(f, 'x', 0, 2);
```

### Utilities

#### `sum(...terms)`
Combines multiple terms into one expression.

```javascript
const expr = sum(
    createTerm('x', 2),
    createTerm('x', 1, -1),
    createTerm('x', 0, 3)
);  // x² - x + 3
```

#### `monomial(coefficient, ...variables)`
Creates a monomial term.

```javascript
const term = monomial(3, {x: 2}, {y: 1});  // 3x²y
```

---

## 🔧 What Can You Build?

### Physics Simulations
- Projectile motion calculations
- Harmonic oscillators
- Wave equations
- Velocity and acceleration from position

### Economics Models
- Cost/revenue/profit optimization
- Marginal analysis
- Supply and demand equilibrium
- Elasticity calculations

### Engineering Applications
- Optimization problems
- Area and volume calculations
- Center of mass computations
- Moment of inertia

### Mathematics Learning Tools
- Function plotters
- Derivative calculators
- Integration practice tools
- Optimization visualizers

---

## 📈 Performance Notes

- **Symbolic operations**: Instant (manipulating data structures)
- **Numerical integration**: Depends on `numSteps` parameter
  - 100 steps: Fast but less accurate
  - 1000 steps: Good balance (default)
  - 10000 steps: Slower but very accurate
- **Root finding**: Usually converges in 20-50 iterations
- **Deep cloning**: Fast for typical expressions (<1ms)

---

## 🎯 Best Practices

1. **Start simple**: Use helpers like `polynomial()` instead of manual creation
2. **Test incrementally**: Build complex expressions from simple parts
3. **Verify results**: Use `evaluateEquation()` to check symbolic results numerically
4. **Simplify often**: Call `simplifyFraction()` after operations
5. **Read error messages**: The library gives helpful error messages
6. **Use appropriate tools**: Symbolic when possible, numerical when necessary
7. **Check the docs**: Every function is explained in the markdown files!

---

## 🌟 What Makes SLaNg Special?

✨ **Symbolic AND Numerical**: Best of both worlds  
🔒 **Type-Safe Structure**: JSON notation prevents many errors  
📦 **No External Dependencies**: Pure JavaScript  
📚 **Fully Documented**: Every function explained in markdown files  
✅ **Tested**: All core features have passing tests  
🔧 **Extensible**: Easy to add new features  
🎓 **Educational**: Great for learning calculus  

---

## 🤝 Contributing

We love contributions! SLaNg is an open-source project and we welcome:

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/slang-math.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Add new functions to appropriate modules
   - Write tests for your features
   - Update documentation in markdown files
   - Add examples to demonstrate usage

4. **Test your changes**
   ```bash
   node test-slang.js
   node your-new-test.js
   ```

5. **Submit a pull request**
   - Describe what you've added/fixed
   - Reference any related issues
   - Include example usage

### Contribution Ideas

Want to help but not sure where to start? Here are some ideas:

🔢 **New Math Features**
- Trigonometric functions (sin, cos, tan)
- Exponential and logarithmic functions
- Matrix operations
- Systems of equations solver
- Differential equations (numeric solvers)

📊 **Visualization**
- 3D plotting integration
- LaTeX output for pretty printing
- Export to graphing formats

🎓 **Educational Features**
- Step-by-step solutions (show work)
- Interactive tutorials
- More worked examples
- Common mistake warnings

🐛 **Bug Fixes**
- Find and report issues
- Improve error messages
- Fix edge cases
- Performance optimizations

📖 **Documentation**
- More examples in markdown files
- Video tutorials
- Translation to other languages
- Better inline comments

### Contribution Guidelines

- **Code style**: Follow existing patterns in the codebase
- **Documentation**: Explain ALL new functions in markdown files
- **Tests**: Include tests for new features
- **Examples**: Add usage examples to demo files
- **Commit messages**: Be descriptive about what changed and why

### Recognition

All contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked profusely! 🎉

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🔮 Future Roadmap

Interested in where SLaNg is headed? Here's what we're considering:

- **Symbolic equation solver** - Solve algebraic equations symbolically
- **Trigonometric support** - sin, cos, tan, and inverse functions
- **Matrix algebra** - Operations, determinants, eigenvalues
- **Complex numbers** - Full complex number support
- **Better simplification** - More sophisticated algebraic simplification
- **CAS features** - Computer algebra system capabilities
- **Performance optimization** - Faster numerical methods
- **Browser bundle** - Easy browser usage via CDN

Vote on features or suggest new ones by opening an issue!

---

## 💡 Getting Help

- **Check the docs**: Read [FEATURES-EXPLAINED.md](FEATURES-EXPLAINED.md) for detailed explanations
- **Run examples**: Execute `complete-guide.js` for comprehensive tutorial
- **Open an issue**: Found a bug or need help? Create an issue on GitHub
- **Read the source**: All functions are well-commented

---

## 📊 Quick Reference Card

| Need to...                    | Use...                          | File              |
| ----------------------------- | ------------------------------- | ----------------- |
| Create polynomial             | `polynomial([2,1,0], 'x')`      | slang-helpers.js  |
| Evaluate expression           | `evaluateEquation(expr, {x:3})` | slang-math.js     |
| Find derivative               | `differentiateFraction(f, 'x')` | slang-math.js     |
| Compute integral              | `integralValue(f, {x:[0,2]})`   | slang-helpers.js  |
| Find critical points          | `findCriticalPoints(f, 'x')`    | slang-advanced.js |
| Taylor series                 | `taylorSeries(f, 'x', 0, 4)`    | slang-advanced.js |
| Expand product                | `expandProduct(f, g)`           | slang-math.js     |
| Simplify expression           | `simplifyFraction(f)`           | slang-math.js     |
| Partial derivative            | `partialDerivative(f, 'x')`     | slang-helpers.js  |
| Compute gradient              | `gradient(f, ['x','y'])`        | slang-advanced.js |
| Volume under surface          | `volumeUnderSurface(f,x,y)`     | slang-helpers.js  |
| Arc length                    | `arcLength(f, 'x', a, b)`       | slang-advanced.js |

---

## 📞 Quick Links

- **Start Learning**: [SUMMARY.md](SUMMARY.md)
- **Feature Guide**: [FEATURES-EXPLAINED.md](FEATURES-EXPLAINED.md)
- **Full Tutorial**: Run `node complete-guide.js`
- **Quick Patterns**: Run `node quick-start.js`
- **API Reference**: This file!

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Total Lines of Code**: ~1,500  
**Total Features**: 50+  
**Dependencies**: 0  

---

<div align="center">

**Made with ❤️ for the mathematical community**

[⭐ Star us on GitHub](https://github.com/yourusername/slang-math) • [🐛 Report Bug](https://github.com/yourusername/slang-math/issues) • [💡 Request Feature](https://github.com/yourusername/slang-math/issues)

**Happy Calculating!** 🧮✨

</div>
