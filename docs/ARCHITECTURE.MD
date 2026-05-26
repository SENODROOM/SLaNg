# SLaNg Math Library - Architecture & Flow

## 📐 Library Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                            │
│                  (Your Exercise 15.1, etc.)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HELPER LAYER                                 │
│                  (slang-helpers.js)                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  polynomial  │  │  sum         │  │ integralValue│           │
│  │  Easy create │  │  Easy create │  │  One-liner   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │volumeUnder   │  │ areaOfRegion │  │verification  │           │
│  │  Surface     │  │              │  │   tools      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CORE LAYER                                  │
│                   (slang-math.js)                               │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│    │ createTerm   │  │ integrate    │  │ differentiate│         │
│    │ createFrac   │  │ Fraction     │  │  Fraction    │         │
│    └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│    │ evaluate     │  │ expand       │  │  simplify    │         │
│    │ Equation     │  │ Product      │  │  Fraction    │         │
│    └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ADVANCED LAYER                                │
│                 (slang-advanced.js)                             │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│    │ product      │  │ quotient     │  │ integration  │         │
│    │ Rule         │  │ Rule         │  │ by Parts     │         │
│    └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│    │ Taylor       │  │ critical     │  │ gradient     │         │
│    │ Series       │  │ Points       │  │ & directional│         │
│    └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐                           │
│    │ arc          │  │ surface      │                           │
│    │ Length       │  │ Area         │                           │
│    └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example

### Example: Computing ∫₀² ∫₀³ xy dy dx

```
USER CODE:
  integralValue(xy, {x: [0,2], y: [0,3]})
                │
                ▼
HELPER LAYER (slang-helpers.js):
  integralOverRegion(xy, bounds)
    │
    ├─ Loop through variables
    │  │
    │  ├─ For y: definiteIntegrateFraction(xy, 0, 3, 'y')
    │  │                     │
    │  │                     ▼
    │  │          CORE LAYER (slang-math.js):
    │  │            definiteIntegrateTerm for each term
    │  │              │
    │  │              ├─ integrateTerm(term, 'y')  // xy → xy²/2
    │  │              │                             │
    │  │              │                             ▼
    │  │              │                  Power rule: n → n+1, coeff/(n+1)
    │  │              │
    │  │              ├─ Evaluate at bounds
    │  │              │  Upper: y=3 → coefficient * 3²
    │  │              │  Lower: y=0 → coefficient * 0²
    │  │              │  Difference: gets multiplied into coefficient
    │  │              │
    │  │              └─ Remove 'y' variable, keep 'x'
    │  │
    │  │         Result: 4.5x
    │  │
    │  └─ For x: definiteIntegrateFraction(4.5x, 0, 2, 'x')
    │                     │
    │                     ▼
    │          CORE LAYER:
    │            Similar process
    │              │
    │              └─ Result: 9
    │
    └─ simplifyFraction(result)
                │
                ▼
    evaluateEquation([[result]], {})
                │
                ▼
             RETURN: 9
```

## 🏗️ SLaNg Notation Structure

```
EQUATION (Top level - Array)
│
├─ PRODUCT 1 (Array)  ────────────────┐
│  │                                  │
│  ├─ FRACTION 1                      │ Products are summed
│  │  ├─ numerator (numi)             │ (a)(b) + (c)(d) + ...
│  │  │  └─ terms (Array)             │
│  │  │     ├─ TERM 1 ───┐            │
│  │  │     │  ├─ coeff  │            │
│  │  │     │  └─ var {} │            │
│  │  │     │            Terms        │
│  │  │     ├─ TERM 2    are added    │
│  │  │     │  ├─ coeff  │            │
│  │  │     │  └─ var {} │            │
│  │  │     │            ▼            │
│  │  │     └─ TERM 3   Sum           │
│  │  │        ├─ coeff               │
│  │  │        └─ var {}              │
│  │  │                               │
│  │  └─ denominator (deno)           │
│  │     └─ number                    │
│  │                                  │
│  └─ FRACTION 2 ──┐                  │
│     ├─ numi      │ Fractions        │
│     └─ deno      │ are multiplied   │
│                  ▼                  │
│               Product               │
│                                     │
├─ PRODUCT 2 ─────────────────────────┤
│  └─ ...                             │
│                                     │
└─ PRODUCT N ─────────────────────────┘
```

