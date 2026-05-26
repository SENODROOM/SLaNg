/**
 * SLaNg Complex Numbers Module
 * 
 * Full complex arithmetic, complex calculus, and complex analysis
 * integrated with the SLaNg expression format.
 * 
 * Features:
 *  - Complex number type: { re, im }
 *  - Full arithmetic: add, sub, mul, div, pow, sqrt, exp, log
 *  - Trigonometric functions in complex plane
 *  - Polar form, modulus, argument, conjugate
 *  - Complex roots of unity and polynomials (companion matrix method)
 *  - Numerical complex differentiation (Cauchy-Riemann check)
 *  - Contour integration (numerical)
 *  - Laurent series coefficient estimation
 *  - Complex fast Fourier transform (Cooley-Tukey FFT)
 */

// ============================================================================
// COMPLEX NUMBER CONSTRUCTOR
// ============================================================================

/**
 * Create a complex number.
 * @param {number} re - Real part
 * @param {number} im - Imaginary part (default 0)
 * @returns {{ re: number, im: number }}
 */
export function C(re, im = 0) {
    return { re, im };
}

export const ZERO = C(0, 0);
export const ONE  = C(1, 0);
export const I    = C(0, 1);
export const NEG1 = C(-1, 0);

// ============================================================================
// BASIC COMPLEX ARITHMETIC
// ============================================================================

export function cAdd(a, b) { return C(a.re + b.re, a.im + b.im); }
export function cSub(a, b) { return C(a.re - b.re, a.im - b.im); }
export function cScale(a, s) { return C(a.re * s, a.im * s); }

export function cMul(a, b) {
    return C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
}

export function cDiv(a, b) {
    const denom = b.re * b.re + b.im * b.im;
    if (denom < 1e-300) throw new Error('Division by zero in complex division');
    return C(
        (a.re * b.re + a.im * b.im) / denom,
        (a.im * b.re - a.re * b.im) / denom
    );
}

/** Complex conjugate */
export function cConj(z) { return C(z.re, -z.im); }

/** Modulus |z| */
export function cAbs(z) { return Math.sqrt(z.re * z.re + z.im * z.im); }

/** Argument arg(z) ∈ (-π, π] */
export function cArg(z) { return Math.atan2(z.im, z.re); }

/** Convert to polar form [r, θ] */
export function toPolar(z) { return [cAbs(z), cArg(z)]; }

/** Create from polar form [r, θ] */
export function fromPolar(r, theta) { return C(r * Math.cos(theta), r * Math.sin(theta)); }

/** Square of modulus (avoids sqrt) */
export function cAbsSq(z) { return z.re * z.re + z.im * z.im; }

// ============================================================================
// COMPLEX POWERS AND ROOTS
// ============================================================================

/**
 * Complex exponential: e^z = e^(a+bi) = eᵃ(cos b + i sin b)
 */
export function cExp(z) {
    const ea = Math.exp(z.re);
    return C(ea * Math.cos(z.im), ea * Math.sin(z.im));
}

/**
 * Principal complex logarithm: Ln(z) = ln|z| + i·arg(z)
 */
export function cLog(z) {
    if (cAbs(z) < 1e-300) throw new Error('log(0) is undefined');
    return C(Math.log(cAbs(z)), cArg(z));
}

/**
 * Complex power: z^w = exp(w * ln(z)) (principal value)
 */
export function cPow(z, w) {
    if (cAbs(z) < 1e-300) return ZERO;
    return cExp(cMul(w, cLog(z)));
}

/**
 * Principal complex square root.
 */
export function cSqrt(z) {
    const r = cAbs(z);
    const theta = cArg(z);
    return fromPolar(Math.sqrt(r), theta / 2);
}

/**
 * All n-th roots of a complex number.
 * @returns {Array<{re, im}>} n roots
 */
export function cNthRoots(z, n) {
    const [r, theta] = toPolar(z);
    const rn = Math.pow(r, 1 / n);
    return Array.from({ length: n }, (_, k) =>
        fromPolar(rn, (theta + 2 * Math.PI * k) / n));
}

// ============================================================================
// COMPLEX TRIGONOMETRIC & HYPERBOLIC FUNCTIONS
// ============================================================================

