/**
 * SLaNg Symbolic Engine
 * 
 * Adds symbolic (non-numeric) computation support to SLaNg:
 *  - Symbolic constants (pi, e, inf)
 *  - Trigonometric functions (sin, cos, tan, sec, csc, cot)
 *  - Exponential and logarithmic functions (exp, ln, log)
 *  - Hyperbolic functions (sinh, cosh, tanh)
 *  - Inverse trig (asin, acos, atan)
 *  - Symbolic differentiation rules for all of the above
 *  - Symbolic integration rules for common forms
 *  - Expression simplification with trig identities
 *  - LaTeX rendering for function expressions
 * 
 * SLaNg Function Expression Format:
 *   { type: 'fn', name: 'sin', arg: <expr> }
 *   { type: 'fn', name: 'ln',  arg: <expr> }
 *   { type: 'add', left: <expr>, right: <expr> }
 *   { type: 'mul', left: <expr>, right: <expr> }
 *   { type: 'pow', base: <expr>, exp: <expr> }
 *   { type: 'const', value: number }
 *   { type: 'var', name: string }
 *   { type: 'neg', arg: <expr> }
 */

// ============================================================================
// SYMBOLIC CONSTANTS
// ============================================================================

export const PI  = { type: 'const', value: Math.PI,  symbol: '\\pi'  };
export const E   = { type: 'const', value: Math.E,   symbol: 'e'     };
export const INF = { type: 'const', value: Infinity,  symbol: '\\infty' };

// ============================================================================
// EXPRESSION BUILDERS
// ============================================================================

export function symConst(value) {
    return { type: 'const', value };
}

export function symVar(name) {
    return { type: 'var', name };
}

export function symFn(name, arg) {
    return { type: 'fn', name, arg };
}

export function symAdd(left, right) {
    return { type: 'add', left, right };
}

export function symSub(left, right) {
    return { type: 'add', left, right: symNeg(right) };
}

export function symMul(left, right) {
    return { type: 'mul', left, right };
}

export function symDiv(top, bot) {
    return { type: 'div', top, bot };
}

export function symPow(base, exp) {
    return { type: 'pow', base, exp };
}

export function symNeg(arg) {
    return { type: 'neg', arg };
}

// Convenience constructors
export const sin   = arg => symFn('sin',  arg);
export const cos   = arg => symFn('cos',  arg);
export const tan   = arg => symFn('tan',  arg);
export const sec   = arg => symFn('sec',  arg);
export const csc   = arg => symFn('csc',  arg);
export const cot   = arg => symFn('cot',  arg);
export const asin  = arg => symFn('asin', arg);
export const acos  = arg => symFn('acos', arg);
export const atan  = arg => symFn('atan', arg);
export const sinh  = arg => symFn('sinh', arg);
export const cosh  = arg => symFn('cosh', arg);
export const tanh  = arg => symFn('tanh', arg);
export const ln    = arg => symFn('ln',   arg);
export const log10 = arg => symFn('log10',arg);
export const exp   = arg => symFn('exp',  arg);
export const sqrt  = arg => symFn('sqrt', arg);
export const abs   = arg => symFn('abs',  arg);

// ============================================================================
// SYMBOLIC EVALUATION
// ============================================================================

const FN_EVAL = {
    sin:   Math.sin,
    cos:   Math.cos,
    tan:   Math.tan,
    sec:   x => 1 / Math.cos(x),
    csc:   x => 1 / Math.sin(x),
    cot:   x => Math.cos(x) / Math.sin(x),
    asin:  Math.asin,
    acos:  Math.acos,
    atan:  Math.atan,
    sinh:  Math.sinh,
    cosh:  Math.cosh,
    tanh:  Math.tanh,
    ln:    Math.log,
    log10: Math.log10,
    exp:   Math.exp,
    sqrt:  Math.sqrt,
    abs:   Math.abs,
};

/**
 * Evaluate a symbolic expression numerically at a given point.
 * @param {Object} expr - Symbolic expression
 * @param {Object} vars - Variable substitutions, e.g. { x: 2, y: 3 }
 * @returns {number}
 */
export function symEval(expr, vars = {}) {
    switch (expr.type) {
        case 'const': return expr.value;
        case 'var': {
            if (!(expr.name in vars)) throw new Error(`Variable ${expr.name} not provided`);
            return vars[expr.name];
        }
        case 'neg':  return -symEval(expr.arg, vars);
        case 'add':  return symEval(expr.left, vars) + symEval(expr.right, vars);
        case 'mul':  return symEval(expr.left, vars) * symEval(expr.right, vars);
        case 'div':  return symEval(expr.top, vars) / symEval(expr.bot, vars);
        case 'pow':  return Math.pow(symEval(expr.base, vars), symEval(expr.exp, vars));
        case 'fn': {
            const evalFn = FN_EVAL[expr.name];
            if (!evalFn) throw new Error(`Unknown function: ${expr.name}`);
            return evalFn(symEval(expr.arg, vars));
        }
        default: throw new Error(`Unknown expression type: ${expr.type}`);
    }
}

// ============================================================================
// SYMBOLIC DIFFERENTIATION
// ============================================================================

/**
 * Symbolically differentiate an expression with respect to a variable.
 * Applies chain rule, product rule, quotient rule automatically.
 * @param {Object} expr - Symbolic expression
 * @param {string} variable - Differentiation variable
 * @returns {Object} Derivative expression (not simplified)
 */
export function symDiff(expr, variable) {
    switch (expr.type) {
        case 'const': return symConst(0);

        case 'var':
            return expr.name === variable ? symConst(1) : symConst(0);

        case 'neg':
            return symNeg(symDiff(expr.arg, variable));

        case 'add':
            return symAdd(symDiff(expr.left, variable), symDiff(expr.right, variable));

        case 'mul': {
            // Product rule: (uv)' = u'v + uv'
            const du = symDiff(expr.left, variable);
            const dv = symDiff(expr.right, variable);
            return symAdd(
                symMul(du, expr.right),
                symMul(expr.left, dv)
            );
        }

        case 'div': {
            // Quotient rule: (u/v)' = (u'v - uv') / v²
            const du = symDiff(expr.top, variable);
            const dv = symDiff(expr.bot, variable);
            return symDiv(
                symSub(symMul(du, expr.bot), symMul(expr.top, dv)),
                symPow(expr.bot, symConst(2))
            );
        }

        case 'pow': {
            const base = expr.base;
            const expE = expr.exp;

            // Check if exponent is constant (power rule)
            if (expE.type === 'const') {
                const n = expE.value;
                // n * base^(n-1) * base'
                const db = symDiff(base, variable);
                return symMul(
                    symMul(symConst(n), symPow(base, symConst(n - 1))),
                    db
                );
            }

            // General case: d/dx [f(x)^g(x)] = f^g * (g'*ln(f) + g*f'/f)
            const df = symDiff(base, variable);
            const dg = symDiff(expE, variable);
            return symMul(
                expr,
                symAdd(
                    symMul(dg, ln(base)),
                    symDiv(symMul(expE, df), base)
                )
            );
        }

        case 'fn': {
            const u = expr.arg;
            const du = symDiff(u, variable); // chain rule inner derivative

            // d/dx f(u) = f'(u) * u'
            const outerDeriv = _fnDerivative(expr.name, u);
            return symMul(outerDeriv, du);
        }

        default:
            throw new Error(`Cannot differentiate expression type: ${expr.type}`);
    }
}

/**
 * Returns the derivative of f(u) with respect to u (outer derivative only).
 */
