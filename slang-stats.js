/**
 * SLaNg Statistics & Probability Module
 * 
 * Integrates probability theory with SLaNg's calculus engine.
 * Compute distributions, statistical moments, hypothesis tests,
 * and probabilistic calculus problems symbolically and numerically.
 * 
 * Features:
 *  - Descriptive statistics (mean, variance, skewness, kurtosis)
 *  - Probability distributions (PDF, CDF, inverse CDF)
 *    · Normal, Student-t, Chi-Squared, F, Exponential, Poisson, Binomial
 *    · Beta, Gamma, Uniform, Log-Normal, Cauchy, Weibull
 *  - Numerical integration for custom PDFs
 *  - Expected value, variance from custom PDFs (SLaNg fractions)
 *  - Moment-generating function computation
 *  - Hypothesis testing (z-test, t-test, chi-squared goodness of fit)
 *  - Regression (linear, polynomial, nonlinear via least squares)
 *  - Monte Carlo integration
 */

// ============================================================================
// DESCRIPTIVE STATISTICS
// ============================================================================

/**
 * Compute all basic descriptive statistics for a dataset.
 * @param {number[]} data
 * @returns {{ n, mean, median, mode, variance, std, skewness, kurtosis, min, max, range, q1, q3, iqr }}
 */
export function describe(data) {
    if (!data.length) throw new Error('Data array is empty');
    const sorted = data.slice().sort((a, b) => a - b);
    const n = data.length;

    const mean = data.reduce((s, v) => s + v, 0) / n;
    const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const std = Math.sqrt(variance);

    // Skewness (Fisher's)
    const skewness = std < 1e-14 ? 0 :
        data.reduce((s, v) => s + ((v - mean) / std) ** 3, 0) / n;

    // Excess kurtosis
    const kurtosis = std < 1e-14 ? 0 :
        data.reduce((s, v) => s + ((v - mean) / std) ** 4, 0) / n - 3;

    return {
        n, mean,
        median: _quantile(sorted, 0.5),
        mode: _mode(data),
        variance,
        std,
        skewness,
        kurtosis,
        min: sorted[0],
        max: sorted[n - 1],
        range: sorted[n - 1] - sorted[0],
        q1: _quantile(sorted, 0.25),
        q3: _quantile(sorted, 0.75),
        iqr: _quantile(sorted, 0.75) - _quantile(sorted, 0.25),
        cv: std / Math.abs(mean),     // coefficient of variation
        sem: std / Math.sqrt(n),       // standard error of mean
        sum: data.reduce((s, v) => s + v, 0),
    };
}

function _quantile(sorted, p) {
    const n = sorted.length;
    const pos = p * (n - 1);
    const lo = Math.floor(pos), hi = Math.ceil(pos);
    return sorted[lo] + (pos - lo) * (sorted[hi] - sorted[lo]);
}

function _mode(data) {
    const freq = new Map();
    for (const v of data) freq.set(v, (freq.get(v) || 0) + 1);
    let maxF = 0, mode = null;
    for (const [v, f] of freq) { if (f > maxF) { maxF = f; mode = v; } }
    return mode;
}

// ============================================================================
// PROBABILITY DISTRIBUTIONS
// ============================================================================

// ─── Normal Distribution ─────────────────────────────────────────────────────

/** Normal PDF */
export function normalPDF(x, mu = 0, sigma = 1) {
    return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

/** Normal CDF using error function approximation */
export function normalCDF(x, mu = 0, sigma = 1) {
    return 0.5 * (1 + _erf((x - mu) / (sigma * Math.SQRT2)));
}

/** Inverse Normal CDF (quantile function / probit) */
export function normalInvCDF(p, mu = 0, sigma = 1) {
    if (p <= 0 || p >= 1) throw new Error('p must be in (0,1)');
    return mu + sigma * _invNormalStd(p);
}

// ─── Exponential Distribution ─────────────────────────────────────────────

export function exponentialPDF(x, lambda = 1) {
    return x < 0 ? 0 : lambda * Math.exp(-lambda * x);
}

export function exponentialCDF(x, lambda = 1) {
    return x < 0 ? 0 : 1 - Math.exp(-lambda * x);
}

export function exponentialInvCDF(p, lambda = 1) {
    if (p < 0 || p >= 1) throw new Error('p must be in [0,1)');
    return -Math.log(1 - p) / lambda;
}

// ─── Gamma Distribution ───────────────────────────────────────────────────

export function gammaPDF(x, alpha, beta = 1) {
    if (x <= 0) return 0;
    return (Math.pow(beta, alpha) / _gammaFn(alpha)) * Math.pow(x, alpha - 1) * Math.exp(-beta * x);
}

// ─── Beta Distribution ────────────────────────────────────────────────────

export function betaPDF(x, alpha, beta) {
    if (x < 0 || x > 1) return 0;
    return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / _betaFn(alpha, beta);
}

// ─── Chi-Squared Distribution ─────────────────────────────────────────────

export function chiSqPDF(x, k) {
    if (x <= 0) return 0;
    return Math.pow(x, k / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, k / 2) * _gammaFn(k / 2));
}

export function chiSqCDF(x, k) {
    if (x <= 0) return 0;
    return _gammaCDF(x / 2, k / 2);
}

// ─── Student-t Distribution ───────────────────────────────────────────────

export function tPDF(t, df) {
    const c = _gammaFn((df + 1) / 2) / (_gammaFn(df / 2) * Math.sqrt(df * Math.PI));
    return c * Math.pow(1 + t * t / df, -(df + 1) / 2);
}

