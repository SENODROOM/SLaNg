# formatDisplayMode

Formats LaTeX expressions for inline or display mode.

## Purpose
Automatically format LaTeX with appropriate delimiters based on content complexity.

## Features
- Auto-detection of display needs
- Forced mode options
- Smart formatting rules
- Multiple delimiter support

## Usage
```js
const inline = formatDisplayMode('x^{2} + 1', { preferInline: true });
// Returns: '$x^{2} + 1$'

const display = formatDisplayMode('\\frac{x}{y}', { forceDisplay: true });
// Returns: '$$\\frac{x}{y}$$'
```