function _fnDerivative(name, u) {
    switch (name) {
        case 'sin':   return cos(u);
        case 'cos':   return symNeg(sin(u));
        case 'tan':   return symPow(sec(u), symConst(2));
        case 'sec':   return symMul(sec(u), tan(u));
        case 'csc':   return symNeg(symMul(csc(u), cot(u)));
        case 'cot':   return symNeg(symPow(csc(u), symConst(2)));
        case 'asin':  return symDiv(symConst(1), sqrt(symSub(symConst(1), symPow(u, symConst(2)))));
        case 'acos':  return symNeg(symDiv(symConst(1), sqrt(symSub(symConst(1), symPow(u, symConst(2))))));
        case 'atan':  return symDiv(symConst(1), symAdd(symConst(1), symPow(u, symConst(2))));
        case 'sinh':  return cosh(u);
        case 'cosh':  return sinh(u);
        case 'tanh':  return symSub(symConst(1), symPow(tanh(u), symConst(2)));
        case 'ln':    return symDiv(symConst(1), u);
        case 'log10': return symDiv(symConst(1), symMul(ln(symConst(10)), u));
        case 'exp':   return exp(u);
        case 'sqrt':  return symDiv(symConst(1), symMul(symConst(2), sqrt(u)));
        case 'abs':   // sign function — not symbolic here
            return symDiv(u, abs(u));
        default:
            throw new Error(`Unknown function derivative: ${name}`);
    }
}

// ============================================================================
// SYMBOLIC INTEGRATION (common forms)
// ============================================================================

/**
 * Attempt symbolic integration of expr with respect to variable.
 * Handles common forms. Returns null if unable to integrate symbolically.
 * @param {Object} expr
 * @param {string} variable
 * @returns {Object|null} Antiderivative (without +C) or null
 */
export function symIntegrate(expr, variable) {
    // ∫ c dx = c*x
    if (expr.type === 'const') {
        return symMul(expr, symVar(variable));
    }

    // ∫ x dx = x²/2 (simple variable)
    if (expr.type === 'var' && expr.name === variable) {
        return symDiv(symPow(symVar(variable), symConst(2)), symConst(2));
    }

    // ∫ x^n dx = x^(n+1)/(n+1)
    if (expr.type === 'pow' && expr.base.type === 'var' && expr.base.name === variable
        && expr.exp.type === 'const' && expr.exp.value !== -1) {
        const n = expr.exp.value;
        return symDiv(
            symPow(symVar(variable), symConst(n + 1)),
            symConst(n + 1)
        );
    }

    // ∫ 1/x dx = ln|x|
    if (expr.type === 'div' && expr.top.type === 'const' && expr.top.value === 1
        && expr.bot.type === 'var' && expr.bot.name === variable) {
        return ln(abs(symVar(variable)));
    }

    // ∫ sin(x) dx = -cos(x)
    if (expr.type === 'fn' && expr.name === 'sin' && _isVar(expr.arg, variable)) {
        return symNeg(cos(symVar(variable)));
    }
    // ∫ cos(x) dx = sin(x)
    if (expr.type === 'fn' && expr.name === 'cos' && _isVar(expr.arg, variable)) {
        return sin(symVar(variable));
    }
    // ∫ tan(x) dx = -ln|cos(x)|
    if (expr.type === 'fn' && expr.name === 'tan' && _isVar(expr.arg, variable)) {
        return symNeg(ln(abs(cos(symVar(variable)))));
    }
    // ∫ sec²(x) dx = tan(x)
    if (expr.type === 'pow' && expr.base.type === 'fn' && expr.base.name === 'sec'
        && _isVar(expr.base.arg, variable) && expr.exp.type === 'const' && expr.exp.value === 2) {
        return tan(symVar(variable));
    }
    // ∫ exp(x) dx = exp(x)
    if (expr.type === 'fn' && expr.name === 'exp' && _isVar(expr.arg, variable)) {
        return exp(symVar(variable));
    }
    // ∫ sinh(x) dx = cosh(x)
    if (expr.type === 'fn' && expr.name === 'sinh' && _isVar(expr.arg, variable)) {
        return cosh(symVar(variable));
    }
    // ∫ cosh(x) dx = sinh(x)
    if (expr.type === 'fn' && expr.name === 'cosh' && _isVar(expr.arg, variable)) {
        return sinh(symVar(variable));
    }
    // ∫ 1/sqrt(1-x²) dx = asin(x)
    // ∫ 1/(1+x²) dx = atan(x)
    if (expr.type === 'div' && expr.top.type === 'const' && expr.top.value === 1) {
        const d = expr.bot;
        if (d.type === 'add') {
            const isOnePlusX2 =
                (d.left.type === 'const' && d.left.value === 1
                    && d.right.type === 'pow' && _isVar(d.right.base, variable) && d.right.exp.value === 2) ||
                (d.right.type === 'const' && d.right.value === 1
                    && d.left.type === 'pow' && _isVar(d.left.base, variable) && d.left.exp.value === 2);
            if (isOnePlusX2) return atan(symVar(variable));
        }
    }

    // Addition: ∫(f + g) = ∫f + ∫g
    if (expr.type === 'add') {
        const intLeft  = symIntegrate(expr.left,  variable);
        const intRight = symIntegrate(expr.right, variable);
        if (intLeft && intRight) return symAdd(intLeft, intRight);
        return null;
    }

    // Scalar multiple: ∫ c*f = c * ∫f
    if (expr.type === 'mul' && expr.left.type === 'const') {
        const inner = symIntegrate(expr.right, variable);
        if (inner) return symMul(expr.left, inner);
        return null;
    }
    if (expr.type === 'mul' && expr.right.type === 'const') {
        const inner = symIntegrate(expr.left, variable);
        if (inner) return symMul(expr.right, inner);
        return null;
    }

    return null; // Unable to integrate symbolically
}

function _isVar(expr, variable) {
    return expr.type === 'var' && expr.name === variable;
}

// ============================================================================
// EXPRESSION SIMPLIFICATION
// ============================================================================

/**
 * Apply basic simplification rules to a symbolic expression.
 * Constant folding, identity elimination, etc.
 * @param {Object} expr
 * @returns {Object} Simplified expression
 */
export function symSimplify(expr) {
    if (!expr) return expr;

    switch (expr.type) {
        case 'const':
        case 'var':
            return expr;

        case 'neg': {
            const a = symSimplify(expr.arg);
            if (a.type === 'const') return symConst(-a.value);
            if (a.type === 'neg')   return a.arg; // --x = x
            return symNeg(a);
        }

        case 'add': {
            const l = symSimplify(expr.left);
            const r = symSimplify(expr.right);
            if (l.type === 'const' && r.type === 'const') return symConst(l.value + r.value);
            if (l.type === 'const' && l.value === 0) return r;
            if (r.type === 'const' && r.value === 0) return l;
            return symAdd(l, r);
        }

        case 'mul': {
            const l = symSimplify(expr.left);
            const r = symSimplify(expr.right);
            if (l.type === 'const' && r.type === 'const') return symConst(l.value * r.value);
            if (l.type === 'const' && l.value === 0) return symConst(0);
            if (r.type === 'const' && r.value === 0) return symConst(0);
            if (l.type === 'const' && l.value === 1) return r;
            if (r.type === 'const' && r.value === 1) return l;
            if (l.type === 'const' && l.value === -1) return symNeg(r);
            if (r.type === 'const' && r.value === -1) return symNeg(l);
            return symMul(l, r);
        }

        case 'div': {
            const t = symSimplify(expr.top);
            const b = symSimplify(expr.bot);
            if (t.type === 'const' && b.type === 'const') return symConst(t.value / b.value);
            if (t.type === 'const' && t.value === 0) return symConst(0);
            if (b.type === 'const' && b.value === 1) return t;
            return symDiv(t, b);
        }

        case 'pow': {
            const base = symSimplify(expr.base);
            const e    = symSimplify(expr.exp);
            if (base.type === 'const' && e.type === 'const') return symConst(Math.pow(base.value, e.value));
            if (e.type === 'const' && e.value === 0) return symConst(1);
            if (e.type === 'const' && e.value === 1) return base;
            if (base.type === 'const' && base.value === 1) return symConst(1);
            return symPow(base, e);
        }

        case 'fn': {
            const a = symSimplify(expr.arg);
            // Constant folding for functions
            if (a.type === 'const') {
                const fn = FN_EVAL[expr.name];
                if (fn) return symConst(fn(a.value));
            }
            return symFn(expr.name, a);
        }

        default:
            return expr;
    }
}

