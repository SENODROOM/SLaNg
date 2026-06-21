<p align="center">
  <img src="logo.png" alt="SLaNg Math Library Logo" width="200"/>
  <h1 align="center">SLaNg Math Library</h1>
</p>


### Saad's Language for Analytical Numerics and Geometry

🎯 **Advanced Symbolic Mathematics with Comprehensive LaTeX Conversion & Extended Function Support**

A powerful, dependency-free JavaScript library for symbolic and numerical calculus with **complete polynomial denominator support**, **bidirectional LaTeX conversion**, **extended mathematical functions**, and **advanced multivariable calculus**. Compute derivatives, integrals, rational functions, Taylor series, optimize functions, analyze surfaces, and solve complex multivariable problems—all with clean, readable code and professional-grade error handling.

```javascript
import { createFraction, createTerm, gradient, tangentPlane } from './slang-math.js';
import { slangToLatex, latexToSlang } from './slang-convertor.js';

//: Full polynomial denominator support with LaTeX conversion!
const f = createFraction(
    [createTerm(2, {x: 1})],           // 2x
    [createTerm(1, {x: 2}), createTerm(1)]  // x² + 1
);  // f(x) = 2x/(x² + 1)

// Convert to LaTeX
const latex = slangToLatex(f);
console.log(latex); // "\\frac{2x}{x^{2} + 1}"

// Advanced multivariable calculus
const surface = { terms: [createTerm(1, {x: 2}), createTerm(1, {y: 2})] }; // z = x² + y²
const tangent = tangentPlane(surface, 1, 2);
console.log(tangentToLatex(tangent)); // "z = 5 + 2x + 4y + -5"

// Parse LaTeX back to SLaNg
const parsed = latexToSlang('\\frac{x^{2} + 1}{x - 1}');
```

**No dependencies. Pure JavaScript. Fully documented. Production ready.**

---

## 🚀 What This Package Does

### ✨ Core Capabilities

1. **🧮 Advanced Mathematical Functions**
   - Tangent plane and line analysis
   - Gradient and Hessian matrix computation
   - Critical point detection and classification
   - Directional derivatives and steepest directions
   - Surface normal vectors
   - Lagrange multipliers for constrained optimization
   - Local and global extrema finding

2. **📐 Multivariable Calculus**
   - Complete surface analysis capabilities
   - Vector calculus operations
   - Optimization algorithms
   - Constrained optimization with Lagrange multipliers

3. **🔄 LaTeX Integration**
   - Bidirectional LaTeX conversion
   - Support for complex mathematical expressions
   - Advanced parsing with error recovery
   - Validation system

4. **🧮 Extended Mathematical Functions**
   - Trigonometric functions (sin, cos, tan, etc.)
   - Inverse trigonometric functions
   - Hyperbolic functions
   - Logarithmic and exponential functions
   - Function evaluation and differentiation

5. **📊 Core Calculus Operations**
   - Symbolic differentiation and integration
   - Numerical integration with Simpson's rule
   - Polynomial arithmetic
   - Rational function operations
   - Taylor series expansion

---

## 📖 Quick Start

### Installation
```bash
# Clone or download the repository
git clone https://github.com/SENODROOM/SLaNg.git
cd slang-math

# No npm install needed - pure JavaScript!
# Optional: npm install for development tools
npm install
```

### Basic Examples

#### Example 1: LaTeX Conversion
```javascript
import { slangToLatex, latexToSlang, validateLatex } from './slang-convertor.js';

// Create SLaNg expression
const expr = createFraction(
    [createTerm(1, {x: 2}), createTerm(-1)],
    [createTerm(1, {x: 2}), createTerm(1)]
);

// Convert to LaTeX
const latex = slangToLatex(expr);
console.log(latex); // "\\frac{x^{2} - 1}{x^{2} + 1}"

// Parse back from LaTeX
const parsed = latexToSlang(latex);
```