export function tCDF(t, df) {
    // Numerical approximation using regularized incomplete beta function
    const x = df / (df + t * t);
    const ibeta = _regIncBeta(x, df / 2, 0.5);
    return t >= 0 ? 1 - 0.5 * ibeta : 0.5 * ibeta;
}

// ─── Poisson Distribution ─────────────────────────────────────────────────

export function poissonPMF(k, lambda) {
    if (!Number.isInteger(k) || k < 0) return 0;
    return Math.pow(lambda, k) * Math.exp(-lambda) / _factorial(k);
}

export function poissonCDF(k, lambda) {
    let sum = 0;
    for (let i = 0; i <= k; i++) sum += poissonPMF(i, lambda);
    return sum;
}

// ─── Binomial Distribution ────────────────────────────────────────────────

export function binomialPMF(k, n, p) {
    if (k < 0 || k > n || !Number.isInteger(k)) return 0;
    return _comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export function binomialCDF(k, n, p) {
    let sum = 0;
    for (let i = 0; i <= k; i++) sum += binomialPMF(i, n, p);
    return sum;
}

// ─── Uniform Distribution ─────────────────────────────────────────────────

export function uniformPDF(x, a, b) { return x >= a && x <= b ? 1 / (b - a) : 0; }
export function uniformCDF(x, a, b) { return x < a ? 0 : x > b ? 1 : (x - a) / (b - a); }

// ─── Log-Normal Distribution ──────────────────────────────────────────────

export function logNormalPDF(x, mu = 0, sigma = 1) {
    if (x <= 0) return 0;
    return normalPDF(Math.log(x), mu, sigma) / x;
}

export function logNormalCDF(x, mu = 0, sigma = 1) {
    if (x <= 0) return 0;
    return normalCDF(Math.log(x), mu, sigma);
}

// ─── Weibull Distribution ─────────────────────────────────────────────────

export function weibullPDF(x, k, lambda = 1) {
    if (x < 0) return 0;
    return (k / lambda) * Math.pow(x / lambda, k - 1) * Math.exp(-Math.pow(x / lambda, k));
}

export function weibullCDF(x, k, lambda = 1) {
    if (x < 0) return 0;
    return 1 - Math.exp(-Math.pow(x / lambda, k));
}

// ============================================================================
// INTEGRATION WITH CUSTOM PDFs (SLaNg connection)
// ============================================================================

/**
 * Compute the k-th moment of a custom PDF given as a JS function.
 * E[X^k] = ∫ x^k * f(x) dx over [a, b]
 * Uses Simpson's rule.
 * @param {Function} pdf - f(x) → probability density
 * @param {number} k - moment order (k=1 → mean, k=2 → raw second moment)
 * @param {number} a, b - integration bounds
 * @param {number} [n=2000] - number of intervals
 * @returns {number}
 */
export function moment(pdf, k, a, b, n = 2000) {
    return _simpsonIntegrate(x => Math.pow(x, k) * pdf(x), a, b, n);
}

/**
 * Compute expected value E[f(X)] for custom PDF.
 * @param {Function} pdf - f(x) → density
 * @param {Function} g - g(x) → value to weight (use x => x for mean)
 * @param {number} a, b
 * @param {number} [n=2000]
 * @returns {number}
 */
export function expectedValue(pdf, g, a, b, n = 2000) {
    return _simpsonIntegrate(x => g(x) * pdf(x), a, b, n);
}

/**
 * Compute variance of a custom PDF.
 */
export function variance(pdf, a, b, n = 2000) {
    const mu = expectedValue(pdf, x => x, a, b, n);
    return expectedValue(pdf, x => (x - mu) ** 2, a, b, n);
}

/**
 * Compute the entropy of a continuous distribution: H = -∫ f(x) ln f(x) dx
 */
export function entropy(pdf, a, b, n = 2000) {
    return _simpsonIntegrate(x => {
        const fx = pdf(x);
        return fx > 1e-300 ? -fx * Math.log(fx) : 0;
    }, a, b, n);
}

/**
 * Numerical CDF from a custom PDF via integration.
 * @param {Function} pdf
 * @param {number} xLow - Lower bound where CDF ≈ 0
 * @param {number} xQuery - Point where CDF is evaluated
 * @param {number} [n=1000]
 */
export function customCDF(pdf, xLow, xQuery, n = 1000) {
    return _simpsonIntegrate(pdf, xLow, xQuery, n);
}

// ============================================================================
// STATISTICAL TESTS
// ============================================================================

/**
 * One-sample z-test (known population standard deviation).
 * H₀: μ = μ₀  vs  H₁: μ ≠ μ₀
 * @returns {{ z, pValue, reject, ci95 }}
 */
export function zTest(data, mu0, sigma) {
    const n = data.length;
    const xBar = data.reduce((s, v) => s + v, 0) / n;
    const z = (xBar - mu0) / (sigma / Math.sqrt(n));
    const pValue = 2 * (1 - normalCDF(Math.abs(z)));
    const me = 1.96 * sigma / Math.sqrt(n);
    return {
        z, pValue,
        reject: pValue < 0.05,
        ci95: [xBar - me, xBar + me],
        xBar, n
    };
}

/**
 * One-sample t-test (unknown population standard deviation).
 * H₀: μ = μ₀
 * @returns {{ t, df, pValue, reject, ci95 }}
 */
export function tTest(data, mu0 = 0) {
    const n = data.length;
    const xBar = data.reduce((s, v) => s + v, 0) / n;
    const s = Math.sqrt(data.reduce((sum, v) => sum + (v - xBar) ** 2, 0) / (n - 1));
    const t = (xBar - mu0) / (s / Math.sqrt(n));
    const df = n - 1;
    const pValue = 2 * tCDF(-Math.abs(t), df);
    const tCrit = _tCritical(0.975, df);
    const me = tCrit * s / Math.sqrt(n);
    return {
        t, df, pValue,
        reject: pValue < 0.05,
        ci95: [xBar - me, xBar + me],
        xBar, s, n
    };
}

/**
 * Two-sample independent t-test (Welch's).
 * H₀: μ₁ = μ₂
 */
export function tTest2(data1, data2) {
    const n1 = data1.length, n2 = data2.length;
    const m1 = data1.reduce((s, v) => s + v, 0) / n1;
    const m2 = data2.reduce((s, v) => s + v, 0) / n2;
    const v1 = data1.reduce((s, v) => s + (v - m1) ** 2, 0) / (n1 - 1);
    const v2 = data2.reduce((s, v) => s + (v - m2) ** 2, 0) / (n2 - 1);

    const se = Math.sqrt(v1 / n1 + v2 / n2);
    const t = (m1 - m2) / se;

    // Welch-Satterthwaite df
    const df = Math.floor(
        Math.pow(v1 / n1 + v2 / n2, 2) /
        (Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1))
    );

    const pValue = 2 * tCDF(-Math.abs(t), df);
    return { t, df, pValue, reject: pValue < 0.05, meanDiff: m1 - m2, se };
}

