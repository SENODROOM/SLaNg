# evaluateTerm

Evaluate a mathematical term at given variable values.

## The Code

```js
/**
 * Evaluate a term at given variable values
 * @param {Object} term - A single term
 * @param {Object} values - Variable values like {x: 2, y: 3}
 */
function evaluateTerm(term, values) {
    let result = term.coeff;

    if (term.var) {
        for (let [variable, power] of Object.entries(term.var)) {
            if (values[variable] === undefined) {
                throw new Error(`Variable ${variable} not provided`);
            }
            result *= Math.pow(values[variable], power);
        }
    }

    return result;
}
```

## Line-by-Line Explanation

```js
function evaluateTerm(term, values) {
```
- **`term`** — A term object with `coeff` and optional `var` properties
- **`values`** — An object containing variable values (e.g., `{x: 2, y: 3}`)

```js
    let result = term.coeff;
```
- Initialize `result` with the coefficient
- This is the starting value before applying variable calculations

```js
    if (term.var) {
```
- Check if the term has variables
- If no variables exist, the function just returns the coefficient

```js
        for (let [variable, power] of Object.entries(term.var)) {
```
- Loop through each variable in the term
- **`Object.entries(term.var)`** — Converts `{x: 2, y: 1}` to `[['x', 2], ['y', 1]]`
- **`[variable, power]`** — Destructures each entry into variable name and its exponent

```js
            if (values[variable] === undefined) {
```
- Check if the required variable value was provided
- Ensures all necessary values are present before calculation

```js
                throw new Error(`Variable ${variable} not provided`);
```
- Throw an error if a variable value is missing
- Helps catch mistakes early rather than producing incorrect results

```js
            }
            result *= Math.pow(values[variable], power);
```
- **`Math.pow(values[variable], power)`** — Raises the variable value to its power
- **`result *=`** — Multiplies the result by this calculated value
- Example: For `x²` with `x=3`: `result *= Math.pow(3, 2)` → `result *= 9`

```js
        }
    }
```
- Close the for loop and if statement

```js
    return result;
```
- Return the final calculated value

```js
}
```
- Close the function

## How It Works

The function evaluates a term by:

1. Starting with the coefficient
2. For each variable in the term:
   - Check if its value is provided
   - Calculate: value raised to the power
   - Multiply the result by this value
3. Return the final result

**Formula**: `coefficient × (x^power_x) × (y^power_y) × ...`

## Usage Examples

### Constant Term (no variables)

```js
const term = createTerm(5);
const result = evaluateTerm(term, {});

console.log(result); // 5
// Calculation: 5
```

### Single Variable

```js
const term = createTerm(3, { x: 1 });
const result = evaluateTerm(term, { x: 4 });

console.log(result); // 12
// Calculation: 3 × 4¹ = 12
```

### Variable with Exponent

```js
const term = createTerm(2, { x: 2 });
const result = evaluateTerm(term, { x: 3 });

console.log(result); // 18
// Calculation: 2 × 3² = 2 × 9 = 18
```

### Multiple Variables

```js
const term = createTerm(4, { x: 2, y: 1 });
const result = evaluateTerm(term, { x: 3, y: 5 });

console.log(result); // 180
// Calculation: 4 × 3² × 5¹ = 4 × 9 × 5 = 180
```

### Negative Coefficient

```js
const term = createTerm(-2, { x: 3 });
const result = evaluateTerm(term, { x: 2 });

console.log(result); // -16
// Calculation: -2 × 2³ = -2 × 8 = -16
```

### Zero Exponent

```js
const term = createTerm(7, { x: 0 });
const result = evaluateTerm(term, { x: 999 });

console.log(result); // 7
// Calculation: 7 × 999⁰ = 7 × 1 = 7
```

## Error Handling

### Missing Variable Value

```js
const term = createTerm(3, { x: 2, y: 1 });

try {
    evaluateTerm(term, { x: 5 }); // y is missing!
} catch (error) {
    console.log(error.message); // "Variable y not provided"
}
```

The function throws an error if any required variable value is missing.

## Step-by-Step Example

Let's evaluate the term `6x²y` at `x=2, y=3`:

```js
const term = createTerm(6, { x: 2, y: 1 });
const result = evaluateTerm(term, { x: 2, y: 3 });
```

**Step by step:**
1. `result = 6` (coefficient)
2. For `x` with power `2`:
   - `Math.pow(2, 2) = 4`
   - `result = 6 × 4 = 24`
3. For `y` with power `1`:
   - `Math.pow(3, 1) = 3`
   - `result = 24 × 3 = 72`
4. Return `72`

**Mathematical verification**: `6 × 2² × 3 = 6 × 4 × 3 = 72` ✓

## Why Use This?

This function is useful for:

- Evaluating polynomial expressions
- Substituting values into algebraic terms
- Building calculators for mathematical expressions
- Testing mathematical formulas with specific inputs
- Numerical analysis and computation