// ============================================================================
// LATEX RENDERING
// ============================================================================

/**
 * Convert a symbolic expression to LaTeX string.
 * @param {Object} expr
 * @param {Object} opts
 * @returns {string}
 */
export function symToLatex(expr, opts = {}) {
    switch (expr.type) {
        case 'const': {
            if (expr.symbol) return expr.symbol;
            // Format nicely: avoid floating-point ugliness for common fractions
            const v = expr.value;
            if (Number.isInteger(v)) return v.toString();
            // Try to represent as fraction
            const frac = _toNiceFraction(v);
            return frac || v.toPrecision(6).replace(/\.?0+$/, '');
        }
        case 'var': return expr.name;
        case 'neg': {
            const inner = symToLatex(expr.arg, opts);
            return `-${_wrapIfNeeded(expr.arg, inner)}`;
        }
        case 'add': {
            const l = symToLatex(expr.left,  opts);
            const r = symToLatex(expr.right, opts);
            // If right is negation, show as subtraction
            if (expr.right.type === 'neg') {
                return `${l} - ${symToLatex(expr.right.arg, opts)}`;
            }
            return `${l} + ${r}`;
        }
        case 'mul': {
            const l = symToLatex(expr.left,  opts);
            const r = symToLatex(expr.right, opts);
            const lParen = _needsMulParen(expr.left)  ? `\\left(${l}\\right)` : l;
            const rParen = _needsMulParen(expr.right) ? `\\left(${r}\\right)` : r;
            // Omit \cdot when right side is a variable or function
            if (expr.right.type === 'var' || expr.right.type === 'fn') {
                return `${lParen} ${rParen}`;
            }
            return `${lParen} \\cdot ${rParen}`;
        }
        case 'div':
            return `\\frac{${symToLatex(expr.top, opts)}}{${symToLatex(expr.bot, opts)}}`;
        case 'pow': {
            const b = symToLatex(expr.base, opts);
            const e = symToLatex(expr.exp,  opts);
            const bStr = _needsPowParen(expr.base) ? `\\left(${b}\\right)` : b;
            return `${bStr}^{${e}}`;
        }
        case 'fn': {
            const argLatex = symToLatex(expr.arg, opts);
            return _fnToLatex(expr.name, argLatex);
        }
        default:
            return '?';
    }
}

function _fnToLatex(name, argLatex) {
    const map = {
        sin:   `\\sin\\!\\left(${argLatex}\\right)`,
        cos:   `\\cos\\!\\left(${argLatex}\\right)`,
        tan:   `\\tan\\!\\left(${argLatex}\\right)`,
        sec:   `\\sec\\!\\left(${argLatex}\\right)`,
        csc:   `\\csc\\!\\left(${argLatex}\\right)`,
        cot:   `\\cot\\!\\left(${argLatex}\\right)`,
        asin:  `\\arcsin\\!\\left(${argLatex}\\right)`,
        acos:  `\\arccos\\!\\left(${argLatex}\\right)`,
        atan:  `\\arctan\\!\\left(${argLatex}\\right)`,
        sinh:  `\\sinh\\!\\left(${argLatex}\\right)`,
        cosh:  `\\cosh\\!\\left(${argLatex}\\right)`,
        tanh:  `\\tanh\\!\\left(${argLatex}\\right)`,
        ln:    `\\ln\\!\\left(${argLatex}\\right)`,
        log10: `\\log_{10}\\!\\left(${argLatex}\\right)`,
        exp:   `e^{${argLatex}}`,
        sqrt:  `\\sqrt{${argLatex}}`,
        abs:   `\\left|${argLatex}\\right|`,
    };
    return map[name] || `\\operatorname{${name}}\\!\\left(${argLatex}\\right)`;
}

function _wrapIfNeeded(expr, latex) {
    if (expr.type === 'add' || expr.type === 'mul') return `\\left(${latex}\\right)`;
    return latex;
}

function _needsMulParen(expr) {
    return expr.type === 'add' || expr.type === 'neg';
}

function _needsPowParen(expr) {
    return expr.type !== 'const' && expr.type !== 'var' && expr.type !== 'fn';
}

function _toNiceFraction(v) {
    for (let d = 2; d <= 12; d++) {
        const n = Math.round(v * d);
        if (Math.abs(n / d - v) < 1e-12) {
            return `\\frac{${n}}{${d}}`;
        }
    }
    return null;
}

// ============================================================================
// NUMERICAL INTEGRATION (for symbolic expressions)
// ============================================================================

/**
 * Numerically integrate a symbolic expression over [a, b] using Simpson's rule.
 * Useful when symIntegrate returns null.
 * @param {Object} expr
 * @param {string} variable
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @param {number} n - Number of subintervals (must be even), default 1000
 * @returns {number}
 */
export function symNumericalIntegrate(expr, variable, a, b, n = 1000) {
    if (n % 2 !== 0) n++; // must be even for Simpson's
    const h = (b - a) / n;
    let sum = symEval(expr, { [variable]: a }) + symEval(expr, { [variable]: b });

    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += (i % 2 === 0 ? 2 : 4) * symEval(expr, { [variable]: x });
    }

    return (h / 3) * sum;
}

// ============================================================================
// HIGHER-ORDER DIFFERENTIATION
// ============================================================================

/**
 * Compute nth derivative of an expression.
 * @param {Object} expr
 * @param {string} variable
 * @param {number} n - Order (default 1)
 * @returns {Object} nth derivative (simplified)
 */
export function symNthDiff(expr, variable, n = 1) {
    let result = expr;
    for (let i = 0; i < n; i++) {
        result = symSimplify(symDiff(result, variable));
    }
    return result;
}

// ============================================================================
// TAYLOR / MACLAURIN SERIES
// ============================================================================

/**
 * Compute Taylor series expansion of a symbolic expression.
 * @param {Object} expr
 * @param {string} variable
 * @param {number} center - Point of expansion (a)
 * @param {number} terms - Number of terms (default 5)
 * @returns {{ polynomial: Object, coefficients: number[], latex: string }}
 */
export function symTaylorSeries(expr, variable, center = 0, terms = 5) {
    const coefficients = [];
    let current = expr;
    let factorial = 1;

    for (let n = 0; n < terms; n++) {
        if (n > 0) factorial *= n;
        try {
            const val = symEval(current, { [variable]: center });
            coefficients.push(val / factorial);
        } catch {
            coefficients.push(0);
        }
        if (n < terms - 1) {
            current = symSimplify(symDiff(current, variable));
        }
    }

    // Build latex string
    const parts = coefficients.map((c, n) => {
        if (Math.abs(c) < 1e-14) return null;
        const cStr = c === 1 ? '' : c === -1 ? '-' : _niceNum(c);
        if (n === 0) return _niceNum(c);
        const xPart = center === 0
            ? (n === 1 ? variable : `${variable}^{${n}}`)
            : (n === 1 ? `(${variable}-${center})` : `(${variable}-${center})^{${n}}`);
        return (c < 0 ? `${cStr}${xPart}` : `${cStr}${xPart}`);
    }).filter(Boolean);

    let latex = parts.join(' + ').replace(/\+ -/g, '- ');

    return {
        coefficients,
        latex: latex || '0',
        evaluate: (x) => coefficients.reduce((sum, c, n) => {
            return sum + c * Math.pow(x - center, n);
        }, 0)
    };
}