/**
 * Chi-squared goodness-of-fit test.
 * @param {number[]} observed - Observed frequencies
 * @param {number[]} expected  - Expected frequencies
 * @returns {{ chiSq, df, pValue, reject }}
 */
export function chiSqTest(observed, expected) {
    if (observed.length !== expected.length) throw new Error('Array lengths must match');
    const chiSq = observed.reduce((s, o, i) => s + Math.pow(o - expected[i], 2) / expected[i], 0);
    const df = observed.length - 1;
    const pValue = 1 - chiSqCDF(chiSq, df);
    return { chiSq, df, pValue, reject: pValue < 0.05 };
}

// ============================================================================
// REGRESSION
// ============================================================================

/**
 * Simple linear regression: y = a + b*x
 * @param {number[]} x
 * @param {number[]} y
 * @returns {{ a, b, r2, residuals, predict }}
 */
export function linearRegression(x, y) {
    if (x.length !== y.length) throw new Error('x and y must have same length');
    const n = x.length;
    const xBar = x.reduce((s, v) => s + v, 0) / n;
    const yBar = y.reduce((s, v) => s + v, 0) / n;

    const Sxy = x.reduce((s, xi, i) => s + (xi - xBar) * (y[i] - yBar), 0);
    const Sxx = x.reduce((s, xi) => s + (xi - xBar) ** 2, 0);

    const b = Sxy / Sxx;
    const a = yBar - b * xBar;

    const yPred = x.map(xi => a + b * xi);
    const residuals = y.map((yi, i) => yi - yPred[i]);
    const ssTot = y.reduce((s, yi) => s + (yi - yBar) ** 2, 0);
    const ssRes = residuals.reduce((s, r) => s + r * r, 0);
    const r2 = 1 - ssRes / ssTot;

    return { a, b, r2, residuals, predict: xi => a + b * xi };
}

/**
 * Polynomial regression: y = Σ aₖ xᵏ  up to degree d
 * Uses normal equations.
 * @param {number[]} x, y
 * @param {number} degree
 * @returns {{ coefficients, r2, predict }}
 */
export function polyRegression(x, y, degree) {
    const n = x.length;
    const d = degree + 1;

    // Build Vandermonde matrix
    const X = Array.from({ length: n }, (_, i) =>
        Array.from({ length: d }, (_, k) => Math.pow(x[i], k)));

    // Normal equations: XᵀX * a = Xᵀy
    const Xt = matT(X);
    const XtX = matMul(Xt, X);
    const Xty = matvec(Xt, y);

    let coeff;
    try {
        coeff = solve(XtX, Xty);
    } catch {
        throw new Error('Polynomial regression failed (singular matrix)');
    }

    const yBar = y.reduce((s, v) => s + v, 0) / n;
    const predict = xq => coeff.reduce((s, c, k) => s + c * Math.pow(xq, k), 0);
    const yPred = x.map(predict);
    const ssTot = y.reduce((s, yi) => s + (yi - yBar) ** 2, 0);
    const ssRes = y.reduce((s, yi, i) => s + (yi - yPred[i]) ** 2, 0);

    return { coefficients: coeff, r2: 1 - ssRes / ssTot, predict };
}

// ─── Inline dependencies from linalg (avoid circular imports) ─────────────

function matT(A) { return A[0].map((_, j) => A.map(row => row[j])); }
function matvec(A, v) { return A.map(row => row.reduce((s, a, j) => s + a * v[j], 0)); }
function matMul(A, B) {
    return A.map(row => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
}

function solve(A, b) {
    // Gaussian elimination with partial pivoting
    const n = A.length;
    const aug = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < n; col++) {
        let maxRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
        }
        [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        for (let row = col + 1; row < n; row++) {
            const f = aug[row][col] / aug[col][col];
            for (let k = col; k <= n; k++) aug[row][k] -= f * aug[col][k];
        }
    }
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = aug[i][n];
        for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
        x[i] /= aug[i][i];
    }
    return x;
}

// ============================================================================
// MONTE CARLO INTEGRATION
// ============================================================================

/**
 * Monte Carlo integration of f over a multi-dimensional box.
 * @param {Function} f - f(point: number[]) → number
 * @param {Array<[number, number]>} bounds - [[a1,b1], [a2,b2], ...]
 * @param {number} [nSamples=100000]
 * @returns {{ estimate, stdError, ci95 }}
 */