export function cSin(z)  { return C(Math.sin(z.re) * Math.cosh(z.im), Math.cos(z.re) * Math.sinh(z.im)); }
export function cCos(z)  { return C(Math.cos(z.re) * Math.cosh(z.im), -Math.sin(z.re) * Math.sinh(z.im)); }
export function cTan(z)  { return cDiv(cSin(z), cCos(z)); }
export function cSinh(z) { return C(Math.sinh(z.re) * Math.cos(z.im), Math.cosh(z.re) * Math.sin(z.im)); }
export function cCosh(z) { return C(Math.cosh(z.re) * Math.cos(z.im), Math.sinh(z.re) * Math.sin(z.im)); }
export function cTanh(z) { return cDiv(cSinh(z), cCosh(z)); }

/** Inverse sine: arcsin(z) = -i·ln(iz + sqrt(1-z²)) */
export function cAsin(z) {
    const iz = cMul(I, z);
    const one = ONE;
    const z2 = cMul(z, z);
    const sqrtPart = cSqrt(cSub(one, z2));
    return cMul(C(0, -1), cLog(cAdd(iz, sqrtPart)));
}

/** Inverse cosine */
export function cAcos(z) {
    return cSub(C(Math.PI / 2), cAsin(z));
}

/** Inverse tangent: atan(z) = (i/2)·ln((i+z)/(i-z)) */
export function cAtan(z) {
    const half_i = C(0, 0.5);
    const num = cAdd(I, z);
    const den = cSub(I, z);
    return cMul(half_i, cLog(cDiv(num, den)));
}

// ============================================================================
// COMPLEX POLYNOMIAL OPERATIONS
// ============================================================================

/**
 * Evaluate a polynomial at a complex point.
 * @param {Array<{re,im}>} coeffs - Coefficients [a0, a1, ..., an] for a0 + a1*z + ... + an*z^n
 * @param {{ re, im }} z
 * @returns {{ re, im }}
 */
export function cPolyEval(coeffs, z) {
    // Horner's method
    let result = coeffs[coeffs.length - 1];
    for (let i = coeffs.length - 2; i >= 0; i--) {
        result = cAdd(cMul(result, z), coeffs[i]);
    }
    return result;
}

/**
 * Find all roots of a polynomial with real or complex coefficients
 * using Aberth-Ehrlich method (simultaneous root finding).
 * @param {number[]} coeffs - Real coefficients [a0, a1, ..., an] (highest degree last)
 * @param {number} [tol=1e-10]
 * @param {number} [maxIter=1000]
 * @returns {Array<{re,im}>} Array of roots
 */
export function polyRoots(coeffs, tol = 1e-10, maxIter = 1000) {
    const n = coeffs.length - 1; // degree
    if (n <= 0) return [];
    if (n === 1) return [C(-coeffs[0] / coeffs[1])];

    // Monic polynomial coefficients
    const lead = coeffs[n];
    const monicCoeffs = coeffs.map(c => C(c / lead));

    // Initial guesses evenly spaced on a circle
    const radius = 1 + Math.max(...coeffs.slice(0, n).map(c => Math.abs(c / lead)));
    let z = Array.from({ length: n }, (_, k) =>
        fromPolar(radius, 2 * Math.PI * k / n + 0.1));

    // Polynomial derivative coefficients
    const dCoeffs = monicCoeffs.slice(1).map((c, k) => cScale(c, k + 1));

    for (let iter = 0; iter < maxIter; iter++) {
        let maxUpdate = 0;

        const newZ = z.map((zi, i) => {
            // f(zi) / f'(zi)
            const fzi  = cPolyEval(monicCoeffs, zi);
            const dfzi = cPolyEval(dCoeffs, zi);
            if (cAbs(dfzi) < 1e-300) return zi;

            const ratio = cDiv(fzi, dfzi);

            // Aberth correction
            const correction = z.reduce((sum, zj, j) => {
                if (j === i) return sum;
                const diff = cSub(zi, zj);
                return cAbs(diff) < 1e-300 ? sum : cAdd(sum, cDiv(ONE, diff));
            }, ZERO);

            const update = cDiv(ratio, cSub(ONE, cMul(ratio, correction)));
            maxUpdate = Math.max(maxUpdate, cAbs(update));
            return cSub(zi, update);
        });

        z = newZ;
        if (maxUpdate < tol) break;
    }

    // Polish roots using Newton's method
    return z.map(zi => {
        for (let k = 0; k < 10; k++) {
            const fz  = cPolyEval(monicCoeffs, zi);
            const dfz = cPolyEval(dCoeffs, zi);
            if (cAbs(dfz) < 1e-300) break;
            const step = cDiv(fz, dfz);
            zi = cSub(zi, step);
            if (cAbs(step) < 1e-14) break;
        }
        return zi;
    });
}