function _niceNum(v) {
    if (Number.isInteger(v)) return v.toString();
    const frac = _toNiceFraction(v);
    if (frac) return frac;
    return v.toPrecision(5).replace(/\.?0+$/, '');
}

// ============================================================================
// EXPRESSION EQUALITY CHECK
// ============================================================================

/**
 * Test if two symbolic expressions are numerically equivalent at random points.
 * @param {Object} expr1
 * @param {Object} expr2
 * @param {string[]} variables
 * @param {number} samples
 * @returns {boolean}
 */
export function symAreEqual(expr1, expr2, variables, samples = 20) {
    for (let i = 0; i < samples; i++) {
        const point = {};
        for (const v of variables) {
            point[v] = Math.random() * 4 + 0.5; // avoid 0 to prevent ln(0), 1/0, etc.
        }
        try {
            const v1 = symEval(expr1, point);
            const v2 = symEval(expr2, point);
            if (Math.abs(v1 - v2) > 1e-8 * (1 + Math.abs(v1))) return false;
        } catch {
            // If evaluation fails at a point, skip it
        }
    }
    return true;
}

// ============================================================================
// COMBINED SLANG + SYMBOLIC BRIDGE
// ============================================================================

/**
 * Convert a SLaNg fraction (polynomial form) to a symbolic expression.
 * Enables using symDiff / symIntegrate on legacy SLaNg fractions.
 * @param {Object} fraction - SLaNg fraction { numi: { terms }, deno }
 * @returns {Object} Symbolic expression
 */
export function slangToSym(fraction) {
    const numTerms = fraction.numi.terms.map(_slangTermToSym);
    const numerator = numTerms.reduce((acc, t) => acc ? symAdd(acc, t) : t, null) || symConst(0);

    if (fraction.deno === 1 || fraction.deno === undefined) {
        return numerator;
    }

    // Polynomial denominator
    if (typeof fraction.deno === 'object' && fraction.deno.terms) {
        const denTerms = fraction.deno.terms.map(_slangTermToSym);
        const denominator = denTerms.reduce((acc, t) => acc ? symAdd(acc, t) : t, null) || symConst(1);
        return symDiv(numerator, denominator);
    }

    return symDiv(numerator, symConst(fraction.deno));
}

function _slangTermToSym(term) {
    let result = symConst(term.coeff);
    if (term.var) {
        for (const [varName, power] of Object.entries(term.var)) {
            if (power === 1) {
                result = symMul(result, symVar(varName));
            } else {
                result = symMul(result, symPow(symVar(varName), symConst(power)));
            }
        }
    }
    return result;
}

// ============================================================================
// EXPORTS (named)
// ============================================================================

export {
    FN_EVAL,
};


// ============================================================================
// LIMITS  (L'Hôpital's Rule + two-sided approach)
// ============================================================================

/**
 * Compute lim_{variable → value} expr.
 * Tries direct substitution first, then L'Hôpital if 0/0 or ∞/∞.
 *
 * @param {Object} expr    SymExpr
 * @param {string} variable
 * @param {number} value   approach point (use Infinity for ∞)
 * @param {number} [maxHopital=5] max applications of L'Hôpital
 * @returns {{ limit: number|null, method: string, exists: boolean, leftLimit?: number, rightLimit?: number }}
 */
export function computeLimit(expr, variable, value, maxHopital = 5) {
    const eps = 1e-8;

    const _eval = x => {
        try { return symEval(expr, { [variable]: x }); } catch { return NaN; }
    };

    // Direct substitution
    if (isFinite(value)) {
        const v = _eval(value);
        if (isFinite(v)) return { limit: v, method: 'direct substitution', exists: true };
    }

    // Two-sided check
    const approach = isFinite(value) ? value : (value > 0 ? 1e15 : -1e15);
    const delta    = isFinite(value) ? eps   : 1e13;

    const left  = _eval(approach - delta);
    const right = _eval(approach + delta);

    if (isFinite(left) && isFinite(right) && Math.abs(left - right) < 1e-6 * (1 + Math.abs(left))) {
        return { limit: (left + right) / 2, method: 'two-sided approach', exists: true };
    }

    // L'Hôpital: only applicable for f/g form
    if (expr.type === 'div') {
        let top = expr.top, bot = expr.bot;
        for (let i = 0; i < maxHopital; i++) {
            const tVal = symEval(symSimplify(top), { [variable]: isFinite(value) ? value : 1e15 });
            const bVal = symEval(symSimplify(bot), { [variable]: isFinite(value) ? value : 1e15 });
            const indeterminate = (Math.abs(tVal) < 1e-6 && Math.abs(bVal) < 1e-6)
                               || (!isFinite(tVal) && !isFinite(bVal));
            if (!indeterminate) break;
            top = symSimplify(symDiff(top, variable));
            bot = symSimplify(symDiff(bot, variable));
            const candidate = symSimplify(symDiv(top, bot));
            const result = symEval(candidate, { [variable]: isFinite(value) ? value : 1e15 });
            if (isFinite(result)) {
                return { limit: result, method: `L'Hôpital (${i + 1} application${i > 0 ? 's' : ''})`, exists: true };
            }
        }
    }

    if (!isFinite(left) && !isFinite(right)) {
        const sign = left > 0 ? +Infinity : -Infinity;
        return { limit: sign, method: 'diverges', exists: false, leftLimit: left, rightLimit: right };
    }

    return { limit: null, method: 'left and right limits differ', exists: false, leftLimit: left, rightLimit: right };
}

// ============================================================================
// PARTIAL DIFFERENTIATION (multivariable symbolic)
// ============================================================================

/**
 * Compute all first-order partial derivatives of expr wrt each variable.
 * @param {Object} expr       SymExpr (may contain multiple variables)
 * @param {string[]} variables  e.g. ['x', 'y', 'z']
 * @returns {Object}  { x: SymExpr, y: SymExpr, ... }
 */
export function symGradient(expr, variables) {
    const result = {};
    for (const v of variables) {
        result[v] = symSimplify(symDiff(expr, v));
    }
    return result;
}

/**
 * Compute the Hessian matrix of second-order partials.
 * @param {Object} expr
 * @param {string[]} variables
 * @returns {Object[][]} 2-D array of SymExprs
 */
export function symHessian(expr, variables) {
    const n = variables.length;
    const H = Array.from({ length: n }, () => Array(n).fill(null));
    for (let i = 0; i < n; i++) {
        const fi = symSimplify(symDiff(expr, variables[i]));
        for (let j = 0; j < n; j++) {
            H[i][j] = symSimplify(symDiff(fi, variables[j]));
        }
    }
    return H;
}

/**
 * Evaluate symbolic gradient at a numeric point.
 * @param {Object} expr
 * @param {string[]} variables
 * @param {Object} point   e.g. { x: 1, y: 2 }
 * @returns {number[]}  gradient vector
 */
export function evalGradient(expr, variables, point) {
    return variables.map(v => symEval(symSimplify(symDiff(expr, v)), point));
}

/**
 * Evaluate symbolic Hessian at a numeric point.
 * @returns {number[][]}
 */