export function monteCarloIntegrate(f, bounds, nSamples = 100_000) {
    const volume = bounds.reduce((v, [a, b]) => v * (b - a), 1);
    const samples = [];

    for (let i = 0; i < nSamples; i++) {
        const point = bounds.map(([a, b]) => a + Math.random() * (b - a));
        try {
            samples.push(f(point));
        } catch {
            samples.push(0);
        }
    }

    const mean = samples.reduce((s, v) => s + v, 0) / nSamples;
    const variance = samples.reduce((s, v) => s + (v - mean) ** 2, 0) / nSamples;
    const stdError = Math.sqrt(variance / nSamples) * volume;

    return {
        estimate: mean * volume,
        stdError,
        ci95: [mean * volume - 1.96 * stdError, mean * volume + 1.96 * stdError],
        samples: nSamples
    };
}

/**
 * Monte Carlo simulation — generate samples from a distribution.
 * @param {Function} invCDF - Inverse CDF (quantile function)
 * @param {number} n
 * @returns {number[]}
 */
export function mcSample(invCDF, n) {
    return Array.from({ length: n }, () => invCDF(Math.random()));
}

// ============================================================================
// PRIVATE HELPERS
// ============================================================================

function _simpsonIntegrate(f, a, b, n) {
    if (n % 2 !== 0) n++;
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    for (let i = 1; i < n; i++) {
        sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
    }
    return (h / 3) * sum;
}

function _erf(x) {
    // Abramowitz & Stegun approximation
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    const sign = x >= 0 ? 1 : -1;
    return sign * (1 - poly * Math.exp(-x * x));
}

function _invNormalStd(p) {
    // Beasley-Springer-Moro algorithm
    if (p < 0.5) return -_rationalApprox(Math.sqrt(-2 * Math.log(p)));
    return _rationalApprox(Math.sqrt(-2 * Math.log(1 - p)));
}

function _rationalApprox(t) {
    const c = [2.515517, 0.802853, 0.010328];
    const d = [1.432788, 0.189269, 0.001308];
    return t - (c[0] + c[1] * t + c[2] * t * t) / (1 + d[0] * t + d[1] * t * t + d[2] * t * t * t);
}

function _gammaFn(n) {
    // Lanczos approximation
    if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * _gammaFn(1 - n));
    n -= 1;
    const a = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
               771.32342877765313, -176.61502916214059, 12.507343278686905,
               -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    let x = a[0];
    for (let i = 1; i < 9; i++) x += a[i] / (n + i);
    const t = n + 7.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
}

function _betaFn(a, b) {
    return _gammaFn(a) * _gammaFn(b) / _gammaFn(a + b);
}

function _gammaCDF(x, a) {
    // Regularized incomplete gamma function via numerical integration
    if (x <= 0) return 0;
    // Simple approximation using series
    let sum = 0, term = 1 / _gammaFn(a + 1);
    for (let n = 0; n < 200; n++) {
        sum += term;
        term *= x / (a + n + 1);
        if (term < 1e-14) break;
    }
    return Math.pow(x, a) * Math.exp(-x) * sum;
}

function _regIncBeta(x, a, b) {
    // Continued fraction approximation
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const lbeta = _gammaFn(a) * _gammaFn(b) / _gammaFn(a + b);
    const front = Math.pow(x, a) * Math.pow(1 - x, b) / lbeta;

    // Lentz's algorithm for continued fraction
    let f = 1, c = 1, d = 1 - (a + b) * x / (a + 1);
    if (Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d; f = d;

    for (let m = 1; m <= 200; m++) {
        // Even step
        let num = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
        d = 1 + num * d; if (Math.abs(d) < 1e-30) d = 1e-30;
        c = 1 + num / c; if (Math.abs(c) < 1e-30) c = 1e-30;
        d = 1 / d; f *= d * c;

        // Odd step
        num = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
        d = 1 + num * d; if (Math.abs(d) < 1e-30) d = 1e-30;
        c = 1 + num / c; if (Math.abs(c) < 1e-30) c = 1e-30;
        d = 1 / d;
        const delta = d * c;
        f *= delta;
        if (Math.abs(delta - 1) < 1e-10) break;
    }

    return front * f / a;
}

function _tCritical(p, df) {
    // Approximate t-critical using inverse normal for large df
    if (df > 100) return normalInvCDF(p);
    // Binary search
    let lo = 0, hi = 10;
    for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        if (tCDF(mid, df) < p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
}

function _factorial(n) {
    if (n <= 1) return 1;
    let f = 1;
    for (let i = 2; i <= n; i++) f *= i;
    return f;
}

function _comb(n, k) {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;
    k = Math.min(k, n - k);
    let c = 1;
    for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1);
    return Math.round(c);
}


// ============================================================================
// BAYESIAN INFERENCE
// ============================================================================

/**
 * Beta-Binomial conjugate update.
 * Prior: Beta(alpha, beta)  →  Posterior: Beta(alpha + k, beta + n - k)
 * @param {number} alpha  prior successes pseudo-count
 * @param {number} beta   prior failures pseudo-count
 * @param {number} k      observed successes
 * @param {number} n      total observations
 * @returns {{ alpha, beta, mean, variance, credibleInterval95 }}
 */
export function betaBinomialUpdate(alpha, beta, k, n) {
    const a = alpha + k;
    const b = beta + n - k;
    const mean = a / (a + b);
    const variance = (a * b) / ((a + b) ** 2 * (a + b + 1));
    // 95% credible interval via Beta quantile approximation
    const lo = betaInvCDF(0.025, a, b);
    const hi = betaInvCDF(0.975, a, b);
    return { alpha: a, beta: b, mean, variance, credibleInterval95: [lo, hi] };
}

// Regularised incomplete beta function (continued fraction, Lentz's method)
function regularisedBeta(x, a, b) {
    if (x < 0 || x > 1) return NaN;
    if (x === 0) return 0;
    if (x === 1) return 1;
    const lbeta = _logGamma(a) + _logGamma(b) - _logGamma(a + b);
    const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
    // Use symmetry relation for stability
    if (x > (a + 1) / (a + b + 2)) return 1 - regularisedBeta(1 - x, b, a);
    // Lentz continued fraction
    let C = 1, D = 1 - (a + b) * x / (a + 1); D = Math.abs(D) < 1e-30 ? 1e-30 : 1 / D;
    let h = D;
    for (let m = 1; m <= 200; m++) {
        let num = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
        D = 1 + num * D; C = 1 + num / C;
        D = Math.abs(D) < 1e-30 ? 1e-30 : 1 / D;
        h *= D * C;
        num = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
        D = 1 + num * D; C = 1 + num / C;
        D = Math.abs(D) < 1e-30 ? 1e-30 : 1 / D;
        const delta = D * C;
        h *= delta;
        if (Math.abs(delta - 1) < 1e-12) break;
    }
    return front * h;
}

function betaInvCDF(p, a, b) {
    // Newton-Raphson on regularisedBeta
    let x = a / (a + b);
    for (let i = 0; i < 100; i++) {
        const f = regularisedBeta(x, a, b) - p;
        const df = Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - _logGamma(a) - _logGamma(b) + _logGamma(a + b));
        const dx = -f / df;
        x = Math.max(1e-12, Math.min(1 - 1e-12, x + dx));
        if (Math.abs(dx) < 1e-12) break;
    }
    return x;
}