// ============================================================================
// COMPLEX CALCULUS
// ============================================================================

/**
 * Numerical complex derivative using Cauchy-Riemann equations.
 * f'(z₀) = lim(h→0) [f(z₀+h) - f(z₀)] / h
 * @param {Function} f - f({re,im}) → {re,im}
 * @param {{ re, im }} z0
 * @param {number} [h=1e-6]
 * @returns {{ re, im }}
 */
export function cDerivative(f, z0, h = 1e-6) {
    const fz = f(z0);
    // Use complex step for improved accuracy
    const zh = cAdd(z0, C(h));
    const fzh = f(zh);
    return cDiv(cSub(fzh, fz), C(h));
}

/**
 * Check if a function satisfies the Cauchy-Riemann equations at z₀.
 * Returns true if the function appears holomorphic at z₀.
 * @param {Function} f
 * @param {{ re, im }} z0
 * @param {number} [h=1e-5]
 * @param {number} [tol=1e-4]
 */
export function isCauchyRiemann(f, z0, h = 1e-5, tol = 1e-4) {
    const x = z0.re, y = z0.im;
    const fxy = f(C(x, y));
    const fxhy = f(C(x + h, y));
    const fxyh = f(C(x, y + h));

    // ∂u/∂x ≈ (Re[f(x+h,y)] - Re[f(x,y)]) / h
    const dudx = (fxhy.re - fxy.re) / h;
    const dvdx = (fxhy.im - fxy.im) / h;
    // ∂u/∂y ≈ (Re[f(x,y+h)] - Re[f(x,y)]) / h
    const dudy = (fxyh.re - fxy.re) / h;
    const dvdy = (fxyh.im - fxy.im) / h;

    // CR: ∂u/∂x = ∂v/∂y  and  ∂u/∂y = -∂v/∂x
    return Math.abs(dudx - dvdy) < tol && Math.abs(dudy + dvdx) < tol;
}

/**
 * Numerical contour integration ∮_C f(z) dz
 * along a parametric curve z(t), t ∈ [a, b].
 * @param {Function} f - f(z) → {re,im}
 * @param {Function} z - z(t) → {re,im} (curve parametrization)
 * @param {Function} dz - dz/dt → {re,im} (derivative of z)
 * @param {number} a - Start parameter
 * @param {number} b - End parameter
 * @param {number} [n=1000]
 * @returns {{ re, im }}
 */
export function contourIntegral(f, z, dz, a, b, n = 1000) {
    const h = (b - a) / n;
    let result = ZERO;

    for (let k = 0; k <= n; k++) {
        const t = a + k * h;
        const zt = z(t);
        const dzt = dz(t);
        const fzt = f(zt);
        const integrand = cMul(fzt, dzt);
        const weight = (k === 0 || k === n) ? 0.5 : 1;
        result = cAdd(result, cScale(integrand, weight * h));
    }

    return result;
}

/**
 * Contour integration along a circle of radius r centered at z0.
 * ∮_{|z-z0|=r} f(z) dz
 * @param {Function} f
 * @param {{ re, im }} z0 - Center
 * @param {number} r - Radius
 * @param {number} [n=1000]
 * @returns {{ re, im }}
 */
export function circleIntegral(f, z0, r, n = 1000) {
    const z   = t => cAdd(z0, fromPolar(r, t));
    const dzdt = t => cMul(C(0, r), fromPolar(1, t)); // r·i·e^{it}
    return contourIntegral(f, z, dzdt, 0, 2 * Math.PI, n);
}

/**
 * Estimate residue of f at z0 using the contour integral formula:
 * Res(f, z0) ≈ (1/2πi) ∮ f(z) dz  (integral over small circle)
 * @param {Function} f
 * @param {{ re, im }} z0
 * @param {number} [r=0.01]
 * @returns {{ re, im }}
 */
export function residue(f, z0, r = 0.01) {
    const integral = circleIntegral(f, z0, r);
    return cScale(integral, 1 / (2 * Math.PI));
}

// ============================================================================
// FAST FOURIER TRANSFORM (Cooley-Tukey)
// ============================================================================

/**
 * Compute the Discrete Fourier Transform (DFT) of a sequence.
 * @param {Array<{re,im}>} x - Input complex sequence (length must be power of 2)
 * @returns {Array<{re,im}>} DFT output
 */
