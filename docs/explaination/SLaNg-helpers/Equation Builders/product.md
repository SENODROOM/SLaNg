# product

Create a product of polynomial expressions (multiply multiple polynomials together).

## The Formula

factor₁ × factor₂ × factor₃ × ... × factorₙ

## The Code

```js
/**
 * Create a product of polynomials
 * @param {Array} factors - Array of polynomial fractions
 * 
 * Example: product([[1+x], [1-x]]) creates (1+x)(1-x)
 */
function product(...factors) {
    // Convert each factor array to fraction format
    const fractions = factors.map(factor => {
        if (Array.isArray(factor[0][0]?.numi?.terms)) {
            return factor[0][0]; // Already a fraction
        }
        return createFraction(factor.map(([c, p]) => createTerm(c, p)), 1);
    });

    return [fractions];
}
```

## Line-by-Line Explanation

```js
function product(...factors) {
```
- **`...factors`** — Rest parameter, accepts any number of arguments
- Each argument is a polynomial expression (equation format)
- Example: `product(poly1, poly2, poly3)` multiplies three polynomials
- Returns them in product form (not expanded)

```js
    const fractions = factors.map(factor => {
```
- **`map`** — Transform each factor into fraction format
- Loop through all input polynomials
- Convert each to internal fraction representation

```js
        if (Array.isArray(factor[0][0]?.numi?.terms)) {
```
- **Check if already a fraction** — Test if factor is in proper SLaNg format
- **`factor[0][0]`** — Access the fraction from equation format `[[fraction]]`
- **`?.numi?.terms`** — Optional chaining to check structure
- **`Array.isArray`** — Verify it has terms array

```js
            return factor[0][0]; // Already a fraction
```
- If it's already in proper format, extract and return the fraction
- No conversion needed

```js
        }
        return createFraction(factor.map(([c, p]) => createTerm(c, p)), 1);
```
- **Conversion for simple format** — If factor is in `[[coeff, powers]]` format
- **`factor.map(([c, p]) => createTerm(c, p))`** — Convert pairs to terms
- **`createFraction(..., 1)`** — Wrap terms in fraction with denominator 1

```js
    });
```
- End of map function
- Result: array of fraction objects

```js
    return [fractions];
```
- Wrap fractions array in product array
- Returns `[fraction₁, fraction₂, ...]` format
- This represents multiplication: fraction₁ × fraction₂ × ...

## How It Works

The function creates a product by:

1. **Accept Factors**: Take multiple polynomial arguments
2. **Check Format**: Determine if each is already a fraction or needs conversion
3. **Convert if Needed**: Transform simple format to fraction format
4. **Combine**: Put all fractions in product array
5. **Return**: Product representation (unevaluated)

**Key Point**: Returns product form, not expanded. Use `expandProduct` to multiply out.

## Usage Examples

### Simple Product (Two Linear Factors)

```js
// (x + 1)(x - 1) = x² - 1
const factor1 = sum([[1, {x:1}], [1, {}]]);  // x + 1
const factor2 = sum([[1, {x:1}], [-1, {}]]); // x - 1

const prod = product(factor1, factor2);

// To expand:
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 5 });
console.log(result); // 25 - 1 = 24
```

**Breakdown**:
- `factor1` = x + 1
- `factor2` = x - 1
- `prod` = unevaluated product
- `expanded` = x² - 1

### Three Factors

```js
// (x)(x+1)(x+2)
const f1 = sum([[1, {x:1}]]);                // x
const f2 = sum([[1, {x:1}], [1, {}]]);       // x + 1
const f3 = sum([[1, {x:1}], [2, {}]]);       // x + 2

const prod = product(f1, f2, f3);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 3 });
console.log(result); // 3 × 4 × 5 = 60
```

### Perfect Square

```js
// (x + 2)² = (x + 2)(x + 2)
const factor = sum([[1, {x:1}], [2, {}]]);   // x + 2

const prod = product(factor, factor);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 3 });
console.log(result); // (3 + 2)² = 25
```