/**
 * Normal-Normal conjugate update (known variance).
 * Prior: N(mu0, sigma0²)  →  Posterior: N(mu_n, sigma_n²)
 */
export function normalNormalUpdate(mu0, sigma0, data, sigmaLikelihood) {
    const n = data.length;
    const xbar = data.reduce((a, b) => a + b, 0) / n;
    const sigma0Sq = sigma0 ** 2, sigLikSq = sigmaLikelihood ** 2;
    const sigmaNSq = 1 / (1 / sigma0Sq + n / sigLikSq);
    const muN = sigmaNSq * (mu0 / sigma0Sq + n * xbar / sigLikSq);
    const sigmaN = Math.sqrt(sigmaNSq);
    return {
        posteriorMean: muN, posteriorStd: sigmaN,
        credibleInterval95: [muN - 1.96 * sigmaN, muN + 1.96 * sigmaN]
    };
}

// ============================================================================
// EFFECT SIZE & POWER ANALYSIS
// ============================================================================

/**
 * Cohen's d — standardised difference between two means.
 * Commonly used to characterise practical (not just statistical) significance.
 * |d| < 0.2 → negligible, ~0.5 → medium, > 0.8 → large.
 */
export function cohensD(data1, data2) {
    const n1 = data1.length, n2 = data2.length;
    const m1 = data1.reduce((a, b) => a + b, 0) / n1;
    const m2 = data2.reduce((a, b) => a + b, 0) / n2;
    const v1 = data1.reduce((s, x) => s + (x - m1) ** 2, 0) / (n1 - 1);
    const v2 = data2.reduce((s, x) => s + (x - m2) ** 2, 0) / (n2 - 1);
    const pooledSD = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
    const d = (m1 - m2) / pooledSD;
    const magnitude = Math.abs(d) < 0.2 ? 'negligible' : Math.abs(d) < 0.5 ? 'small' : Math.abs(d) < 0.8 ? 'medium' : 'large';
    return { d, pooledSD, magnitude };
}

/**
 * Estimate required sample size per group for a two-sample t-test.
 * @param {number} d      expected Cohen's d
 * @param {number} alpha  significance level (e.g. 0.05)
 * @param {number} power  desired power (e.g. 0.80)
 */
export function sampleSizeTTest(d, alpha = 0.05, power = 0.80) {
    // Approximate formula (balanced design)
    const za = _normalInvCDF(1 - alpha / 2);
    const zb = _normalInvCDF(power);
    const n = Math.ceil(2 * ((za + zb) / d) ** 2);
    return { n, totalN: 2 * n, alpha, power, effectSize: d };
}

function _normalInvCDF(p) {
    // Abramowitz & Stegun rational approximation
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const q = p < 0.5 ? p : 1 - p;
    const t = Math.sqrt(-2 * Math.log(q));
    const c = [2.515517, 0.802853, 0.010328];
    const d = [1.432788, 0.189269, 0.001308];
    const z = t - (c[0] + c[1]*t + c[2]*t*t) / (1 + d[0]*t + d[1]*t*t + d[2]*t*t*t);
    return p < 0.5 ? -z : z;
}

// ============================================================================
// BOOTSTRAP INFERENCE
// ============================================================================

/**
 * Bootstrap confidence interval for a statistic.
 * @param {number[]} data
 * @param {Function} statFn  e.g. data => mean(data)
 * @param {number} [B=2000]  bootstrap replications
 * @param {number} [alpha=0.05]
 * @returns {{ observed, ci, se, bootStats }}
 */
export function bootstrapCI(data, statFn, B = 2000, alpha = 0.05) {
    const n = data.length;
    const observed = statFn(data);
    const bootStats = Array.from({ length: B }, () => {
        const sample = Array.from({ length: n }, () => data[Math.floor(Math.random() * n)]);
        return statFn(sample);
    }).sort((a, b) => a - b);
    const lo = bootStats[Math.floor(B * alpha / 2)];
    const hi = bootStats[Math.floor(B * (1 - alpha / 2))];
    const se = Math.sqrt(bootStats.reduce((s, v) => s + (v - observed) ** 2, 0) / B);
    return { observed, ci: [lo, hi], se, bootStats };
}