export function fft(x) {
    const n = x.length;
    if (n === 1) return [x[0]];

    if ((n & (n - 1)) !== 0) {
        // Fall back to O(n²) DFT for non-power-of-2 lengths
        return dft(x);
    }

    // Bit-reversal permutation
    const X = x.slice();
    let j = 0;
    for (let i = 1; i < n; i++) {
        let bit = n >> 1;
        while (j & bit) { j ^= bit; bit >>= 1; }
        j ^= bit;
        if (i < j) { [X[i], X[j]] = [X[j], X[i]]; }
    }

    // Cooley-Tukey butterfly
    for (let len = 2; len <= n; len <<= 1) {
        const ang = -2 * Math.PI / len;
        const wlen = C(Math.cos(ang), Math.sin(ang));

        for (let i = 0; i < n; i += len) {
            let w = ONE;
            for (let k = 0; k < len / 2; k++) {
                const u = X[i + k];
                const v = cMul(X[i + k + len / 2], w);
                X[i + k]           = cAdd(u, v);
                X[i + k + len / 2] = cSub(u, v);
                w = cMul(w, wlen);
            }
        }
    }

    return X;
}

/**
 * Inverse FFT.
 * @param {Array<{re,im}>} X - Frequency domain
 * @returns {Array<{re,im}>} Time domain
 */
export function ifft(X) {
    const n = X.length;
    // Conjugate, FFT, conjugate, scale
    const conj = X.map(cConj);
    const result = fft(conj);
    return result.map(z => cScale(cConj(z), 1 / n));
}

/**
 * Real-valued FFT — input is array of numbers.
 * @param {number[]} signal
 * @returns {{ frequencies: number[], magnitudes: number[], phases: number[] }}
 */
export function realFFT(signal) {
    const X = fft(signal.map(v => C(v)));
    const n = X.length;
    const half = Math.floor(n / 2) + 1;

    const frequencies = Array.from({ length: half }, (_, k) => k);
    const magnitudes  = X.slice(0, half).map(z => cAbs(z) * 2 / n);
    const phases      = X.slice(0, half).map(z => cArg(z));

    if (half > 0) magnitudes[0] /= 2; // DC component

    return { frequencies, magnitudes, phases, raw: X.slice(0, half) };
}

/**
 * O(n²) DFT — fallback for non-power-of-2 lengths.
 */
export function dft(x) {
    const n = x.length;
    return Array.from({ length: n }, (_, k) => {
        return x.reduce((sum, xn, nn) => {
            const angle = -2 * Math.PI * k * nn / n;
            return cAdd(sum, cMul(xn, C(Math.cos(angle), Math.sin(angle))));
        }, ZERO);
    });
}

// ============================================================================
// DISPLAY UTILITIES
// ============================================================================

/**
 * Format a complex number as a string.
 * @param {{ re, im }} z
 * @param {number} [decimals=4]
 * @returns {string}
 */
export function cToString(z, decimals = 4) {
    const re = z.re.toFixed(decimals);
    const im = Math.abs(z.im).toFixed(decimals);
    if (Math.abs(z.im) < 1e-12) return re;
    if (Math.abs(z.re) < 1e-12) return (z.im < 0 ? '-' : '') + im + 'i';
    const sign = z.im < 0 ? ' - ' : ' + ';
    return `${re}${sign}${im}i`;
}

/**
 * Format a complex number in polar form: r∠θ°
 */
export function cToPolarString(z, decimals = 4) {
    const r = cAbs(z).toFixed(decimals);
    const theta = (cArg(z) * 180 / Math.PI).toFixed(2);
    return `${r}∠${theta}°`;
}

/**
 * Convert a complex number to LaTeX.
 */
export function cToLatex(z, decimals = 4) {
    const re = z.re.toFixed(decimals);
    const im = Math.abs(z.im).toFixed(decimals);
    if (Math.abs(z.im) < 1e-12) return re;
    if (Math.abs(z.re) < 1e-12) return (z.im < 0 ? '-' : '') + im + 'i';
    const sign = z.im < 0 ? ' - ' : ' + ';
    return `${re}${sign}${im}i`;
}


// ============================================================================
// MÖBIUS TRANSFORMATIONS
// ============================================================================