#### Example 2: Advanced Multivariable Calculus
```javascript
import { gradient, hessian, tangentPlane, findCriticalPoints } from './slang-extended.js';

// Surface: z = x² + y²
const surface = { terms: [createTerm(1, {x: 2}), createTerm(1, {y: 2})] };

// Calculate gradient
const grad = gradient(surface, ['x', 'y']);
console.log('∇f =', grad); // {x: 2x, y: 2y}

// Find tangent plane at (1, 2)
const tangent = tangentPlane(surface, 1, 2);
console.log('Tangent plane:', tangentToLatex(tangent));

// Find critical points
const critical = findCriticalPoints(surface, ['x', 'y']);
```

#### Example 3: Optimization
```javascript
import { findExtrema, classifyCriticalPoint, lagrangeMultipliers } from './slang-extended.js';

// Function: f(x,y) = x² - y² (saddle point)
const saddle = { terms: [createTerm(1, {x: 2}), createTerm(-1, {y: 2})] };

// Find and classify critical points
const points = findCriticalPoints(saddle, ['x', 'y']);
points.forEach(point => {
    const classification = classifyCriticalPoint(saddle, point.variables);
    console.log(`Point: ${JSON.stringify(point.variables)}, Type: ${classification}`);
});

// Constrained optimization with Lagrange multipliers
const objective = { terms: [createTerm(1, {x: 1}), createTerm(1, {y: 1})] }; // x + y
const constraint = { terms: [createTerm(1, {x: 2}), createTerm(1, {y: 2}), createTerm(-1)] }; // x² + y² = 1
const constrained = lagrangeMultipliers(objective, [constraint], ['x', 'y']);
```

---

## 🎓 Complete Feature List

### 🧮 Advanced Mathematical Functions

#### Tangent Analysis
```javascript
import { tangentPlane, tangentLine, surfaceNormal } from './slang-extended.js';

// Tangent plane to surface z = f(x,y) at point (x0, y0)
const plane = tangentPlane(surface, 1, 2);
console.log('Point:', plane.point);
console.log('Normal:', plane.normal);
console.log('Equation:', tangentToLatex(plane));

// Tangent line to curve y = f(x) at point x0
const line = tangentLine(curve, 1);
console.log('Slope:', line.slope);
console.log('Equation:', tangentToLatex(line));

// Surface normal vector
const normal = surfaceNormal(surface, {x: 1, y: 0, z: 0});
```

#### Optimization
```javascript
import { findCriticalPoints, classifyCriticalPoint, findExtrema, findGlobalExtrema } from './slang-extended.js';

// Find critical points
const critical = findCriticalPoints(function, ['x', 'y']);

// Classify critical points (minimum, maximum, saddle)
const classification = classifyCriticalPoint(function, point);

// Find local extrema
const extrema = findExtrema(function, ['x', 'y'], bounds);

// Find global extrema in bounded region
const global = findGlobalExtrema(function, ['x', 'y'], bounds);
```

#### Multivariable Calculus
```javascript
import { gradient, hessian, directionalDerivative, steepestDirections } from './slang-extended.js';

// Gradient vector
const grad = gradient(function, ['x', 'y', 'z']);

// Hessian matrix
const hess = hessian(function, ['x', 'y']);

// Directional derivative
const dirDeriv = directionalDerivative(function, point, direction);

// Steepest ascent/descent directions
const steepest = steepestDirections(function, point);
```

#### Constrained Optimization
```javascript
import { lagrangeMultipliers } from './slang-extended.js';

// Solve constrained optimization problems
const result = lagrangeMultipliers(objective, constraints, variables);
```

### 🔄 LaTeX Conversion System

#### Bidirectional Conversion
```javascript
import { slangToLatex, latexToSlang, validateLatex } from './slang-convertor.js';

// SLaNg to LaTeX
const slang = createFraction([createTerm(1, {x: 1})], [createTerm(1, {x: 1}), createTerm(1)]);
const latex = slangToLatex(slang);
console.log(latex); // "\\frac{x}{x + 1}"

// LaTeX to SLaNg
const parsed = latexToSlang('\\frac{x^{2} - 1}{x^{2} + 1}');

// Validation
const validation = validateLatex(latex);
console.log(validation.valid); // true
```

