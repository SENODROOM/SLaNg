# fractionToString

Convert a fraction object to a human-readable string representation.

## The Code

```js
/**
 * Convert fraction to readable string
 */
function fractionToString(fraction) {
    const numi = fraction.numi.terms.map(termToString).join(' + ');

    if (fraction.deno === 1) {
        return `(${numi})`;
    }

    return `(${numi})/(${fraction.deno})`;
}
```

## Line-by-Line Explanation

```js
function fractionToString(fraction) {
```
- **`fraction`** — A fraction object with `numi` (numerator) and `deno` (denominator)

```js
    const numi = fraction.numi.terms.map(termToString).join(' + ');
```
- Convert all numerator terms to strings and join them
- **`fraction.numi.terms`** — Array of term objects
- **`.map(termToString)`** — Convert each term to string using `termToString`
- **`.join(' + ')`** — Join all term strings with ` + ` separator
- Example: `["3*x^2", "2*x", "5"]` → `"3*x^2 + 2*x + 5"`

```js
    if (fraction.deno === 1) {
```
- Check if denominator is 1
- For denominator = 1, we don't need to show the division

```js
        return `(${numi})`;
```
- Return just the numerator in parentheses
- **Template literal**: Wraps numerator in `()` 
- Example: `"(3*x^2 + 2*x + 5)"`

```js
    }
```
- Close the if statement

```js
    return `(${numi})/(${fraction.deno})`;
```
- Return full fraction notation with numerator and denominator
- **Format**: `(numerator)/(denominator)`
- Example: `"(3*x^2 + 2*x)/(2)"`

```js
}
```
- Close the function

## How It Works

The function creates a string representation by:

1. Converting each term in the numerator to a string
2. Joining all terms with ` + ` 
3. If denominator = 1, return `(numerator)`
4. Otherwise, return `(numerator)/(denominator)`

**Format**: 
- Polynomial: `(term1 + term2 + term3)`
- Fraction: `(term1 + term2)/(denominator)`

## Usage Examples

### Simple Polynomial (deno = 1)

```js
const numerator = [createTerm(3, { x: 2 })];
const fraction = createFraction(numerator, 1);

const result = fractionToString(fraction);

console.log(result);
// "(3*x^2)"
```

### Polynomial with Multiple Terms

```js
const numerator = [
    createTerm(2, { x: 2 }),
    createTerm(3, { x: 1 }),
    createTerm(5)
];
const fraction = createFraction(numerator, 1);

const result = fractionToString(fraction);

console.log(result);
// "(2*x^2 + 3*x + 5)"
```

### Simple Fraction

```js
const numerator = [createTerm(1, { x: 1 })];
const fraction = createFraction(numerator, 2);

const result = fractionToString(fraction);

console.log(result);
// "(1*x)/(2)"
```

### Fraction with Multiple Numerator Terms

```js
const numerator = [
    createTerm(3, { x: 2 }),
    createTerm(2, { x: 1 }),
    createTerm(1)
];
const fraction = createFraction(numerator, 4);

const result = fractionToString(fraction);

console.log(result);
// "(3*x^2 + 2*x + 1)/(4)"
```

### Constant

```js
const numerator = [createTerm(7)];
const fraction = createFraction(numerator, 1);

const result = fractionToString(fraction);

console.log(result);
// "(7)"
```

### Constant Fraction

```js
const numerator = [createTerm(3)];
const fraction = createFraction(numerator, 4);

const result = fractionToString(fraction);

console.log(result);
// "(3)/(4)"
// Represents 3/4
```

### Multiple Variables

```js
const numerator = [
    createTerm(6, { x: 2, y: 1 }),
    createTerm(3, { y: 2 })
];
const fraction = createFraction(numerator, 2);

const result = fractionToString(fraction);

console.log(result);
// "(6*x^2*y + 3*y^2)/(2)"
```

### Single Term Numerator

```js
const numerator = [createTerm(5, { x: 1 })];
const fraction = createFraction(numerator, 3);

const result = fractionToString(fraction);

console.log(result);
// "(5*x)/(3)"
```

### Negative Terms

```js
const numerator = [
    createTerm(3, { x: 2 }),
    createTerm(-2, { x: 1 }),
    createTerm(1)
];
const fraction = createFraction(numerator, 1);

const result = fractionToString(fraction);

console.log(result);
// "(3*x^2 + -2*x + 1)"
// Note: Shows "+ -2*x" which could be improved to "- 2*x"
```

## String Format Examples

| Fraction | String Output | Mathematical |
|----------|---------------|--------------|
| `{numi: [3x²], deno: 1}` | `"(3*x^2)"` | 3x² |
| `{numi: [2x, 3], deno: 1}` | `"(2*x + 3)"` | 2x + 3 |
| `{numi: [x], deno: 2}` | `"(1*x)/(2)"` | x/2 |
| `{numi: [x², 2x, 1], deno: 4}` | `"(1*x^2 + 2*x + 1)/(4)"` | (x² + 2x + 1)/4 |
| `{numi: [5], deno: 3}` | `"(5)/(3)"` | 5/3 |

## Why Always Use Parentheses?

```js
return `(${numi})`;
// or
return `(${numi})/(${fraction.deno})`;
```

**Parentheses ensure correct interpretation**:

Without parentheses:
```
2*x + 3/2  // Ambiguous: (2x + 3)/2 or 2x + (3/2)?
```

With parentheses:
```
(2*x + 3)/(2)  // Clear: the whole numerator divided by 2
```

## Issue with Negative Signs

The current implementation shows negative terms as `+ -`:

```js
// Current output:
"3*x^2 + -2*x + 1"

// Better output would be:
"3*x^2 - 2*x + 1"
```

**Potential improvement** (not in original code):
```js
const terms = fraction.numi.terms.map(termToString);
let numi = terms[0];
for (let i = 1; i < terms.length; i++) {
    if (terms[i].startsWith('-')) {
        numi += ' ' + terms[i];  // "- 2*x"
    } else {
        numi += ' + ' + terms[i];  // "+ 3*x"
    }
}
```

## Empty Numerator

If numerator has no terms (shouldn't normally occur):

```js
const fraction = { numi: { terms: [] }, deno: 1 };
fractionToString(fraction);
// "()"
```

## Use Cases

This function is useful for:

- Displaying fractions in readable format
- Debugging fraction objects
- Logging mathematical operations
- Showing intermediate calculation steps
- Converting to calculator-style input
- Educational tools for teaching fractions
- Testing fraction creation and manipulation

## Comparison with Mathematical Notation

| Code Output | Mathematical Notation |
|-------------|---------------------|
| `"(3*x^2 + 2*x + 1)"` | 3x² + 2x + 1 |
| `"(x + 2)/(3)"` | (x + 2)/3 |
| `"(5)/(4)"` | 5/4 or 1.25 |

## Dependencies

This function requires:
- **`termToString`** — To convert each term in the numerator to a string

## Why Use This?

This function is useful for:

- Displaying fractions in human-readable format
- Debugging and logging
- Showing results to users
- Converting internal representation to text
- Educational tools showing algebraic fractions
- Verifying fraction structure
- Generating calculator-compatible expressions