# parseNumber

Parses various number formats from LaTeX strings.

## Purpose
Convert number strings like "3.14", "-2.5e-3", "+" into JavaScript numbers.

## Features
- Integer and decimal parsing
- Scientific notation support
- Special sign handling (+, -)
- Implicit coefficient detection

## Usage
```js
const num = parseNumber('2.5e-3');
// Returns: 0.0025
```