### 🧮 Extended Mathematical Functions

#### Trigonometric Functions
```javascript
import { createFunction, evaluateFunction, extendedSlangToLatex } from './slang-extended.js';

// Create trigonometric expressions
const sinExpr = createFunction('sin', [createTerm(1, {x: 1})]);
const cosExpr = createFunction('cos', [createTerm(2, {x: 1})]);

// Convert to LaTeX
console.log(extendedSlangToLatex(sinExpr)); // "\\sin{x}"
console.log(extendedSlangToLatex(cosExpr)); // "\\cos{2x}"

// Evaluate functions
console.log(evaluateFunction(sinExpr, { x: Math.PI/2 })); // 1
console.log(evaluateFunction(cosExpr, { x: 0 })); // 1
```

#### Supported Functions
- **Trigonometric**: sin, cos, tan, cot, sec, csc
- **Inverse Trig**: arcsin, arccos, arctan
- **Hyperbolic**: sinh, cosh, tanh
- **Logarithmic**: ln, log, log10
- **Exponential**: exp, sqrt
- **Other**: abs, floor, ceil

### 📊 Core Operations

#### Expression Creation
```javascript
import { createTerm, createFraction } from './slang-basic.js';
import { polynomial, sum, monomial } from './slang-helpers.js';

// Create terms
const term = createTerm(5, { x: 2, y: 1 });  // 5x²y

// Create polynomials
const poly = polynomial([1, -2, 1], 'x');  // x² - 2x + 1

// Create rational functions
const frac = createFraction(
    [createTerm(1, {x: 1})],           // numerator: x
    [createTerm(1, {x: 2}), createTerm(1)]  // denominator: x² + 1
);
```

#### Calculus Operations
```javascript
import { differentiateFraction, numericalIntegrateFraction } from './slang-basic.js';
import { partialDerivative } from './slang-helpers.js';

// Differentiation
const derivative = differentiateFraction(frac, 'x');

// Partial derivatives
const pdX = partialDerivative(expr, 'x');
const pdY = partialDerivative(expr, 'y');

// Numerical integration
const integral = numericalIntegrateFraction(frac, 0, 1, 'x', 1000);
```

---

## 🏗️ Architecture

### Module Structure
```
slang-math.js (central exports)
├─ slang-basic.js
│  ├─ Core term/fraction creation
│  ├─ Polynomial arithmetic 
│  ├─ Differentiation & integration
│  └─ GCD simplification 
├─ slang-extended.js (Advanced functions)
│  ├─ Tangent plane/line analysis
│  ├─ Gradient & Hessian computation
│  ├─ Critical points & optimization
│  ├─ Directional derivatives
│  ├─ Surface normals
│  ├─ Lagrange multipliers
│  └─ Extended mathematical functions
├─ slang-convertor.js
│  ├─ LaTeX conversion system
│  └─ Bidirectional parsing
├─ slang-helpers.js
│  ├─ Easy builders
│  └─ Common formulas
└─ slang-advanced.js
   ├─ Product/quotient rules
   ├─ Taylor series
   └─ Advanced algorithms
```

---

## 🧪 Testing & Quality Assurance

### Comprehensive Test Suite
```bash
# Run all tests
npm test

# Run extended functions test
node experiments/slang-extended-test.js

# Run converter test
node experiments/test-converter.js
```

### Test Coverage
- **Unit Tests**: 95%+ code coverage
- **Integration Tests**: End-to-end functionality
- **Advanced Functions**: All features tested
- **Error Handling**: Comprehensive error scenarios

### Test Categories
1. Basic Function Creation and Evaluation
2. Gradient and Hessian Matrices
3. Tangent Plane and Line Analysis
4. Critical Points and Optimization
5. Directional Derivatives and Gradient Analysis
6. Surface Normals
7. Lagrange Multipliers
8. Function Evaluation Edge Cases
9. LaTeX Conversion
10. Supported Functions Registry

---