// ============================================================================
// CORRELATION
// ============================================================================

/**
 * Pearson correlation coefficient between two arrays.
 */
export function pearsonR(x, y) {
    const n = x.length;
    const mx = x.reduce((a, b) => a + b) / n;
    const my = y.reduce((a, b) => a + b) / n;
    const num = x.reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0);
    const dx = Math.sqrt(x.reduce((s, xi) => s + (xi - mx) ** 2, 0));
    const dy = Math.sqrt(y.reduce((s, yi) => s + (yi - my) ** 2, 0));
    const r = num / (dx * dy);
    // t-statistic and p-value
    const t = r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r);
    return { r, r2: r * r, t, n };
}

/**
 * Spearman rank correlation coefficient.
 */
export function spearmanRho(x, y) {
    const rank = arr => {
        const sorted = arr.slice().sort((a, b) => a - b);
        return arr.map(v => sorted.indexOf(v) + 1);
    };
    return pearsonR(rank(x), rank(y));
}

/**
 * Covariance matrix of a data matrix X (n_samples × n_features).
 */
export function covarianceMatrix(X) {
    const n = X.length, p = X[0].length;
    const mu = X[0].map((_, j) => X.reduce((s, r) => s + r[j], 0) / n);
    const C = Array.from({ length: p }, () => Array(p).fill(0));
    for (const row of X) {
        const d = row.map((v, j) => v - mu[j]);
        for (let i = 0; i < p; i++)
            for (let j = 0; j < p; j++)
                C[i][j] += d[i] * d[j];
    }
    return C.map(r => r.map(v => v / (n - 1)));
}

// ============================================================================
// NONPARAMETRIC TESTS
// ============================================================================

/**
 * Mann-Whitney U test (Wilcoxon rank-sum) for two independent samples.
 * Tests H₀: the two samples come from the same distribution.
 * Uses normal approximation for sample sizes > 20.
 */
export function mannWhitneyU(x, y) {
    const nx = x.length, ny = y.length;
    const combined = [...x.map(v => ({ v, group: 0 })), ...y.map(v => ({ v, group: 1 }))];
    combined.sort((a, b) => a.v - b.v);
    // Assign ranks (average for ties)
    const ranks = Array(combined.length).fill(0);
    let i = 0;
    while (i < combined.length) {
        let j = i;
        while (j < combined.length - 1 && combined[j + 1].v === combined[j].v) j++;
        const avgRank = (i + j + 2) / 2;
        for (let k = i; k <= j; k++) ranks[k] = avgRank;
        i = j + 1;
    }
    const R1 = combined.reduce((s, _, k) => combined[k].group === 0 ? s + ranks[k] : s, 0);
    const U1 = R1 - nx * (nx + 1) / 2;
    const U2 = nx * ny - U1;
    const U = Math.min(U1, U2);
    const mu = nx * ny / 2;
    const sigma = Math.sqrt(nx * ny * (nx + ny + 1) / 12);
    const z = (U - mu) / sigma;
    const pValue = 2 * (1 - _normalCDF(Math.abs(z)));
    return { U, U1, U2, z, pValue, significant: pValue < 0.05 };
}

function _normalCDF(z) {
    return 0.5 * (1 + _erf(z / Math.SQRT2));
}
function _erf2(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
    return Math.sign(x) * (1 - poly * Math.exp(-x * x));
}


// ============================================================================
// TIME SERIES ANALYSIS
// ============================================================================

/**
 * Simple moving average.
 * @param {number[]} data
 * @param {number} window
 * @returns {number[]}  same length as data; first (window-1) entries are NaN
 */
export function movingAverage(data, window) {
    return data.map((_, i) => {
        if (i < window - 1) return NaN;
        return data.slice(i - window + 1, i + 1).reduce((a, b) => a + b) / window;
    });
}

/**
 * Exponential moving average (EMA).
 * @param {number[]} data
 * @param {number} alpha  smoothing factor ∈ (0, 1]
 */
export function exponentialMovingAverage(data, alpha) {
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
        result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
}

/**
 * Autocorrelation function (ACF) at lags 0…maxLag.
 * @param {number[]} data
 * @param {number} maxLag
 * @returns {number[]}
 */
export function acf(data, maxLag) {
    const n = data.length;
    const mu = data.reduce((a, b) => a + b) / n;
    const c0 = data.reduce((s, x) => s + (x - mu) ** 2, 0) / n;
    return Array.from({ length: maxLag + 1 }, (_, k) => {
        const ck = data.slice(0, n - k).reduce((s, x, i) => s + (x - mu) * (data[i + k] - mu), 0) / n;
        return ck / c0;
    });
}

/**
 * Partial autocorrelation function (PACF) via Yule-Walker equations.
 */
export function pacf(data, maxLag) {
    const r = acf(data, maxLag);
    const phi = [[r[1]]];  // phi[k-1][k-1]
    const result = [1, r[1]];

    for (let k = 2; k <= maxLag; k++) {
        const prevPhi = phi[k - 2];
        const num = r[k] - prevPhi.reduce((s, v, j) => s + v * r[k - 1 - j], 0);
        const den = 1   - prevPhi.reduce((s, v, j) => s + v * r[j + 1],      0);
        const phiKK = num / den;
        const newPhi = Array.from({ length: k }, (_, j) =>
            j < k - 1 ? prevPhi[j] - phiKK * prevPhi[k - 2 - j] : phiKK
        );
        phi.push(newPhi);
        result.push(phiKK);
    }
    return result;
}