export function evalHessian(expr, variables, point) {
    return symHessian(expr, variables).map(row =>
        row.map(e => symEval(e, point))
    );
}

// ============================================================================
// CRITICAL POINTS (single variable, symbolic)
// ============================================================================

/**
 * Find critical points of expr where d/dx = 0 via numerical root finding.
 * @param {Object} expr    SymExpr
 * @param {string} variable
 * @param {number[]} [range=[-10,10]]
 * @param {number}  [samples=2000]
 * @returns {{ points: number[], classifications: Object[] }}
 */
export function symFindCriticalPoints(expr, variable, range = [-10, 10], samples = 2000) {
    const deriv  = symSimplify(symDiff(expr, variable));
    const deriv2 = symSimplify(symDiff(deriv, variable));
    const [lo, hi] = range;
    const step = (hi - lo) / samples;
    const roots = [];

    let prev = symEval(deriv, { [variable]: lo });
    for (let i = 1; i <= samples; i++) {
        const x = lo + i * step;
        let curr;
        try { curr = symEval(deriv, { [variable]: x }); } catch { prev = NaN; continue; }
        if (isFinite(prev) && isFinite(curr) && prev * curr < 0) {
            // Bisect
            let a = x - step, b = x;
            for (let k = 0; k < 52; k++) {
                const m = (a + b) / 2;
                const vm = symEval(deriv, { [variable]: m });
                if (Math.abs(vm) < 1e-12) { a = m; break; }
                (symEval(deriv, { [variable]: a }) * vm < 0) ? (b = m) : (a = m);
            }
            const root = (a + b) / 2;
            if (!roots.some(r => Math.abs(r - root) < 1e-6)) roots.push(root);
        }
        prev = curr;
    }

    const classifications = roots.map(pt => {
        const fVal  = symEval(expr,   { [variable]: pt });
        const d2Val = symEval(deriv2, { [variable]: pt });
        let type;
        if (d2Val > 1e-10)       type = 'local minimum';
        else if (d2Val < -1e-10) type = 'local maximum';
        else                     type = 'inflection or higher-order';
        return { x: pt, f: fVal, d2: d2Val, type };
    });

    return { points: roots, classifications };
}

// ============================================================================
// IMPLICIT DIFFERENTIATION
// ============================================================================

/**
 * Compute dy/dx for an implicit equation F(x, y) = 0.
 * Result: dy/dx = -∂F/∂x / ∂F/∂y
 *
 * @param {Object} F    SymExpr representing F(x,y)
 * @param {string} [xVar='x']
 * @param {string} [yVar='y']
 * @returns {Object}  SymExpr for dy/dx
 */
export function implicitDiff(F, xVar = 'x', yVar = 'y') {
    const Fx = symSimplify(symDiff(F, xVar));
    const Fy = symSimplify(symDiff(F, yVar));
    return symSimplify(symDiv(symNeg(Fx), Fy));
}

// ============================================================================
// CURVE ANALYSIS (inflection points, concavity, asymptotes)
// ============================================================================

/**
 * Full curve analysis on a single-variable SymExpr.
 * @param {Object} expr   SymExpr in terms of `variable`
 * @param {string} variable
 * @param {number[]} [range=[-10,10]]
 * @returns {{
 *   criticalPoints, derivative, secondDerivative,
 *   inflectionPoints, intervals, asymptotes
 * }}
 */
export function analyzeCurve(expr, variable, range = [-10, 10]) {
    const d1 = symSimplify(symDiff(expr, variable));
    const d2 = symSimplify(symDiff(d1,   variable));

    const { classifications } = symFindCriticalPoints(expr, variable, range);
    const inflectionData = symFindCriticalPoints(d1, variable, range);

    // Monotonicity intervals
    const testPoints = [];
    const allX = [-999, ...classifications.map(c => c.x), ...inflectionData.points, 999].sort((a, b) => a - b);
    for (let i = 0; i < allX.length - 1; i++) {
        const mid = (allX[i] + allX[i + 1]) / 2;
        let sign;
        try { sign = symEval(d1, { [variable]: mid }); } catch { continue; }
        testPoints.push({ from: allX[i], to: allX[i + 1], increasing: sign > 0 });
    }

    // Vertical asymptotes: sample many points for near-blow-up
    const asymptotes = [];
    const [lo, hi] = range;
    const step = (hi - lo) / 5000;
    let prevV = null;
    for (let i = 0; i <= 5000; i++) {
        const x = lo + i * step;
        let v; try { v = symEval(expr, { [variable]: x }); } catch { v = Infinity; }
        if (prevV !== null && isFinite(prevV) && !isFinite(v)) {
            asymptotes.push({ type: 'vertical', x });
        }
        prevV = v;
    }

    return {
        derivative: d1, secondDerivative: d2,
        criticalPoints: classifications,
        inflectionPoints: inflectionData.classifications.map(c => ({ x: c.x, f: symEval(expr, { [variable]: c.x }) })),
        intervals: testPoints,
        asymptotes,
    };
}


// ============================================================================
// INTEGRATION BY PARTS  (LIATE heuristic)
// ============================================================================

/**
 * Attempt integration by parts: ∫u·dv = u·v − ∫v·du
 * Uses LIATE ordering to choose u automatically.
 * Iterates up to maxDepth times to handle repeated integration by parts.
 *
 * Returns { result: SymExpr, steps: string[] } or null if unable.
 *
 * @param {Object} expr     product SymExpr  (type === 'mul')
 * @param {string} variable
 * @param {number} [maxDepth=3]
 */
export function integrationByParts(expr, variable, maxDepth = 3) {
    const steps = [];
    return _ibpRecurse(expr, variable, maxDepth, steps)
        ? { result: symSimplify(_ibpRecurse(expr, variable, maxDepth, steps)), steps }
        : null;
}

function _liateRank(e) {
    if (e.type === 'fn' && ['ln','log10','asin','acos','atan'].includes(e.name)) return 0; // L/I
    if (e.type === 'var') return 2;  // A (algebraic)
    if (e.type === 'pow' && e.base.type === 'var') return 2;
    if (e.type === 'fn' && ['sin','cos','tan'].includes(e.name)) return 3;  // T
    if (e.type === 'fn' && e.name === 'exp') return 4;                      // E
    if (e.type === 'const') return 5;
    return 1;
}

function _ibpRecurse(expr, variable, depth, steps) {
    if (depth === 0) return null;
    // We need a product. If not, wrap as 1·expr.
    let left = expr, right = { type: 'const', value: 1 };
    if (expr.type === 'mul') { left = expr.left; right = expr.right; }

    // Choose u and dv by LIATE
    const [u, dv] = _liateRank(left) <= _liateRank(right)
        ? [left,  right]
        : [right, left];

    // v = ∫dv dx
    const v = symIntegrate(dv, variable);
    if (!v) return null;

    // du = d/dx (u) dx
    const du = symSimplify(symDiff(u, variable));

    // ∫u·dv = u·v − ∫v·du
    const vDu = symSimplify(symMul(v, du));
    const vDuInt = symIntegrate(vDu, variable);

    steps.push(`u = ${symToLatex(u)},  dv = ${symToLatex(dv)}`);
    steps.push(`v = ${symToLatex(v)},  du = ${symToLatex(du)}`);

    if (vDuInt) {
        steps.push(`∫v·du = ${symToLatex(vDuInt)}`);
        return symSub(symMul(u, v), vDuInt);
    }

    // Try recursively if ∫v·du is itself a product
    if (vDu.type === 'mul') {
        const inner = _ibpRecurse(vDu, variable, depth - 1, steps);
        if (inner) return symSub(symMul(u, v), inner);
    }

    return null;
}