## 📊 Complete API Reference

### Advanced Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `gradient(func, vars)` | Calculate gradient vector | `gradient(f, ['x', 'y'])` |
| `hessian(func, vars)` | Calculate Hessian matrix | `hessian(f, ['x', 'y'])` |
| `tangentPlane(func, x0, y0)` | Tangent plane to surface | `tangentPlane(f, 1, 2)` |
| `tangentLine(func, x0)` | Tangent line to curve | `tangentLine(f, 1)` |
| `surfaceNormal(func, point)` | Surface normal vector | `surfaceNormal(f, {x:1,y:0,z:0})` |
| `findCriticalPoints(func, vars)` | Find critical points | `findCriticalPoints(f, ['x', 'y'])` |
| `classifyCriticalPoint(func, point)` | Classify critical point | `classifyCriticalPoint(f, point)` |
| `findExtrema(func, vars, bounds)` | Find local extrema | `findExtrema(f, ['x'], bounds)` |
| `findGlobalExtrema(func, vars, bounds)` | Find global extrema | `findGlobalExtrema(f, ['x'], bounds)` |
| `lagrangeMultipliers(func, constraints, vars)` | Constrained optimization | `lagrangeMultipliers(f, [g], ['x', 'y'])` |
| `directionalDerivative(func, point, direction)` | Directional derivative | `directionalDerivative(f, point, dir)` |
| `steepestDirections(func, point)` | Steepest ascent/descent | `steepestDirections(f, point)` |
| `tangentToLatex(tangent)` | Convert tangent to LaTeX | `tangentToLatex(tangent)` |

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

---

## 💡 Usage Patterns

### Pattern 1: Multivariable Surface Analysis
```javascript
// Analyze surface z = x² + y²
const surface = { terms: [createTerm(1, {x: 2}), createTerm(1, {y: 2})] };

// Find tangent plane at point
const tangent = tangentPlane(surface, 1, 2);
console.log('Tangent plane:', tangentToLatex(tangent));

// Calculate gradient
const grad = gradient(surface, ['x', 'y']);
console.log('Gradient:', grad);

// Find critical points
const critical = findCriticalPoints(surface, ['x', 'y']);
```

### Pattern 2: Optimization Problem
```javascript
// Optimize f(x,y) = x² - y² subject to x² + y² = 1
const objective = { terms: [createTerm(1, {x: 2}), createTerm(-1, {y: 2})] };
const constraint = { terms: [createTerm(1, {x: 2}), createTerm(1, {y: 2}), createTerm(-1)] };

// Use Lagrange multipliers
const result = lagrangeMultipliers(objective, [constraint], ['x', 'y']);
console.log('Constrained extrema:', result);
```

### Pattern 3: Directional Analysis
```javascript
// Analyze directional derivatives of f(x,y) = x² + y²
const func = { terms: [createTerm(1, {x: 2}), createTerm(1, {y: 2})] };
const point = { x: 1, y: 1 };
const direction = { x: 1, y: 1 };

// Calculate directional derivative
const dirDeriv = directionalDerivative(func, point, direction);

// Find steepest directions
const steepest = steepestDirections(func, point);
console.log('Steepest ascent:', steepest.steepest_ascent);
console.log('Steepest descent:', steepest.steepest_descent);
```

---

## 🎯 Real-World Applications

### Physics: Surface Analysis
```javascript
// Analyze temperature distribution T(x,y) = x² + 2xy + y²
const temperature = { terms: [createTerm(1, {x: 2}), createTerm(2, {x: 1, y: 1}), createTerm(1, {y: 2})] };

// Find heat flux (gradient)
const heatFlux = gradient(temperature, ['x', 'y']);

// Find hottest/coldest points
const extrema = findExtrema(temperature, ['x', 'y']);
```

### Engineering: Optimization
```javascript
// Minimize surface area of cylinder with volume constraint
// Use Lagrange multipliers to solve constrained optimization
const surfaceArea = { terms: [createTerm(2, {r: 2}), createTerm(2, {r: 1, h: 1})] };
const volumeConstraint = { terms: [createTerm(1, {r: 2, h: 1}), createTerm(-V)] };
const result = lagrangeMultipliers(surfaceArea, [volumeConstraint], ['r', 'h']);
```