**Expanded form**: x² + 4x + 4

### Difference of Squares Pattern

```js
// (a + b)(a - b) = a² - b²
const sum_form = sum([[1, {a:1}], [1, {b:1}]]);      // a + b
const diff_form = sum([[1, {a:1}], [-1, {b:1}]]);    // a - b

const prod = product(sum_form, diff_form);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { a: 5, b: 3 });
console.log(result); // 25 - 9 = 16
```

### Quadratic Times Linear

```js
// (x² + 2x + 1)(x - 3)
const quadratic = sum([[1, {x:2}], [2, {x:1}], [1, {}]]);  // x² + 2x + 1
const linear = sum([[1, {x:1}], [-3, {}]]);                 // x - 3

const prod = product(quadratic, linear);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 4 });
console.log(result);
// (16 + 8 + 1)(4 - 3) = 25 × 1 = 25
```

**Expanded**: x³ - x² - 5x - 3

### Four Factors

```js
// (x-1)(x-2)(x-3)(x-4)
const f1 = sum([[1, {x:1}], [-1, {}]]);
const f2 = sum([[1, {x:1}], [-2, {}]]);
const f3 = sum([[1, {x:1}], [-3, {}]]);
const f4 = sum([[1, {x:1}], [-4, {}]]);

const prod = product(f1, f2, f3, f4);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 5 });
console.log(result); // 4 × 3 × 2 × 1 = 24
```

### Binomial Cubed

```js
// (x + 1)³ = (x + 1)(x + 1)(x + 1)
const binomial = sum([[1, {x:1}], [1, {}]]);

const prod = product(binomial, binomial, binomial);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 2 });
console.log(result); // (2 + 1)³ = 27
```

**Expanded**: x³ + 3x² + 3x + 1

### Two Variable Product

```js
// (x + y)(x - y)
const f1 = sum([[1, {x:1}], [1, {y:1}]]);    // x + y
const f2 = sum([[1, {x:1}], [-1, {y:1}]]);   // x - y

const prod = product(f1, f2);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 5, y: 3 });
console.log(result); // 25 - 9 = 16
```

**Expanded**: x² - y²

### Conjugate Multiplication

```js
// (a + 2)(a - 2)
const f1 = sum([[1, {a:1}], [2, {}]]);
const f2 = sum([[1, {a:1}], [-2, {}]]);

const prod = product(f1, f2);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { a: 10 });
console.log(result); // 100 - 4 = 96
```

### Monomial Times Polynomial

```js
// 3x(x² + 2x + 1) = 3x³ + 6x² + 3x
const monomial = sum([[3, {x:1}]]);                          // 3x
const poly = sum([[1, {x:2}], [2, {x:1}], [1, {}]]);        // x² + 2x + 1

const prod = product(monomial, poly);
const expanded = expandProduct(prod[0]);

const result = evaluateEquation([[expanded]], { x: 2 });
console.log(result); // 24 + 24 + 6 = 54
```

## Step-by-Step Example

Let's create (x + 2)(x + 3):

```js
const f1 = sum([[1, {x:1}], [2, {}]]);
const f2 = sum([[1, {x:1}], [3, {}]]);

const prod = product(f1, f2);
```

**Step by step:**

1. **Input factors**:
   - f1: `[[{numi: {terms: [...x+2...]}, deno: 1}]]`
   - f2: `[[{numi: {terms: [...x+3...]}, deno: 1}]]`

2. **Map iteration 1** (f1):
   - Check: `f1[0][0]?.numi?.terms` exists? Yes
   - Return: `f1[0][0]` (the fraction for x+2)

3. **Map iteration 2** (f2):
   - Check: `f2[0][0]?.numi?.terms` exists? Yes
   - Return: `f2[0][0]` (the fraction for x+3)