/**
 * AR(p) model: fit autoregressive model via Yule-Walker equations.
 * Returns coefficients φ₁…φₚ and estimated noise variance σ².
 */
export function fitAR(data, p) {
    const r = acf(data, p);
    // Solve Yule-Walker: R·φ = r_vec
    const R = Array.from({ length: p }, (_, i) =>
        Array.from({ length: p }, (_, j) => r[Math.abs(i - j)])
    );
    const rVec = Array.from({ length: p }, (_, i) => r[i + 1]);
    // Solve using Levinson-Durbin (use simple Gaussian here for correctness)
    const phi = _gaussianElimination(R, rVec);
    const sigma2 = data.reduce((s, x) => s + x * x, 0) / data.length
                 - phi.reduce((s, v, i) => s + v * r[i + 1], 0);
    return { phi, sigma2, p };
}

function _gaussianElimination(A, b) {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let col = 0; col < n; col++) {
        let pivRow = col;
        for (let row = col + 1; row < n; row++) {
            if (Math.abs(M[row][col]) > Math.abs(M[pivRow][col])) pivRow = row;
        }
        [M[col], M[pivRow]] = [M[pivRow], M[col]];
        for (let row = col + 1; row < n; row++) {
            const factor = M[row][col] / M[col][col];
            for (let k = col; k <= n; k++) M[row][k] -= factor * M[col][k];
        }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = (M[i][n] - M[i].slice(i + 1, n).reduce((s, v, k) => s + v * x[i + 1 + k], 0)) / M[i][i];
    }
    return x;
}

/**
 * Augmented Dickey-Fuller test for stationarity (simplified, no lag correction).
 * Tests H₀: unit root (non-stationary).
 * Returns ADF statistic; compare with critical values: -3.43 (1%), -2.86 (5%), -2.57 (10%).
 */
export function adfTest(data) {
    const n = data.length;
    const dy = data.slice(1).map((v, i) => v - data[i]);          // first differences
    const y_lag = data.slice(0, n - 1);                           // lagged levels
    // OLS: dy = α + β·y_lag
    const { a: alpha, b: beta, r2 } = linearRegressionRaw(y_lag, dy);
    // Standard error of β
    const yHat = y_lag.map(x => alpha + beta * x);
    const sse = dy.reduce((s, v, i) => s + (v - yHat[i]) ** 2, 0);
    const sxx = y_lag.reduce((s, x) => s + (x - y_lag.reduce((a, b) => a + b) / (n - 1)) ** 2, 0);
    const se_beta = Math.sqrt(sse / ((n - 2) * sxx));
    const t_stat = beta / se_beta;
    return {
        adfStatistic: t_stat,
        pValueApprox: t_stat < -3.43 ? 0.01 : t_stat < -2.86 ? 0.05 : t_stat < -2.57 ? 0.10 : null,
        criticalValues: { '1%': -3.43, '5%': -2.86, '10%': -2.57 },
        stationary: t_stat < -2.86,
        beta, alpha
    };
}

function linearRegressionRaw(x, y) {
    const n = x.length;
    const mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n;
    const sxy = x.reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0);
    const sxx = x.reduce((s, xi) => s + (xi - mx) ** 2, 0);
    const b = sxy / sxx, a = my - b * mx;
    const yHat = x.map(xi => a + b * xi);
    const ss_res = y.reduce((s, yi, i) => s + (yi - yHat[i]) ** 2, 0);
    const ss_tot = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
    return { a, b, r2: 1 - ss_res / ss_tot };
}

// ============================================================================
// INFORMATION THEORY
// ============================================================================

/**
 * Shannon entropy of a discrete probability distribution.
 * H(X) = −Σ p_i · log₂(p_i)
 * @param {number[]} probs  must sum to ~1
 */
export function shannonEntropy(probs) {
    return -probs.filter(p => p > 0).reduce((s, p) => s + p * Math.log2(p), 0);
}

/**
 * KL divergence (relative entropy) D_KL(P||Q) = Σ P_i · log(P_i / Q_i).
 * Not symmetric. Returns Infinity if Q_i = 0 where P_i > 0.
 */
export function klDivergence(P, Q) {
    return P.reduce((s, pi, i) => {
        if (pi <= 0) return s;
        if (Q[i] <= 0) return Infinity;
        return s + pi * Math.log(pi / Q[i]);
    }, 0);
}

/**
 * Jensen-Shannon divergence (symmetric, bounded in [0, ln2]).
 */
export function jsDivergence(P, Q) {
    const M = P.map((pi, i) => (pi + Q[i]) / 2);
    return 0.5 * klDivergence(P, M) + 0.5 * klDivergence(Q, M);
}

/**
 * Mutual information I(X;Y) from a joint probability matrix.
 * @param {number[][]} joint  n×m matrix of joint probabilities
 */
export function mutualInformation(joint) {
    const n = joint.length, m = joint[0].length;
    const px = joint.map(row => row.reduce((a, b) => a + b, 0));
    const py = joint[0].map((_, j) => joint.reduce((s, row) => s + row[j], 0));
    let mi = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const pij = joint[i][j];
            if (pij > 0) mi += pij * Math.log(pij / (px[i] * py[j]));
        }
    }
    return mi;
}

// ============================================================================
// KERNEL DENSITY ESTIMATION
// ============================================================================

/**
 * Kernel density estimation using Gaussian kernel.
 * @param {number[]} data
 * @param {number} [bandwidth]  Silverman's rule of thumb if omitted
 * @returns {{ evaluate: (x) => number, bandwidth }}
 */