### Economics: Multivariable Optimization
```javascript
// Maximize profit P(x,y) = 10x + 8y - x² - y² - xy
const profit = { terms: [createTerm(10, {x: 1}), createTerm(8, {y: 1}), createTerm(-1, {x: 2}), createTerm(-1, {y: 2}), createTerm(-1, {x: 1, y: 1})] };

// Find optimal production levels
const critical = findCriticalPoints(profit, ['x', 'y']);
critical.forEach(point => {
    const classification = classifyCriticalPoint(profit, point.variables);
    console.log(`Production levels: ${JSON.stringify(point.variables)}, Type: ${classification}`);
});
```

---

## 🏗️ Project Structure

### Core Modules
```
slang-math/
├── slang-math.js          # Central exports only
├── slang-basic.js          # Core SLaNg structures
├── slang-extended.js       # Advanced mathematical functions
├── slang-convertor.js      # LaTeX conversion system
├── slang-advanced.js       # Advanced algorithms
├── slang-helpers.js        # Utility functions
└── experiments/            # Test suite
    ├── slang-extended-test.js  # Comprehensive testing
    └── test-converter.js       # Converter testing
```

---

## 🔥 What Makes SLaNg Special?

✨ **Complete Multivariable Calculus** - Tangent planes, gradients, optimization  
🧮 **Advanced Mathematical Functions** - Surface analysis, constrained optimization  
📐 **Professional Code Organization** - Clean modular structure  
🔄 **LaTeX Integration** - Bidirectional conversion with validation  
🧪 **Comprehensive Testing** - 10 test categories with full coverage  
📊 **Educational Focus** - See the math, not just the answer  
🚀 **Production Ready** - Robust error handling and performance  

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or sharing ideas, your help makes SLaNg better for everyone.

### 🎯 How to Contribute