4. **Create fractions array**:
   ```js
   [
     {numi: {...x+2...}, deno: 1},
     {numi: {...x+3...}, deno: 1}
   ]
   ```

5. **Wrap in array**:
   - Return: `[fractions]`
   - This represents: (x+2) × (x+3)

6. **To expand**:
   ```js
   const expanded = expandProduct(prod[0]);
   // Results in: x² + 5x + 6
   ```

**Verify at x=4**:
- (4+2)(4+3) = 6 × 7 = 42
- 4² + 5(4) + 6 = 16 + 20 + 6 = 42 ✓

## Mathematical Background

### Product of Polynomials

When multiplying polynomials, distribute each term:

(a + b)(c + d) = ac + ad + bc + bd

For general polynomials:
(Σ aᵢxⁱ)(Σ bⱼxʲ) = Σᵢ Σⱼ aᵢbⱼxⁱ⁺ʲ

### Special Products

**Square of Binomial**:
- (a + b)² = a² + 2ab + b²
- (a - b)² = a² - 2ab + b²

**Difference of Squares**:
- (a + b)(a - b) = a² - b²

**Cube of Binomial**:
- (a + b)³ = a³ + 3a²b + 3ab² + b³

**Sum/Difference of Cubes**:
- (a + b)(a² - ab + b²) = a³ + b³
- (a - b)(a² + ab + b²) = a³ - b³

### Factored vs Expanded Form

**Factored**: (x-1)(x-2)(x-3)
- Easy to find roots: x = 1, 2, 3
- Compact representation

**Expanded**: x³ - 6x² + 11x - 6
- Standard polynomial form
- Easy to evaluate
- Shows degree and coefficients

## Dependencies

This function requires:
- **`createFraction`** — To wrap terms in fraction structure
- **`createTerm`** — To create individual terms

## Why Use This?

This function is useful for:

- **Preserving Structure**: Keep factored form before expansion
- **Multiple Factors**: Multiply many polynomials at once
- **Delayed Expansion**: Choose when to expand
- **Symbolic Manipulation**: Work with factored expressions
- **Root Finding**: Factored form shows roots directly

## Real-World Applications

### Physics: Factored Equations

```js
// F = ma where a = (v - v₀)/t
// F = m(v - v₀)/t
// Keep factored to see relationship

const mass = sum([[2, {m:1}]]);                    // m
const velocity_diff = sum([[1, {v:1}], [-10, {}]]); // v - v₀

const force_factor = product(mass, velocity_diff);
// Represents m(v - v₀) before dividing by t
```

### Economics: Revenue Function

```js
// R = p × q where p = (100 - q)
// R = q(100 - q) = 100q - q²

const quantity = sum([[1, {q:1}]]);
const price = sum([[100, {}], [-1, {q:1}]]);

const revenue = product(quantity, price);
const expanded = expandProduct(revenue[0]);

const R = evaluateEquation([[expanded]], { q: 30 });
console.log('Revenue:', R); // 30 × 70 = 2100
```

### Engineering: Polynomial Filters

```js
// Transfer function: H(s) = (s + z₁)(s + z₂) / (s + p₁)(s + p₂)
// Numerator in factored form

const zero1 = sum([[1, {s:1}], [2, {}]]);   // s + 2
const zero2 = sum([[1, {s:1}], [5, {}]]);   // s + 5

const numerator = product(zero1, zero2);
// Keep factored to see zeros at s = -2, -5
```

### Mathematics: Polynomial Roots

```js
// If roots are 1, 2, 3, then:
// P(x) = (x-1)(x-2)(x-3)

const f1 = sum([[1, {x:1}], [-1, {}]]);
const f2 = sum([[1, {x:1}], [-2, {}]]);
const f3 = sum([[1, {x:1}], [-3, {}]]);

const poly = product(f1, f2, f3);
// Factored form clearly shows roots
```

## Combining with Other Operations

### Expand Then Differentiate