// ============================================================================
// PARTIAL FRACTION DECOMPOSITION (symbolic)
// ============================================================================

/**
 * Attempt partial fraction decomposition of a rational expression (top/bot).
 * Handles linear factors in the denominator up to degree 4.
 *
 * Algorithm:
 *   1. Find rational roots of denominator by rational root theorem + bisection
 *   2. For each root r: extract factor (x − r), compute residue A/(x−r)
 *   3. Return sum of partial fractions + irreducible remainder
 *
 * @param {Object} top    SymExpr numerator
 * @param {Object} bot    SymExpr denominator polynomial in `variable`
 * @param {string} variable
 * @returns {{ terms: Array<{coeff:number, root:number}>, remainder: Object|null, latex: string }}
 */
export function partialFractions(top, bot, variable) {
    const x = variable;
    const evalAt = v => symEval(symSimplify(bot), { [x]: v });
    const evalTop = v => symEval(symSimplify(top), { [x]: v });

    // Find roots of denominator numerically
    const roots = [];
    const range = 20, steps = 4000;
    const h = (2 * range) / steps;
    let prev = evalAt(-range);
    for (let i = 1; i <= steps; i++) {
        const xi = -range + i * h;
        const curr = evalAt(xi);
        if (isFinite(prev) && isFinite(curr) && prev * curr < 0) {
            let a = xi - h, b = xi;
            for (let k = 0; k < 60; k++) {
                const m = (a + b) / 2;
                const fm = evalAt(m);
                if (Math.abs(fm) < 1e-12) { a = m; break; }
                evalAt(a) * fm < 0 ? (b = m) : (a = m);
            }
            const root = (a + b) / 2;
            if (!roots.some(r => Math.abs(r - root) < 1e-6)) roots.push(root);
        }
        prev = curr;
    }

    // Residue for each simple root: A_i = top(r_i) / bot'(r_i)
    const botDeriv = symSimplify(symDiff(bot, x));
    const terms = roots.map(r => {
        const botD = symEval(botDeriv, { [x]: r });
        const A = Math.abs(botD) > 1e-14 ? evalTop(r) / botD : 0;
        return { coeff: A, root: r };
    });

    // Build LaTeX
    const latexParts = terms.map(({ coeff, root }) => {
        const c = _roundLatex(coeff);
        const r = _roundLatex(root);
        const sign = root >= 0 ? `-${r}` : `+${Math.abs(root).toFixed(4)}`;
        return `\\frac{${c}}{${x} ${sign}}`;
    });

    return {
        terms,
        latex: latexParts.join(' + ').replace(/\+ -/g, '- ') || '0',
        roots,
    };
}

function _roundLatex(v) {
    if (Math.abs(v - Math.round(v)) < 1e-8) return String(Math.round(v));
    return v.toFixed(4);
}

// ============================================================================
// FOURIER SERIES (symbolic coefficients)
// ============================================================================

/**
 * Compute Fourier series coefficients of a SymExpr on [−L, L].
 *   a₀ = (1/2L) ∫_{−L}^{L} f(x) dx
 *   aₙ = (1/L)  ∫_{−L}^{L} f(x) cos(nπx/L) dx
 *   bₙ = (1/L)  ∫_{−L}^{L} f(x) sin(nπx/L) dx
 *
 * Uses numerical integration (symbolic would require product integrals).
 *
 * @param {Object} expr
 * @param {string} variable
 * @param {number} L         half-period
 * @param {number} N         number of harmonics
 * @returns {{ a0, an: number[], bn: number[], evaluate: (x) => number, latex: string }}
 */
export function fourierSeries(expr, variable, L = Math.PI, N = 10) {
    const _int = (f, a, b, n = 2000) => {
        const h = (b - a) / n;
        let s = f(a) + f(b);
        for (let i = 1; i < n; i++) s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
        return (h / 3) * s;
    };
    const f = x => symEval(expr, { [variable]: x });

    const a0 = (1 / (2 * L)) * _int(f, -L, L);
    const an = [], bn = [];
    for (let n = 1; n <= N; n++) {
        an.push((1 / L) * _int(x => f(x) * Math.cos(n * Math.PI * x / L), -L, L));
        bn.push((1 / L) * _int(x => f(x) * Math.sin(n * Math.PI * x / L), -L, L));
    }

    const evaluate = x => {
        let s = a0;
        for (let n = 0; n < N; n++) {
            s += an[n] * Math.cos((n + 1) * Math.PI * x / L)
               + bn[n] * Math.sin((n + 1) * Math.PI * x / L);
        }
        return s;
    };

    // Build LaTeX string (non-zero terms only)
    const fmt = v => Math.abs(v) < 1e-10 ? null : _roundLatex(v);
    const parts = [fmt(a0) ? String(fmt(a0)) : null];
    for (let n = 1; n <= N; n++) {
        const a = fmt(an[n - 1]), b = fmt(bn[n - 1]);
        const arg = L === Math.PI ? `${n}${variable}` : `\\frac{${n}\\pi ${variable}}{${_roundLatex(L)}}`;
        if (a) parts.push(`${a}\\cos\\left(${arg}\\right)`);
        if (b) parts.push(`${b}\\sin\\left(${arg}\\right)`);
    }
    const latex = parts.filter(Boolean).join(' + ').replace(/\+ -/g, '- ') || '0';

    return { a0, an, bn, evaluate, latex, N, L };
}

// ============================================================================
// LAPLACE TRANSFORM (table-based, symbolic)
// ============================================================================

/**
 * Compute the Laplace transform of a SymExpr using a built-in table.
 * L{f(t)} = F(s)
 *
 * Supported forms: constants, powers of t, exp, sin, cos, sinh, cosh,
 * their products with exp (first shifting theorem), and sums thereof.
 *
 * @param {Object} expr   SymExpr in terms of `timeVar`
 * @param {string} [timeVar='t']
 * @param {string} [freqVar='s']
 * @returns {{ expr: Object|null, latex: string|null, method: string }}
 */
export function laplaceTransform(expr, timeVar = 't', freqVar = 's') {
    const s = symVar(freqVar);
    const result = _laplaceRule(expr, timeVar, s);
    if (!result) return { expr: null, latex: null, method: 'not found in table' };
    const simplified = symSimplify(result);
    return { expr: simplified, latex: symToLatex(simplified), method: 'table lookup' };
}