#### 🐛 Report Bugs
- Found an issue? [Open a bug report](https://github.com/SENODROOM/SLaNg/issues)
- Include: description, steps to reproduce, expected vs actual behavior
- Add code examples and error messages

#### 💡 Request Features
- Have an idea? [Open a feature request](https://github.com/SENODROOM/SLaNg/issues)
- Describe the use case and why it would be valuable
- Consider if it fits the library's scope and goals

#### 🔧 Submit Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with clear, documented code
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Submit a pull request with a clear description

#### 📚 Improve Documentation
- Fix typos or unclear explanations
- Add examples and use cases
- Improve API documentation
- Create tutorials and guides

### 🛠️ Development Setup
```bash
# Clone repository
git clone https://github.com/SENODROOM/SLaNg.git
cd slang-math

# Install development dependencies
npm install

# Run tests
npm test

# Run specific test suites
node experiments/slang-extended-test.js
node experiments/test-converter.js

# Start development
npm run dev
```

### 📋 Contribution Guidelines

#### Code Style
- Use clear, descriptive variable names
- Add JSDoc comments for new functions
- Follow existing code patterns and structure
- Keep functions focused and modular

#### Testing
- Add tests for all new functionality
- Ensure 95%+ test coverage
- Test edge cases and error conditions
- Include performance tests for significant changes

#### Documentation
- Update README for major features
- Add inline code comments
- Include examples in function documentation
- Update API reference as needed

### 🎯 Current Priorities
We're looking for help with:

1. **🔢 Matrix Operations** - Linear algebra functions
2. **⚖️ Symbolic Equation Solving** - Root finding and solving systems
3. **📈 Advanced Integration** - More numerical integration techniques
4. **🌐 Web Interface** - Interactive visualization tools
5. **📝 TypeScript Definitions** - Better IDE support
6. **🧪 Performance Optimization** - Speed improvements
7. **📚 Educational Content** - Tutorials and examples
8. **🔍 Validation System** - Enhanced input validation

### 💬 Get Involved

#### 🗣️ Discussion
- Join our [GitHub Discussions](https://github.com/SENODROOM/SLaNg/discussions)
- Ask questions, share ideas, get help
- Participate in planning and design discussions

#### 📢 Share Your Work
- Show us what you're building with SLaNg
- Share examples and use cases
- Contribute to our collection of demos

#### 🏆 Recognition
- All contributors are credited in our contributors list
- Significant contributions are highlighted in release notes
- Outstanding contributors may be invited as maintainers

### 📄 License

By contributing to SLaNg, you agree that your contributions will be licensed under the same MIT License as the project.

---

## 🙏 Acknowledgments

Special thanks to everyone who has contributed to making SLaNg a powerful mathematical library:

- **Contributors** who fix bugs and add features
- **Users** who provide feedback and report issues
- **Educators** who use SLaNg in their teaching
- **Researchers** who push the boundaries of what's possible
- **Developers** who build amazing things with SLaNg

---

## 📞 Quick Links

### Getting Started
- **📖 README**: This file
- **🧪 Run Tests**: `node experiments/slang-extended-test.js`
- **🔄 Conversion Demo**: `node slang-convertor.js`
- **🧮 Extended Demo**: `node slang-extended.js`

### Community
- **💬 Discussions**: [GitHub Discussions](https://github.com/SENODROOM/SLaNg/discussions)
- **🐛 Report Issues**: [GitHub Issues](https://github.com/SENODROOM/SLaNg/issues)
- **💡 Request Features**: [Feature Requests](https://github.com/SENODROOM/SLaNg/issues)
- **🔧 Pull Requests**: [Contributing Guide](CONTRIBUTING.md)

### Development
- **🧪 Test Extended Functions**: `node experiments/slang-extended-test.js`
- **🧪 Test Converter**: `node experiments/test-converter.js`
- **📊 Performance**: `npm run benchmark`
- **🔧 Lint Code**: `npm run lint`

---

## 🎉 Thank You!

**SLaNg** represents a powerful approach to symbolic mathematics in JavaScript. Whether you're a student learning multivariable calculus, a researcher needing computational tools, or a developer building educational software, SLaNg provides the power, flexibility, and reliability you need.

**Happy Computing! 🚀**

## 📊 Quick Reference Card

| Need to... | Use... | File |
|------------|--------|------|
| Create polynomial | `polynomial([2,1,0], 'x')` | slang-helpers.js |
| Create rational | `createFraction(numi, deno)` | slang-basic.js |
| Calculate gradient | `gradient(f, ['x','y'])` | slang-extended.js |
| Find tangent plane | `tangentPlane(f, x0, y0)` | slang-extended.js |
| Find critical points | `findCriticalPoints(f, ['x','y'])` | slang-extended.js |
| Lagrange multipliers | `lagrangeMultipliers(f, [g], ['x','y'])` | slang-extended.js |
| Directional derivative | `directionalDerivative(f, point, dir)` | slang-extended.js |
| Evaluate | `evaluateFraction(f, {x:3})` | slang-basic.js |
| Differentiate | `differentiateFraction(f, 'x')` | slang-basic.js |
| Integrate (numeric) | `numericalIntegrateFraction(...)` | slang-basic.js |
| Simplify | `simplifyFraction(f)` | slang-basic.js |
| Convert to LaTeX | `slangToLatex(f)` | slang-convertor.js |
| Parse LaTeX | `latexToSlang(latex)` | slang-convertor.js |

---

**Total Lines of Code**: ~3,000+  
**Total Features**: 85+  
**Dependencies**: 0  

---

<div align="center">

**Made with ❤️ for the mathematical community**

**Advanced multivariable calculus capabilities!** 🧮✨

[⭐ Star us on GitHub](https://github.com/SENODROOM/SLaNg) • [🐛 Report Bug](https://github.com/SENODROOM/SLaNg/issues) • [💡 Request Feature](https://github.com/SENODROOM/SLaNg/issues)

**Happy Calculating!** 📊🚀

</div>