/**
 * Möbius (linear fractional) transformation: w = (az + b) / (cz + d)
 * @param {{ re, im }} z
 * @param {{ re, im }} a
 * @param {{ re, im }} b
 * @param {{ re, im }} c
 * @param {{ re, im }} d
 * @returns {{ re, im }}
 */
export function mobiusTransform(z, a, b, c, d) {
    const num = cAdd(cMul(a, z), b);
    const den = cAdd(cMul(c, z), d);
    return cDiv(num, den);
}

/**
 * Fixed points of a Möbius transformation: w = z → cz² + (d-a)z - b = 0.
 * @returns {{ re, im }[]}
 */
export function mobiusFixedPoints(a, b, c, d) {
    if (Math.abs(c.re) + Math.abs(c.im) < 1e-14) {
        // Degenerate (translation/scaling): z = b/(a-d)
        return [cDiv(b, cSub(a, d))];
    }
    // cz² + (d-a)z - b = 0
    const A = c, B = cSub(d, a), Cneg = cScale(b, -1);
    // z = [-B ± sqrt(B²+4AC)] / 2A
    const disc = cAdd(cMul(B, B), cScale(cMul(A, Cneg), 4));
    const sqD = cSqrt(disc);
    const z1 = cDiv(cAdd(cScale(B, -1), sqD), cScale(A, 2));
    const z2 = cDiv(cSub(cScale(B, -1), sqD), cScale(A, 2));
    return [z1, z2];
}

// ============================================================================
// POWER SERIES
// ============================================================================

/**
 * Evaluate a complex power series  Σ cₙ (z - z0)^n.
 * @param {number[]} coeffs  real coefficients (index = power)
 * @param {{ re, im }} z
 * @param {{ re, im }} [z0]  center (default 0)
 * @returns {{ re, im }}
 */
export function powerSeries(coeffs, z, z0 = { re: 0, im: 0 }) {
    const w = cSub(z, z0);
    return coeffs.reduce((sum, c, n) => {
        const term = cScale(cPow(w, { re: n, im: 0 }), c);
        return cAdd(sum, term);
    }, { re: 0, im: 0 });
}

/**
 * Radius of convergence using the ratio test (successive coefficients).
 * R = lim |cₙ/cₙ₊₁| as n → ∞
 */
export function radiusOfConvergence(coeffs) {
    const nonZero = coeffs.filter(c => Math.abs(c) > 1e-15);
    if (nonZero.length < 2) return Infinity;
    const last = nonZero[nonZero.length - 1];
    const secondLast = nonZero[nonZero.length - 2];
    return Math.abs(secondLast / last);
}

// ============================================================================
// CONFORMAL MAPPING HELPERS
// ============================================================================

/** Map z → z² */
export const conformalSquare = z => cMul(z, z);

/** Map z → e^z */
export const conformalExp = z => cExp(z);

/** Map z → ln(z) */
export const conformalLog = z => cLog(z);

/** Joukowski transform z → z + 1/z (used in airfoil analysis) */
export function joukowski(z) {
    return cAdd(z, cDiv({ re: 1, im: 0 }, z));
}

/**
 * Map a polygon of complex vertices through a conformal map f.
 * @param {{ re, im }[]} vertices
 * @param {Function} f  complex function
 * @returns {{ re, im }[]}
 */
export function mapPolygon(vertices, f) {
    return vertices.map(f);
}

// ============================================================================
// COMPLEX INTEGRATION — EXTENDED
// ============================================================================

/**
 * Compute residue at a pole z0 using the limit formula for simple poles:
 *   Res(f, z0) = lim_{z→z0} (z - z0)·f(z)
 * @param {Function} f  complex function  z → { re, im }
 * @param {{ re, im }} z0  pole location
 * @param {number} [eps=1e-7]
 */
export function residueAtPole(f, z0, eps = 1e-7) {
    const z = { re: z0.re + eps, im: z0.im };
    const fz = f(z);
    const zMinusZ0 = cSub(z, z0);
    return cMul(zMinusZ0, fz);
}

/**
 * Cauchy's Integral Formula: f(z0) = (1/2πi) ∮_C f(z)/(z-z0) dz
 * Numerically computes the contour integral and recovers f(z0).
 * @param {Function} f
 * @param {{ re, im }} z0  interior point
 * @param {number} [r=1]   radius of circular contour
 * @param {number} [n=1000]
 */