function _laplaceRule(e, t, s) {
    // L{c} = c/s
    if (e.type === 'const') return symDiv(e, s);

    // L{t^n} = n!/s^(n+1)
    if (e.type === 'var' && e.name === t) return symDiv(symConst(1), symPow(s, symConst(2)));
    if (e.type === 'pow' && e.base.type === 'var' && e.base.name === t && e.exp.type === 'const') {
        const n = e.exp.value;
        if (n >= 0 && Number.isInteger(n)) {
            const fac = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
            return symDiv(symConst(fac), symPow(s, symConst(n + 1)));
        }
    }

    // L{e^(at)} = 1/(s−a)
    if (e.type === 'fn' && e.name === 'exp') {
        const arg = e.arg;
        if (arg.type === 'mul' && arg.left.type === 'const' && arg.right.type === 'var' && arg.right.name === t) {
            const a = symConst(arg.left.value);
            return symDiv(symConst(1), symSub(s, a));
        }
        if (arg.type === 'var' && arg.name === t)
            return symDiv(symConst(1), symSub(s, symConst(1)));
        // e^(at) with a negative
        if (arg.type === 'neg' && arg.arg.type === 'var' && arg.arg.name === t)
            return symDiv(symConst(1), symAdd(s, symConst(1)));
    }

    // L{sin(ωt)} = ω/(s²+ω²)
    if (e.type === 'fn' && e.name === 'sin') {
        const omega = _extractLinearCoeff(e.arg, t);
        if (omega !== null) {
            const w2 = symConst(omega * omega);
            return symDiv(symConst(omega), symAdd(symPow(s, symConst(2)), w2));
        }
    }

    // L{cos(ωt)} = s/(s²+ω²)
    if (e.type === 'fn' && e.name === 'cos') {
        const omega = _extractLinearCoeff(e.arg, t);
        if (omega !== null) {
            const w2 = symConst(omega * omega);
            return symDiv(s, symAdd(symPow(s, symConst(2)), w2));
        }
    }

    // L{sinh(ωt)} = ω/(s²−ω²)
    if (e.type === 'fn' && e.name === 'sinh') {
        const omega = _extractLinearCoeff(e.arg, t);
        if (omega !== null) {
            const w2 = symConst(omega * omega);
            return symDiv(symConst(omega), symSub(symPow(s, symConst(2)), w2));
        }
    }

    // L{cosh(ωt)} = s/(s²−ω²)
    if (e.type === 'fn' && e.name === 'cosh') {
        const omega = _extractLinearCoeff(e.arg, t);
        if (omega !== null) {
            const w2 = symConst(omega * omega);
            return symDiv(s, symSub(symPow(s, symConst(2)), w2));
        }
    }

    // First shifting theorem: L{e^(at)·f(t)} = F(s−a)
    if (e.type === 'mul') {
        const [left, right] = [e.left, e.right];
        // Identify the exp factor
        const tryShift = (expE, fE) => {
            if (expE.type !== 'fn' || expE.name !== 'exp') return null;
            const a = _extractLinearCoeff(expE.arg, t);
            if (a === null) return null;
            const sShifted = symSub(s, symConst(a));
            const Fshifted = _laplaceRule(fE, t, sShifted);
            return Fshifted;
        };
        return tryShift(left, right) || tryShift(right, left) || null;
    }

    // Linearity: L{f+g} = L{f}+L{g}  and  L{c·f} = c·L{f}
    if (e.type === 'add') {
        const lL = _laplaceRule(e.left, t, s);
        const rL = _laplaceRule(e.right, t, s);
        if (lL && rL) return symAdd(lL, rL);
    }
    if (e.type === 'neg') {
        const inner = _laplaceRule(e.arg, t, s);
        return inner ? symNeg(inner) : null;
    }

    return null;
}

function _extractLinearCoeff(arg, t) {
    if (arg.type === 'var' && arg.name === t) return 1;
    if (arg.type === 'mul' && arg.left.type === 'const' && arg.right.type === 'var' && arg.right.name === t)
        return arg.left.value;
    if (arg.type === 'neg' && arg.arg.type === 'var' && arg.arg.name === t) return -1;
    return null;
}

// ============================================================================
// Z-TRANSFORM (table-based)
// ============================================================================

/**
 * One-sided Z-transform of common discrete-time sequences.
 * Z{x[n]} = X(z)
 *
 * Supported: unit impulse, unit step, ramp, a^n, sin/cos sequences.
 *
 * @param {string} seqName  one of: 'impulse','step','ramp','exponential','sin','cos'
 * @param {Object} [params] e.g. { a: 0.5 } for 'exponential', { omega: 1 } for 'sin'/'cos'
 * @param {string} [freqVar='z']
 * @returns {{ expr: Object, latex: string }}
 */
export function zTransform(seqName, params = {}, freqVar = 'z') {
    const z = symVar(freqVar);
    let expr;
    switch (seqName) {
        case 'impulse': // δ[n] → 1
            expr = symConst(1); break;
        case 'step':    // u[n] → z/(z−1)
            expr = symDiv(z, symSub(z, symConst(1))); break;
        case 'ramp':    // n·u[n] → z/(z−1)²
            expr = symDiv(z, symPow(symSub(z, symConst(1)), symConst(2))); break;
        case 'exponential': { // a^n·u[n] → z/(z−a)
            const a = symConst(params.a ?? 1);
            expr = symDiv(z, symSub(z, a)); break;
        }
        case 'sin': {   // sin(ωn)·u[n] → z·sin(ω)/(z²−2z·cos(ω)+1)
            const w = params.omega ?? 1;
            const sw = symConst(Math.sin(w)), cw = symConst(Math.cos(w));
            expr = symDiv(
                symMul(z, sw),
                symAdd(symSub(symPow(z, symConst(2)), symMul(symConst(2), symMul(z, cw))), symConst(1))
            ); break;
        }
        case 'cos': {   // cos(ωn)·u[n] → z(z−cos(ω))/(z²−2z·cos(ω)+1)
            const w = params.omega ?? 1;
            const cw = symConst(Math.cos(w));
            expr = symDiv(
                symMul(z, symSub(z, cw)),
                symAdd(symSub(symPow(z, symConst(2)), symMul(symConst(2), symMul(z, cw))), symConst(1))
            ); break;
        }
        default:
            return { expr: null, latex: null };
    }
    const simplified = symSimplify(expr);
    return { expr: simplified, latex: symToLatex(simplified) };
}

// ============================================================================
// SYMBOLIC EXPRESSION PARSING (from string)
// ============================================================================

/**
 * Parse a simple math expression string into a SymExpr tree.
 * Supports: numbers, variables (single letters), + - * / ^, parentheses,
 * and function names: sin, cos, tan, asin, acos, atan, sinh, cosh, tanh,
 * exp, ln, log, sqrt, abs.
 *
 * @param {string} src
 * @returns {Object}  SymExpr
 */
export function parseExpr(src) {
    const tokens = _tokenize(src.replace(/\s+/g, ''));
    let pos = 0;

    function peek() { return tokens[pos]; }
    function consume(expected) {
        const t = tokens[pos++];
        if (expected && t !== expected) throw new Error(`parseExpr: expected "${expected}" got "${t}"`);
        return t;
    }

    function parseAddSub() {
        let left = parseMulDiv();
        while (peek() === '+' || peek() === '-') {
            const op = consume();
            const right = parseMulDiv();
            left = op === '+' ? symAdd(left, right) : symSub(left, right);
        }
        return left;
    }

    function parseMulDiv() {
        let left = parsePow();
        while (peek() === '*' || peek() === '/') {
            const op = consume();
            const right = parsePow();
            left = op === '*' ? symMul(left, right) : symDiv(left, right);
        }
        return left;
    }

    function parsePow() {
        let base = parseUnary();
        if (peek() === '^') { consume(); base = symPow(base, parsePow()); }
        return base;
    }

    function parseUnary() {
        if (peek() === '-') { consume(); return symNeg(parsePrimary()); }
        if (peek() === '+') { consume(); }
        return parsePrimary();
    }

    function parsePrimary() {
        const t = peek();
        if (t === '(') {
            consume('(');
            const inner = parseAddSub();
            consume(')');
            return inner;
        }
        if (/^[0-9]/.test(t) || t === '.') {
            consume();
            return symConst(parseFloat(t));
        }
        // Function or variable
        if (/^[a-zA-Z]/.test(t)) {
            consume();
            const fnNames = ['sin','cos','tan','asin','acos','atan','sinh','cosh','tanh','exp','ln','log','sqrt','abs','log10'];
            if (fnNames.includes(t) && peek() === '(') {
                consume('(');
                const arg = parseAddSub();
                consume(')');
                return symFn(t === 'log' ? 'ln' : t, arg);
            }
            return symVar(t);
        }
        throw new Error(`parseExpr: unexpected token "${t}"`);
    }

    const result = parseAddSub();
    if (pos < tokens.length) throw new Error(`parseExpr: unexpected token "${tokens[pos]}" at position ${pos}`);
    return result;
}

