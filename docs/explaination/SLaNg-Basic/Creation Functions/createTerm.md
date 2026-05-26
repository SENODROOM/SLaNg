# createTerm 

A utility function to create mathematical terms with coefficients and variables.

## The Code

```js
/**
 * Create a term with coefficient and optional variables
 * @param {number} coeff - Coefficient
 * @param {Object} vars - Variables object like {x: 2, y: 1}
 */
function createTerm(coeff, vars = {}) {
    const term = { coeff };
    if (Object.keys(vars).length > 0) {
        term.var = { ...vars };
    }
    return term;
}
```

## How It Works

The function creates a mathematical term object with:

1. **`coeff`** — The coefficient (number multiplying the variables)
2. **`var`** — An object representing variables and their exponents (optional)

The spread operator `{ ...vars }` creates a shallow copy of the variables object to avoid unintended mutations.

## Usage Examples

### Constant Term (no variables)

```js
const term1 = createTerm(5);
console.log(term1);
// { coeff: 5 }
// Represents: 5
```

### Single Variable Term

```js
const term2 = createTerm(3, { x: 1 });
console.log(term2);
// { coeff: 3, var: { x: 1 } }
// Represents: 3x
```

### Term with Exponent

```js
const term3 = createTerm(2, { x: 2 });
console.log(term3);
// { coeff: 2, var: { x: 2 } }
// Represents: 2x²
```

### Multiple Variables

```js
const term4 = createTerm(4, { x: 2, y: 1 });
console.log(term4);
// { coeff: 4, var: { x: 2, y: 1 } }
// Represents: 4x²y
```

### Negative Coefficient

```js
const term5 = createTerm(-7, { x: 3 });
console.log(term5);
// { coeff: -7, var: { x: 3 } }
// Represents: -7x³
```

## Why Use This?

This function is useful for:

- Building polynomial representations
- Symbolic math operations
- Creating algebra systems
- Representing mathematical expressions in code

## Example Use Case

Building a polynomial:

```js
// Create polynomial: 3x² + 2x - 5
const polynomial = [
    createTerm(3, { x: 2 }),   // 3x²
    createTerm(2, { x: 1 }),   // 2x
    createTerm(-5)              // -5
];

console.log(polynomial);
// [
//   { coeff: 3, var: { x: 2 } },
//   { coeff: 2, var: { x: 1 } },
//   { coeff: -5 }
// ]
```

## Object Structure

### Returned Object Format

```js
{
    coeff: number,      // Required: the coefficient
    var: {              // Optional: only if variables exist
        varName: exponent,
        ...
    }
}
```

### Examples

| Input | Output | Mathematical Notation |
|-------|--------|---------------------|
| `createTerm(5)` | `{ coeff: 5 }` | 5 |
| `createTerm(3, {x: 1})` | `{ coeff: 3, var: {x: 1} }` | 3x |
| `createTerm(2, {x: 2})` | `{ coeff: 2, var: {x: 2} }` | 2x² |
| `createTerm(4, {x: 2, y: 1})` | `{ coeff: 4, var: {x: 2, y: 1} }` | 4x²y |

## Why the Spread Operator?

```js
term.var = { ...vars };
```

This creates a **shallow copy** of the variables object to prevent accidental mutation:

```js
const myVars = { x: 2 };
const term = createTerm(5, myVars);

// Modify the original
myVars.x = 10;

console.log(term.var.x); // Still 2 (protected from mutation)
```