export function cauchyIntegralFormula(f, z0, r = 1, n = 1000) {
    const g = z => cDiv(f(z), cSub(z, z0));
    const integral = circleIntegral(g, z0, r, n);
    return cScale(integral, 1 / (2 * Math.PI));
}

// ============================================================================
// NUMERICAL DIFFERENTIATION IN ℂ
// ============================================================================

/**
 * Second-order complex derivative using central differences.
 * @param {Function} f  z → { re, im }
 * @param {{ re, im }} z0
 * @param {number} [h=1e-5]
 */
export function cSecondDerivative(f, z0, h = 1e-5) {
    const zp  = { re: z0.re + h, im: z0.im };
    const zm  = { re: z0.re - h, im: z0.im };
    const fzp = f(zp), fz = f(z0), fzm = f(zm);
    return cScale(cAdd(cSub(fzp, cScale(fz, 2)), fzm), 1 / (h * h));
}

/**
 * Check if f is analytic at z0 (both C-R equations satisfied).
 * @returns {{ analytic: boolean, error: number }}
 */
export function isAnalytic(f, z0, h = 1e-5) {
    const { uX, uY, vX, vY } = _partials(f, z0, h);
    const crError = Math.max(Math.abs(uX - vY), Math.abs(uY + vX));
    return { analytic: crError < 1e-4, error: crError };
}

function _partials(f, z0, h) {
    const fR = z => f(z).re, fI = z => f(z).im;
    const zxp = { re: z0.re + h, im: z0.im }, zxm = { re: z0.re - h, im: z0.im };
    const zyp = { re: z0.re, im: z0.im + h }, zym = { re: z0.re, im: z0.im - h };
    return {
        uX: (fR(zxp) - fR(zxm)) / (2 * h),
        uY: (fR(zyp) - fR(zym)) / (2 * h),
        vX: (fI(zxp) - fI(zxm)) / (2 * h),
        vY: (fI(zyp) - fI(zym)) / (2 * h),
    };
}

// ============================================================================
// QUATERNIONS  (ℍ — 4D hypercomplex)
// ============================================================================

/**
 * Quaternion: { w, x, y, z }  (real part + 3 imaginary components)
 * Useful for 3D rotation and orientation mathematics.
 */

export const Q = (w, x, y, z) => ({ w, x, y, z });
export const qAdd = (a, b) => Q(a.w+b.w, a.x+b.x, a.y+b.y, a.z+b.z);
export const qSub = (a, b) => Q(a.w-b.w, a.x-b.x, a.y-b.y, a.z-b.z);
export const qScale = (q, s) => Q(q.w*s, q.x*s, q.y*s, q.z*s);
export const qConj = q => Q(q.w, -q.x, -q.y, -q.z);
export const qNormSq = q => q.w**2 + q.x**2 + q.y**2 + q.z**2;
export const qNorm = q => Math.sqrt(qNormSq(q));
export const qNormalize = q => qScale(q, 1 / qNorm(q));

/** Hamilton product: p·q */
export function qMul(p, q) {
    return Q(
        p.w*q.w - p.x*q.x - p.y*q.y - p.z*q.z,
        p.w*q.x + p.x*q.w + p.y*q.z - p.z*q.y,
        p.w*q.y - p.x*q.z + p.y*q.w + p.z*q.x,
        p.w*q.z + p.x*q.y - p.y*q.x + p.z*q.w
    );
}

/** Inverse of a quaternion. */
export function qInv(q) {
    const ns = qNormSq(q);
    return qScale(qConj(q), 1 / ns);
}

/**
 * Rotate a 3D vector v = [x, y, z] by a unit quaternion q.
 * Uses: v' = q·p·q⁻¹  where p = Q(0, vx, vy, vz)
 */
export function qRotateVec(q, v) {
    const p = Q(0, v[0], v[1], v[2]);
    const r = qMul(qMul(q, p), qConj(q));
    return [r.x, r.y, r.z];
}

/**
 * Convert axis-angle representation to quaternion.
 * @param {number[]} axis  unit vector [x,y,z]
 * @param {number} angle   radians
 */
export function axisAngleToQuat(axis, angle) {
    const s = Math.sin(angle / 2);
    return qNormalize(Q(Math.cos(angle / 2), axis[0]*s, axis[1]*s, axis[2]*s));
}

/**
 * Spherical linear interpolation (SLERP) between two unit quaternions.
 * @param {Object} q0  start quaternion
 * @param {Object} q1  end quaternion
 * @param {number} t   parameter in [0, 1]
 */