function _tokenize(s) {
    const tokens = [];
    let i = 0;
    while (i < s.length) {
        if ('+-*/^()'.includes(s[i])) { tokens.push(s[i++]); continue; }
        if (/[0-9.]/.test(s[i])) {
            let n = '';
            while (i < s.length && /[0-9.]/.test(s[i])) n += s[i++];
            tokens.push(n); continue;
        }
        if (/[a-zA-Z]/.test(s[i])) {
            let w = '';
            while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) w += s[i++];
            tokens.push(w); continue;
        }
        i++;
    }
    return tokens;
}

// ============================================================================
// ARC LENGTH & SURFACE AREA (symbolic)
// ============================================================================

/**
 * Arc length of y = f(x) from a to b:  L = ∫√(1 + (f'(x))²) dx
 * Uses high-precision Gauss-Legendre quadrature (32 points).
 */
export function arcLength(expr, variable, a, b) {
    const deriv = symSimplify(symDiff(expr, variable));
    const integrand = x => {
        const dy = symEval(deriv, { [variable]: x });
        return Math.sqrt(1 + dy * dy);
    };
    return _gaussLegendre(integrand, a, b, 32);
}

/**
 * Surface area of revolution (about x-axis):
 *   S = 2π ∫_a^b f(x) √(1 + (f'(x))²) dx
 */
export function surfaceAreaOfRevolution(expr, variable, a, b) {
    const deriv = symSimplify(symDiff(expr, variable));
    const integrand = x => {
        const y = symEval(expr, { [variable]: x });
        const dy = symEval(deriv, { [variable]: x });
        return 2 * Math.PI * Math.abs(y) * Math.sqrt(1 + dy * dy);
    };
    return _gaussLegendre(integrand, a, b, 32);
}

/**
 * Volume of solid of revolution (about x-axis) — Disk method:
 *   V = π ∫_a^b (f(x))² dx
 */
export function volumeOfRevolution(expr, variable, a, b) {
    const integrand = x => {
        const y = symEval(expr, { [variable]: x });
        return Math.PI * y * y;
    };
    return _gaussLegendre(integrand, a, b, 32);
}

// 32-point Gauss-Legendre nodes & weights (precomputed)
const _GL_NODES = [
    -0.9972638618494816,-0.9856115115452684,-0.9647622555875064,-0.9349060759377397,
    -0.8963211557660521,-0.8493676137325700,-0.7944837959679424,-0.7321821187402897,
    -0.6630442669302152,-0.5877157572407623,-0.5068999089322294,-0.4213512761306353,
    -0.3318686022821276,-0.2392873622521371,-0.1444719615827965,-0.0483076656877383,
     0.0483076656877383, 0.1444719615827965, 0.2392873622521371, 0.3318686022821276,
     0.4213512761306353, 0.5068999089322294, 0.5877157572407623, 0.6630442669302152,
     0.7321821187402897, 0.7944837959679424, 0.8493676137325700, 0.8963211557660521,
     0.9349060759377397, 0.9647622555875064, 0.9856115115452684, 0.9972638618494816
];
const _GL_WEIGHTS = [
    0.0070186100094491,0.0162743947309057,0.0253920653092621,0.0342738629130214,
    0.0428358980222267,0.0509980592623762,0.0586840934785355,0.0658222227763618,
    0.0723457941088485,0.0781938957870703,0.0833119242269467,0.0876520930044038,
    0.0911738786957639,0.0938443990808046,0.0956387200792749,0.0965400885147278,
    0.0965400885147278,0.0956387200792749,0.0938443990808046,0.0911738786957639,
    0.0876520930044038,0.0833119242269467,0.0781938957870703,0.0723457941088485,
    0.0658222227763618,0.0586840934785355,0.0509980592623762,0.0428358980222267,
    0.0342738629130214,0.0253920653092621,0.0162743947309057,0.0070186100094491
];

function _gaussLegendre(f, a, b, n = 32) {
    const mid = (b + a) / 2, half = (b - a) / 2;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += _GL_WEIGHTS[i] * f(mid + half * _GL_NODES[i]);
    }
    return half * sum;
}

// ============================================================================
// DOUBLE & TRIPLE INTEGRALS (numerical)
// ============================================================================

/**
 * Double integral ∫∫_R f(x,y) dA over a rectangular region [ax,bx] × [ay,by].
 * Uses 2D Gauss-Legendre quadrature.
 *
 * @param {Object} expr     SymExpr in x, y
 * @param {string} xVar
 * @param {string} yVar
 * @param {number} ax  lower x bound
 * @param {number} bx  upper x bound
 * @param {number} ay  lower y bound (can be a function of x: ay(x))
 * @param {number} by  upper y bound (can be a function of x: by(x))
 * @param {number} [n=16]  quadrature points per dimension
 */
export function doubleIntegral(expr, xVar, yVar, ax, bx, ay, by, n = 16) {
    const ayFn = typeof ay === 'function' ? ay : () => ay;
    const byFn = typeof by === 'function' ? by : () => by;
    const nodes = _GL_NODES.slice(0, n), weights = _GL_WEIGHTS.slice(0, n);
    const midX = (bx + ax) / 2, halfX = (bx - ax) / 2;
    let total = 0;
    for (let i = 0; i < n; i++) {
        const x = midX + halfX * nodes[i];
        const yLo = ayFn(x), yHi = byFn(x);
        const midY = (yHi + yLo) / 2, halfY = (yHi - yLo) / 2;
        let inner = 0;
        for (let j = 0; j < n; j++) {
            const y = midY + halfY * nodes[j];
            inner += weights[j] * symEval(expr, { [xVar]: x, [yVar]: y });
        }
        total += weights[i] * halfY * inner;
    }
    return halfX * total;
}

/**
 * Triple integral ∫∫∫ f(x,y,z) dV over a box [ax,bx]×[ay,by]×[az,bz].
 * Bounds ay/by/az/bz may be functions of outer variables.
 */
export function tripleIntegral(expr, xVar, yVar, zVar, ax, bx, ay, by, az, bz, n = 8) {
    const ayFn = typeof ay === 'function' ? ay : () => ay;
    const byFn = typeof by === 'function' ? by : () => by;
    const azFn = typeof az === 'function' ? az : () => az;
    const bzFn = typeof bz === 'function' ? bz : () => bz;
    const nodes = _GL_NODES.slice(0, n), weights = _GL_WEIGHTS.slice(0, n);
    const mX = (bx + ax) / 2, hX = (bx - ax) / 2;
    let total = 0;
    for (let i = 0; i < n; i++) {
        const x = mX + hX * nodes[i];
        const yLo = ayFn(x), yHi = byFn(x);
        const mY = (yHi + yLo) / 2, hY = (yHi - yLo) / 2;
        let sumY = 0;
        for (let j = 0; j < n; j++) {
            const y = mY + hY * nodes[j];
            const zLo = azFn(x, y), zHi = bzFn(x, y);
            const mZ = (zHi + zLo) / 2, hZ = (zHi - zLo) / 2;
            let sumZ = 0;
            for (let k = 0; k < n; k++) {
                const z = mZ + hZ * nodes[k];
                sumZ += weights[k] * symEval(expr, { [xVar]: x, [yVar]: y, [zVar]: z });
            }
            sumY += weights[j] * hZ * sumZ;
        }
        total += weights[i] * hY * sumY;
    }
    return hX * total;
}