## 🎯 Operation Flow Diagrams

### Integration Flow

```
INPUT: Expression + bounds + variable
                │
                ▼
      ┌─────────────────┐
      │  Deep Clone     │  (Prevent mutation)
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ For each term:  │
      │  Apply power    │
      │  rule           │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Evaluate at     │
      │ upper bound     │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Evaluate at     │
      │ lower bound     │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Subtract:       │
      │ upper - lower   │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Remove variable │
      │ from term       │
      └─────────────────┘
                │
                ▼
         OUTPUT: Result
```

### Differentiation Flow

```
INPUT: Expression + variable
                │
                ▼
      ┌─────────────────┐
      │  Deep Clone     │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ For each term:  │
      │                 │
      │ If var absent:  │
      │   return 0      │
      │                 │
      │ If var present: │
      │   coeff *= pow  │
      │   pow -= 1      │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Simplify:       │
      │ Remove zeros    │
      │ Combine terms   │
      └─────────────────┘
                │
                ▼
         OUTPUT: Result
```

### Expansion Flow (FOIL)

```
INPUT: (a + b)(c + d)
                │
                ▼
      ┌─────────────────┐
      │  Nested loop:   │
      │                 │
      │  For each term  │
      │  in first ()    │
      │    For each     │
      │    term in      │
      │    second ()    │
      │      Multiply   │
      │      terms      │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Collect all     │
      │ products:       │
      │  a*c            │
      │  a*d            │
      │  b*c            │
      │  b*d            │
      └─────────────────┘
                │
                ▼
      ┌─────────────────┐
      │ Combine like    │
      │ terms           │
      └─────────────────┘
                │
                ▼
   OUTPUT: ac + ad + bc + bd
```

## 📊 Complexity Analysis

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Create term | O(1) | Just object creation |
| Evaluate term | O(v) | v = number of variables |
| Differentiate | O(n) | n = number of terms |
| Integrate | O(n) | Linear in terms |
| Expand (a+b)(c+d) | O(nm) | n, m = terms in each |
| Simplify | O(n²) | Comparing all pairs |
| Definite integral | O(n) | Plus evaluation |

### Space Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| Store expression | O(n) | n = number of terms |
| Deep clone | O(n) | Duplicate all data |
| Expansion | O(nm) | New terms created |

## 🔍 Design Patterns Used

### 1. **Builder Pattern**
```javascript
polynomial([1, -2, 1], 'x')  // Builds complex structure simply
```

### 2. **Strategy Pattern**
```javascript
// Different integration strategies
definiteIntegrateFraction()   // Numerical bounds
integrateFraction()           // Symbolic
```

### 3. **Visitor Pattern**
```javascript
// Operations "visit" each term
terms.map(term => differentiateTerm(term, var))
```

### 4. **Immutability Pattern**
```javascript
deepClone(obj)  // Always work on copies
```

## 🎨 Code Organization Principles

1. **Separation of Concerns**
   - Core: Basic operations
   - Helpers: Convenience functions
   - Advanced: Complex algorithms

2. **Single Responsibility**
   - Each function does ONE thing
   - Clear, focused purpose

3. **DRY (Don't Repeat Yourself)**
   - `deepClone` used everywhere
   - `evaluateEquation` reused
   - Helper builders reduce duplication

4. **Progressive Enhancement**
   - Start with core
   - Add helpers
   - Layer advanced features

## 🚀 Performance Tips

1. **Use helpers**: They're optimized
2. **Simplify often**: Reduces term count
3. **Clone wisely**: Only when needed (but library does this for you)
4. **Cache results**: Don't recompute same integrals
5. **Increase steps carefully**: More steps = slower but more accurate

## 📈 Scalability

The library scales well for:
- ✓ Polynomials up to degree ~20
- ✓ ~100 terms per expression
- ✓ Double/triple integrals
- ✓ Functions of 2-3 variables

For larger problems:
- Consider breaking into smaller parts
- Use numerical methods
- Cache intermediate results

---

This architecture provides a solid foundation for symbolic mathematics
while remaining simple enough to understand and extend!