```js
// d/dx[(x+1)(x+2)]
const f1 = sum([[1, {x:1}], [1, {}]]);
const f2 = sum([[1, {x:1}], [2, {}]]);

const prod = product(f1, f2);
const expanded = expandProduct(prod[0]);

const derivative = differentiateFraction(expanded, 'x');

const result = evaluateEquation([[derivative]], { x: 3 });
console.log(result); // 2x + 3 at x=3 → 2(3) + 3 = 9
```

### Integrate Product

```js
// ∫(x)(x+1)dx
const f1 = sum([[1, {x:1}]]);
const f2 = sum([[1, {x:1}], [1, {}]]);

const prod = product(f1, f2);
const expanded = expandProduct(prod[0]); // x² + x

const integral = integrateFraction(expanded, 'x');
// Result: x³/3 + x²/2
```

### Evaluate Without Expanding

```js
// Can evaluate product directly without expanding
const f1 = sum([[1, {x:1}], [2, {}]]);
const f2 = sum([[1, {x:1}], [3, {}]]);

const prod = product(f1, f2);

// Evaluate product form
const result = evaluateProduct(prod[0], { x: 5 });
console.log(result); // (5+2)(5+3) = 7 × 8 = 56
```

## Pattern Recognition

### Factoring Quadratics

```js
// x² + 5x + 6 = (x + 2)(x + 3)
const factored = product(
    sum([[1, {x:1}], [2, {}]]),
    sum([[1, {x:1}], [3, {}]])
);

const expanded = expandProduct(factored[0]);
// Confirms: x² + 5x + 6
```

### Perfect Square Trinomial

```js
// x² + 6x + 9 = (x + 3)²
const factor = sum([[1, {x:1}], [3, {}]]);
const square = product(factor, factor);

const expanded = expandProduct(square[0]);
// x² + 6x + 9
```

### Difference of Squares

```js
// x² - 9 = (x + 3)(x - 3)
const f1 = sum([[1, {x:1}], [3, {}]]);
const f2 = sum([[1, {x:1}], [-3, {}]]);

const prod = product(f1, f2);
const expanded = expandProduct(prod[0]);
// x² - 9
```

## Performance Notes

- **Time complexity**: O(n) where n = number of factors
- Very fast - just packages factors together
- No multiplication performed until `expandProduct` is called
- Efficient for keeping factored form

## Limitations

1. **No Automatic Expansion**: Returns product form
   - Must explicitly call `expandProduct` to multiply out

2. **Format Requirements**: Factors must be in equation format
   - Need to create with `sum`, `polynomial`, or similar

3. **No Simplification**: Doesn't simplify or combine factors
   - `product(f, f, f)` keeps as three separate factors

4. **Memory for Large Products**: Stores all factors separately
   - Many factors can use memory

## Tips and Best Practices

### Keep Factored When Possible

```js
// Factored form is often more useful
const factored = product(f1, f2, f3);

// Only expand when needed for evaluation or further operations
const expanded = expandProduct(factored[0]);
```

### Use for Root Analysis

```js
// Roots are obvious in factored form
// (x-2)(x-5)(x+3) has roots: 2, 5, -3
const poly = product(
    sum([[1, {x:1}], [-2, {}]]),
    sum([[1, {x:1}], [-5, {}]]),
    sum([[1, {x:1}], [3, {}]])
);
```

### Build Complex Products Incrementally

```js
// Build step by step
const f1 = sum([[1, {x:1}], [1, {}]]);
const f2 = sum([[1, {x:1}], [2, {}]]);

let prod = product(f1, f2);

// Add more factors later if needed
const f3 = sum([[1, {x:1}], [3, {}]]);
prod = product(...prod[0], f3);
```

### Document What Each Factor Represents

```js
const demand = sum([[100, {}], [-2, {p:1}]]);        // q = 100 - 2p
const price = sum([[1, {p:1}]]);                      // p

const revenue = product(price, demand);               // R = p·q
```