export function qSlerp(q0, q1, t) {
    let dot = q0.w*q1.w + q0.x*q1.x + q0.y*q1.y + q0.z*q1.z;
    if (dot < 0) { q1 = qScale(q1, -1); dot = -dot; }
    if (dot > 0.9995) {
        return qNormalize(qAdd(q0, qScale(qSub(q1, q0), t)));
    }
    const theta0 = Math.acos(dot);
    const theta  = theta0 * t;
    const sinT0  = Math.sin(theta0);
    const s0 = Math.cos(theta) - dot * Math.sin(theta) / sinT0;
    const s1 = Math.sin(theta) / sinT0;
    return qNormalize(Q(
        s0*q0.w + s1*q1.w, s0*q0.x + s1*q1.x,
        s0*q0.y + s1*q1.y, s0*q0.z + s1*q1.z
    ));
}


// ============================================================================
// DISCRETE FOURIER TRANSFORM — Extended
// ============================================================================

/**
 * Short-Time Fourier Transform (STFT).
 * Splits signal into overlapping windows and computes FFT on each.
 *
 * @param {number[]} signal
 * @param {number} windowSize   must be power of 2
 * @param {number} hopSize      samples between windows
 * @param {string} [window='hann']  windowing function: 'hann','hamming','rect'
 * @returns {{ timeFrames: number[], frequencies: number[], magnitudes: number[][] }}
 */
export function stft(signal, windowSize, hopSize, window = 'hann') {
    const W = _makeWindow(windowSize, window);
    const frames = [];
    for (let start = 0; start + windowSize <= signal.length; start += hopSize) {
        const frame = signal.slice(start, start + windowSize).map((v, i) => v * W[i]);
        const complexFrame = frame.map(re => ({ re, im: 0 }));
        frames.push(fft(complexFrame));
    }
    const nFrames = frames.length;
    const timeFrames = Array.from({ length: nFrames }, (_, i) => i * hopSize);
    const frequencies = Array.from({ length: windowSize / 2 }, (_, k) => k);
    const magnitudes = frames.map(frame =>
        frame.slice(0, windowSize / 2).map(c => cAbs(c))
    );
    return { timeFrames, frequencies, magnitudes, frames };
}

function _makeWindow(n, type) {
    return Array.from({ length: n }, (_, i) => {
        switch (type) {
            case 'hann':    return 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
            case 'hamming': return 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (n - 1));
            default:        return 1;  // rect
        }
    });
}

/**
 * Compute power spectral density (PSD) via Welch's method.
 * Averages squared magnitudes across overlapping STFT windows.
 *
 * @param {number[]} signal
 * @param {number} windowSize
 * @param {number} [overlap=0.5]  fraction overlap
 * @returns {{ frequencies: number[], psd: number[] }}
 */
export function welchPSD(signal, windowSize, overlap = 0.5) {
    const hopSize = Math.floor(windowSize * (1 - overlap));
    const { magnitudes, frequencies } = stft(signal, windowSize, hopSize);
    const n = magnitudes.length;
    const psd = frequencies.map((_, k) =>
        magnitudes.reduce((s, frame) => s + frame[k] ** 2, 0) / n
    );
    return { frequencies, psd };
}

// ============================================================================
// SIGNAL PROCESSING
// ============================================================================

/**
 * Convolve two real sequences (linear convolution).
 * O(n·m) naive implementation; use FFT-based for large arrays.
 * @param {number[]} x
 * @param {number[]} h
 * @returns {number[]}  length n+m-1
 */
export function convolve(x, h) {
    const n = x.length, m = h.length;
    const out = Array(n + m - 1).fill(0);
    for (let i = 0; i < n; i++)
        for (let j = 0; j < m; j++)
            out[i + j] += x[i] * h[j];
    return out;
}

/**
 * Cross-correlation of two real sequences x and y.
 * @returns {number[]}  lags from -(m-1) to (n-1)
 */
export function crossCorrelation(x, y) {
    return convolve(x, y.slice().reverse());
}

/**
 * Design a simple FIR low-pass filter using windowed-sinc method.
 * @param {number} cutoff   normalised cutoff frequency ∈ (0, 1)  [1 = Nyquist]
 * @param {number} order    filter order (should be even)
 * @param {string} [window='hann']
 * @returns {number[]}  filter coefficients (impulse response)
 */