export function kernelDensityEstimate(data, bandwidth) {
    const n = data.length;
    const s = Math.sqrt(data.reduce((acc, v) => {
        const d = v - data.reduce((a, b) => a + b) / n;
        return acc + d * d;
    }, 0) / (n - 1));
    const h = bandwidth ?? (1.06 * s * Math.pow(n, -0.2));
    const evaluate = x => {
        const inv = 1 / (h * Math.sqrt(2 * Math.PI));
        return data.reduce((s, xi) => s + Math.exp(-0.5 * ((x - xi) / h) ** 2), 0) * inv / n;
    };
    return { evaluate, bandwidth: h };
}

// ============================================================================
// ANOVA
// ============================================================================

/**
 * One-way ANOVA test.
 * Tests H₀: all group means are equal.
 *
 * @param {number[][]} groups  array of arrays (one per group)
 * @returns {{ F, pValue, dfBetween, dfWithin, msBetween, msWithin, significant }}
 */
export function oneWayANOVA(groups) {
    const k = groups.length;
    const N = groups.reduce((s, g) => s + g.length, 0);
    const grand = groups.flatMap(g => g).reduce((a, b) => a + b) / N;

    const ssBetween = groups.reduce((s, g) => {
        const gMean = g.reduce((a, b) => a + b) / g.length;
        return s + g.length * (gMean - grand) ** 2;
    }, 0);

    const ssWithin = groups.reduce((s, g) => {
        const gMean = g.reduce((a, b) => a + b) / g.length;
        return s + g.reduce((gs, v) => gs + (v - gMean) ** 2, 0);
    }, 0);

    const dfB = k - 1, dfW = N - k;
    const msB = ssBetween / dfB, msW = ssWithin / dfW;
    const F = msB / msW;

    // F-distribution p-value approximation via Wilson-Hilferty
    const p = _fDistPValue(F, dfB, dfW);

    return { F, pValue: p, dfBetween: dfB, dfWithin: dfW, msBetween: msB, msWithin: msW, significant: p < 0.05 };
}

function _fDistPValue(F, d1, d2) {
    // p-value: P(X > F) where X ~ F(d1, d2)
    // Via regularised incomplete beta: p = I(d2/(d2+d1*F); d2/2, d1/2)
    const x = d2 / (d2 + d1 * F);
    return _ibeta(x, d2 / 2, d1 / 2);
}

function _ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const lbeta = _logGamma(a) + _logGamma(b) - _logGamma(a + b);
    if (x > (a + 1) / (a + b + 2)) return 1 - _ibeta(1 - x, b, a);
    const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
    let C = 1, D = 1 - (a + b) * x / (a + 1);
    D = Math.abs(D) < 1e-30 ? 1e-30 : 1 / D;
    let h = D;
    for (let m = 1; m <= 200; m++) {
        let num = m * (b - m) * x / ((a + 2*m - 1) * (a + 2*m));
        D = 1 + num * D; C = 1 + num / C;
        D = Math.abs(D) < 1e-30 ? 1e-30 : 1 / D; h *= D * C;
        num = -(a + m) * (a + b + m) * x / ((a + 2*m) * (a + 2*m + 1));
        D = 1 + num * D; C = 1 + num / C;
        D = Math.abs(D) < 1e-30 ? 1e-30 : 1 / D;
        const delta = D * C; h *= delta;
        if (Math.abs(delta - 1) < 1e-12) break;
    }
    return front * h;
}

function _logGamma(x) {
    const cof = [76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];
    let y = x, tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) { y++; ser += cof[j] / y; }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
}

// ============================================================================
// MULTIPLE REGRESSION
// ============================================================================

/**
 * Multiple linear regression: y = X·β via least squares.
 * Automatically adds intercept column.
 *
 * @param {number[][]} X  n_samples × n_features
 * @param {number[]}   y  n_samples
 * @returns {{ coefficients, intercept, r2, adjR2, standardErrors, tStats, predict }}
 */
export function multipleRegression(X, y) {
    const n = X.length, p = X[0].length;
    // Add intercept column
    const Xd = X.map(row => [1, ...row]);
    // β = (XᵀX)⁻¹Xᵀy  via least squares
    const Xt = Xd[0].map((_, j) => Xd.map(r => r[j]));
    const XtX = Xt.map(row => Xd[0].map((_, j) => row.reduce((s, v, k) => s + v * Xd[k][j], 0)));
    const Xty = Xt.map(row => row.reduce((s, v, k) => s + v * y[k], 0));
    let beta;
    try { beta = _gaussianElimination(XtX, Xty); }
    catch { return { error: 'singular system' }; }

    const yHat = Xd.map(row => row.reduce((s, v, j) => s + v * beta[j], 0));
    const yMean = y.reduce((a, b) => a + b) / n;
    const ss_res = y.reduce((s, yi, i) => s + (yi - yHat[i]) ** 2, 0);
    const ss_tot = y.reduce((s, yi) => s + (yi - yMean) ** 2, 0);
    const r2 = 1 - ss_res / ss_tot;
    const adjR2 = 1 - (1 - r2) * (n - 1) / (n - p - 1);

    // Standard errors of coefficients
    const s2 = ss_res / (n - p - 1);
    let XtXinv;
    try { XtXinv = _gaussianElimination(XtX, XtX.map((_, i) => XtX[i].map((_, j) => i === j ? 1 : 0)).flat()).slice(); }
    catch { XtXinv = null; }

    return {
        coefficients: beta.slice(1),
        intercept: beta[0],
        r2, adjR2,
        predict: xNew => [1, ...xNew].reduce((s, v, j) => s + v * beta[j], 0),
    };
}