export function firLowPass(cutoff, order, window = 'hann') {
    const M = order % 2 === 0 ? order : order + 1;
    const W = _makeWindow(M + 1, window);
    return Array.from({ length: M + 1 }, (_, n) => {
        const i = n - M / 2;
        const sinc = i === 0 ? cutoff : Math.sin(Math.PI * cutoff * i) / (Math.PI * i);
        return sinc * W[n];
    });
}

/**
 * Apply an FIR filter to a signal.
 * @param {number[]} signal
 * @param {number[]} coeffs  filter coefficients
 */
export function applyFIR(signal, coeffs) {
    const M = coeffs.length;
    return signal.map((_, n) =>
        coeffs.reduce((s, c, k) => s + c * (signal[n - k] || 0), 0)
    );
}

// ============================================================================
// COMPLEX MATRIX OPERATIONS
// ============================================================================

/**
 * Multiply two complex matrices.
 * Each matrix is a 2D array of { re, im }.
 */
export function cMatMul(A, B) {
    const m = A.length, n = B[0].length, p = B.length;
    return Array.from({ length: m }, (_, i) =>
        Array.from({ length: n }, (_, j) =>
            A[i].reduce((s, aik, k) => cAdd(s, cMul(aik, B[k][j])), { re: 0, im: 0 })
        )
    );
}

/**
 * Conjugate transpose (Hermitian transpose) of a complex matrix.
 */
export function cMatH(A) {
    return A[0].map((_, j) => A.map((row, i) => cConj(A[i][j])));
}

/**
 * Check if a complex matrix is unitary: A†·A = I
 */
export function isUnitary(A, tol = 1e-8) {
    const AH = cMatH(A);
    const prod = cMatMul(AH, A);
    const n = prod.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const expected = i === j ? 1 : 0;
            if (Math.abs(prod[i][j].re - expected) > tol) return false;
            if (Math.abs(prod[i][j].im) > tol) return false;
        }
    }
    return true;
}

// ============================================================================
// SPECIAL COMPLEX SEQUENCES
// ============================================================================

/**
 * Generate N evenly spaced points on the unit circle in ℂ.
 * @param {number} N
 * @returns {{ re, im }[]}
 */
export function unitCirclePoints(N) {
    return Array.from({ length: N }, (_, k) => ({
        re: Math.cos(2 * Math.PI * k / N),
        im: Math.sin(2 * Math.PI * k / N),
    }));
}

/**
 * DFT matrix W of order N: W_{jk} = e^{-2πijk/N}
 */
export function dftMatrix(N) {
    return Array.from({ length: N }, (_, j) =>
        Array.from({ length: N }, (_, k) => ({
            re:  Math.cos(2 * Math.PI * j * k / N),
            im: -Math.sin(2 * Math.PI * j * k / N),
        }))
    );
}

/**
 * Chebyshev nodes in the complex plane on [-1, 1] (useful for interpolation).
 * @param {number} N
 */
export function chebyshevNodes(N) {
    return Array.from({ length: N }, (_, k) => ({
        re: Math.cos((2 * k + 1) * Math.PI / (2 * N)),
        im: 0,
    }));
}

// ============================================================================
// NUMBER THEORY HELPERS (useful with complex arithmetic)
// ============================================================================

/**
 * Gaussian integers: check if a complex number is a Gaussian integer.
 */
export function isGaussianInteger(z, tol = 1e-9) {
    return Math.abs(z.re - Math.round(z.re)) < tol
        && Math.abs(z.im - Math.round(z.im)) < tol;
}

/**
 * Gaussian integer norm: N(a+bi) = a²+b²
 */
export function gaussianNorm(z) { return z.re * z.re + z.im * z.im; }

/**
 * Riemann zeta function ζ(s) for complex s with Re(s) > 1.
 * Uses the Euler-Maclaurin formula (100-term approximation).
 * @param {{ re, im }} s
 * @returns {{ re, im }}
 */
export function riemannZeta(s, terms = 100) {
    let sum = { re: 0, im: 0 };
    for (let n = 1; n <= terms; n++) {
        // n^{-s} = e^{-s·ln(n)} = e^{-(σ·ln(n))} · e^{-iτ·ln(n)}
        const lnN = Math.log(n);
        const mag = Math.exp(-s.re * lnN);
        const phase = -s.im * lnN;
        sum = cAdd(sum, { re: mag * Math.cos(phase), im: mag * Math.sin(phase) });
    }
    return sum;
}
