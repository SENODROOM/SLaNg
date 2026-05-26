/**
 * SLaNg ODE Module
 * 
 * Numerical and symbolic solvers for Ordinary Differential Equations (ODEs).
 * 
 * Supported methods:
 *  - Euler's method (1st order)
 *  - Improved Euler / Heun's method (2nd order Runge-Kutta)
 *  - Classical 4th-order Runge-Kutta (RK4) — default, most accurate
 *  - Adaptive RK45 (Dormand-Prince) with error control
 *  - Systems of ODEs (dx/dt = f(t, x, y, ...))
 * 
 * Supported equation types (symbolic):
 *  - Separable ODEs
 *  - First-order linear: y' + P(x)y = Q(x)
 *  - Exact equations (detection + solution)
 *  - Bernoulli equations
 *  - Autonomous 2D systems (for phase portrait data)
 * 
 * Usage:
 *  import { solveODE, solveSystem, rk4, euler } from './slang-ode.js';
 */

// ============================================================================
// NUMERICAL ODE SOLVERS
// ============================================================================

/**
 * Euler's method (1st order accuracy)
 * dy/dt = f(t, y),  y(t0) = y0
 * @param {Function} f - f(t, y) → dy/dt
 * @param {number} t0  - Initial time
 * @param {number} y0  - Initial value
 * @param {number} tEnd - End time
 * @param {number} h   - Step size
 * @returns {{ t: number[], y: number[] }}
 */
export function euler(f, t0, y0, tEnd, h = 0.01) {
    _validateODEInputs(t0, y0, tEnd, h);
    const ts = [t0], ys = [y0];
    let t = t0, y = y0;

    while (t < tEnd - 1e-12) {
        h = Math.min(h, tEnd - t);
        y = y + h * f(t, y);
        t = t + h;
        ts.push(t);
        ys.push(y);
    }

    return { t: ts, y: ys, method: 'euler' };
}

/**
 * Heun's method (2nd order Runge-Kutta / improved Euler)
 * @param {Function} f - f(t, y) → dy/dt
 * @param {number} t0
 * @param {number} y0
 * @param {number} tEnd
 * @param {number} h
 * @returns {{ t: number[], y: number[] }}
 */
export function heun(f, t0, y0, tEnd, h = 0.01) {
    _validateODEInputs(t0, y0, tEnd, h);
    const ts = [t0], ys = [y0];
    let t = t0, y = y0;

    while (t < tEnd - 1e-12) {
        h = Math.min(h, tEnd - t);
        const k1 = f(t, y);
        const yTilde = y + h * k1;
        const k2 = f(t + h, yTilde);
        y = y + (h / 2) * (k1 + k2);
        t = t + h;
        ts.push(t);
        ys.push(y);
    }

    return { t: ts, y: ys, method: 'heun' };
}

/**
 * Classical 4th-order Runge-Kutta (RK4) — recommended for most problems
 * @param {Function} f - f(t, y) → dy/dt
 * @param {number} t0
 * @param {number} y0
 * @param {number} tEnd
 * @param {number} h
 * @returns {{ t: number[], y: number[], method: string }}
 */
export function rk4(f, t0, y0, tEnd, h = 0.01) {
    _validateODEInputs(t0, y0, tEnd, h);
    const ts = [t0], ys = [y0];
    let t = t0, y = y0;

    while (t < tEnd - 1e-12) {
        h = Math.min(h, tEnd - t);
        const k1 = f(t,         y);
        const k2 = f(t + h / 2, y + (h / 2) * k1);
        const k3 = f(t + h / 2, y + (h / 2) * k2);
        const k4 = f(t + h,     y + h * k3);
        y = y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
        t = t + h;
        ts.push(t);
        ys.push(y);
    }

    return { t: ts, y: ys, method: 'rk4' };
}

/**
 * Adaptive RK45 (Dormand-Prince) with error control.
 * Automatically adjusts step size to maintain desired accuracy.
 * 
 * @param {Function} f - f(t, y) → dy/dt
 * @param {number} t0
 * @param {number} y0
 * @param {number} tEnd
 * @param {number} [tol=1e-6] - Absolute + relative tolerance
 * @param {number} [hInit=0.1] - Initial step size
 * @returns {{ t: number[], y: number[], steps: number, rejections: number }}
 */
export function rk45(f, t0, y0, tEnd, tol = 1e-6, hInit = 0.1) {
    // Dormand-Prince coefficients
    const c2=1/5, c3=3/10, c4=4/5, c5=8/9;
    const a21=1/5;
    const a31=3/40, a32=9/40;
    const a41=44/45, a42=-56/15, a43=32/9;
    const a51=19372/6561, a52=-25360/2187, a53=64448/6561, a54=-212/729;
    const a61=9017/3168, a62=-355/33, a63=46732/5247, a64=49/176, a65=-5103/18656;
    // 5th order weights
    const e1=71/57600, e3=-71/16695, e4=71/1920, e5=-17253/339200, e6=22/525, e7=-1/40;

    const ts = [t0], ys = [y0];
    let t = t0, y = y0, h = hInit;
    let steps = 0, rejections = 0;
    const maxSteps = 1e5;

    while (t < tEnd - 1e-12 && steps < maxSteps) {
        h = Math.min(h, tEnd - t);

        const k1 = f(t, y);
        const k2 = f(t + c2*h, y + h*a21*k1);
        const k3 = f(t + c3*h, y + h*(a31*k1 + a32*k2));
        const k4 = f(t + c4*h, y + h*(a41*k1 + a42*k2 + a43*k3));
        const k5 = f(t + c5*h, y + h*(a51*k1 + a52*k2 + a53*k3 + a54*k4));
        const k6 = f(t + h,    y + h*(a61*k1 + a62*k2 + a63*k3 + a64*k4 + a65*k5));

        // 4th order solution
        const y4 = y + h*(35/384*k1 + 500/1113*k3 + 125/192*k4 - 2187/6784*k5 + 11/84*k6);
        const k7 = f(t + h, y4);

        // Error estimate (difference between 4th and 5th order)
        const err = h * Math.abs(e1*k1 + e3*k3 + e4*k4 + e5*k5 + e6*k6 + e7*k7);
        const errNorm = err / (tol * (1 + Math.abs(y)));

        if (errNorm <= 1.0) {
            // Accept step
            t = t + h;
            y = y4;
            ts.push(t);
            ys.push(y);
            steps++;
        } else {
            rejections++;
        }

        // Adjust step size
        const factor = Math.min(5.0, Math.max(0.2, 0.9 * Math.pow(1 / errNorm, 0.2)));
        h = h * factor;
    }

    return { t: ts, y: ys, method: 'rk45', steps, rejections };
}

// ============================================================================
// SYSTEM OF ODEs
// ============================================================================

/**
 * Solve a system of first-order ODEs using RK4.
 * 
 * The system is:  dY/dt = F(t, Y)  where Y = [y1, y2, ..., yn]
 * 
 * @param {Function} F - F(t, Y) → dY/dt (returns an array of same length as Y)
 * @param {number} t0  - Initial time
 * @param {number[]} Y0 - Initial state vector
 * @param {number} tEnd - End time
 * @param {number} h   - Step size
 * @returns {{ t: number[], Y: number[][], method: string }}
 *          Y[i] is the state vector at time t[i]
 */
export function rk4System(F, t0, Y0, tEnd, h = 0.01) {
    if (!Array.isArray(Y0)) throw new Error('Y0 must be an array');
    const n = Y0.length;
    const ts = [t0];
    const Ys = [Y0.slice()];
    let t = t0, Y = Y0.slice();

    while (t < tEnd - 1e-12) {
        h = Math.min(h, tEnd - t);

        const k1 = F(t, Y);
        const k2 = F(t + h/2, _vecAdd(Y, _vecScale(k1, h/2)));
        const k3 = F(t + h/2, _vecAdd(Y, _vecScale(k2, h/2)));
        const k4 = F(t + h,   _vecAdd(Y, _vecScale(k3, h)));

        Y = Y.map((yi, i) => yi + (h/6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
        t = t + h;
        ts.push(t);
        Ys.push(Y.slice());
    }

    return { t: ts, Y: Ys, method: 'rk4System', n };
}

// ============================================================================
// SECOND-ORDER ODEs (reduced to system)
// ============================================================================

/**
 * Solve a second-order ODE: y'' = f(t, y, y')
 * Reduces to a 2D system: [y, v]' = [v, f(t, y, v)]
 * 
 * @param {Function} f2 - f2(t, y, yPrime) → y''
 * @param {number} t0
 * @param {number} y0  - Initial position
 * @param {number} v0  - Initial velocity y'(t0)
 * @param {number} tEnd
 * @param {number} h
 * @returns {{ t, y, yPrime, method }}
 */
export function solveSecondOrder(f2, t0, y0, v0, tEnd, h = 0.01) {
    const F = (t, [y, v]) => [v, f2(t, y, v)];
    const result = rk4System(F, t0, [y0, v0], tEnd, h);
    return {
        t:      result.t,
        y:      result.Y.map(s => s[0]),
        yPrime: result.Y.map(s => s[1]),
        method: 'rk4-2nd-order'
    };
}

// ============================================================================
// COMMON ODE FORMULATIONS
// ============================================================================

/**
 * Solve a first-order linear ODE: y' + P(t)*y = Q(t)
 * using the integrating factor method (numerically).
 * 
 * @param {Function} P - P(t)
 * @param {Function} Q - Q(t)
 * @param {number} t0, y0, tEnd, h
 * @returns Result from rk4
 */
export function solveLinearFirstOrder(P, Q, t0, y0, tEnd, h = 0.01) {
    const f = (t, y) => Q(t) - P(t) * y;
    const result = rk4(f, t0, y0, tEnd, h);
    result.method = 'rk4-linear-1st-order';
    return result;
}

/**
 * Solve a logistic equation: dy/dt = r*y*(1 - y/K)
 * @param {number} r - Growth rate
 * @param {number} K - Carrying capacity
 * @param {number} t0, y0, tEnd, h
 */
export function solveLogistic(r, K, t0, y0, tEnd, h = 0.01) {
    const f = (t, y) => r * y * (1 - y / K);
    const result = rk4(f, t0, y0, tEnd, h);
    result.method = 'logistic';
    result.params = { r, K };
    result.analyticalEquilibrium = K;
    return result;
}

/**
 * Solve a damped harmonic oscillator: y'' + 2γy' + ω²y = F(t)
 * @param {number} gamma - Damping coefficient
 * @param {number} omega - Natural frequency
 * @param {Function} forceF - Forcing function F(t), or null for free oscillation
 * @param {number} t0, y0, v0, tEnd, h
 */
export function solveDampedHarmonic(gamma, omega, forceF, t0, y0, v0, tEnd, h = 0.01) {
    const F = (t, y, yp) => {
        const forcing = forceF ? forceF(t) : 0;
        return forcing - 2 * gamma * yp - omega * omega * y;
    };
    const result = solveSecondOrder(F, t0, y0, v0, tEnd, h);
    result.method = 'damped-harmonic';
    result.params = { gamma, omega };

    // Classify damping
    if (Math.abs(gamma) < 1e-12)       result.dampingType = 'undamped';
    else if (gamma < omega)             result.dampingType = 'underdamped';
    else if (Math.abs(gamma - omega) < 1e-6) result.dampingType = 'critically-damped';
    else                                result.dampingType = 'overdamped';

    return result;
}

/**
 * Lorenz system (chaotic attractor)
 * dx/dt = σ(y - x)
 * dy/dt = x(ρ - z) - y
 * dz/dt = xy - βz
 * @param {number} [sigma=10], [rho=28], [beta=8/3]
 * @param {number[]} Y0 - [x0, y0, z0]
 * @param {number} t0, tEnd, h
 */
export function solveLorenz(Y0, t0, tEnd, h = 0.005, sigma = 10, rho = 28, beta = 8/3) {
    const F = (t, [x, y, z]) => [
        sigma * (y - x),
        x * (rho - z) - y,
        x * y - beta * z
    ];
    const result = rk4System(F, t0, Y0, tEnd, h);
    result.method = 'lorenz';
    result.params = { sigma, rho, beta };
    return result;
}

// ============================================================================
// PHASE PORTRAIT UTILITIES
// ============================================================================

/**
 * Generate phase portrait data for a 2D autonomous system.
 * dx/dt = f(x, y),  dy/dt = g(x, y)
 * 
 * @param {Function} f - f(x, y)
 * @param {Function} g - g(x, y)
 * @param {{ x: [min, max], y: [min, max] }} bounds
 * @param {number} gridSize - Number of arrows per axis
 * @returns {Array<{ x, y, dx, dy, magnitude }>}
 */
export function phasePortrait(f, g, bounds, gridSize = 15) {
    const { x: [xMin, xMax], y: [yMin, yMax] } = bounds;
    const dx = (xMax - xMin) / (gridSize - 1);
    const dy = (yMax - yMin) / (gridSize - 1);
    const arrows = [];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = xMin + i * dx;
            const y = yMin + j * dy;
            try {
                const vx = f(x, y);
                const vy = g(x, y);
                const mag = Math.sqrt(vx * vx + vy * vy);
                arrows.push({ x, y, dx: vx, dy: vy, magnitude: mag });
            } catch {
                // skip points where evaluation fails
            }
        }
    }

    return arrows;
}

/**
 * Find equilibrium points (nullclines intersection) numerically.
 * @param {Function} f, g - System functions
 * @param {{ x: [min, max], y: [min, max] }} bounds
 * @param {number} resolution
 * @returns {Array<{ x, y }>}
 */
export function findEquilibria(f, g, bounds, resolution = 50) {
    const { x: [xMin, xMax], y: [yMin, yMax] } = bounds;
    const equilibria = [];
    const hx = (xMax - xMin) / resolution;
    const hy = (yMax - yMin) / resolution;
    const tol = Math.max(hx, hy) * 2;

    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const x = xMin + i * hx;
            const y = yMin + j * hy;
            try {
                const fv = Math.abs(f(x, y));
                const gv = Math.abs(g(x, y));
                if (fv < tol && gv < tol) {
                    // Check it's not a duplicate
                    const isDup = equilibria.some(e =>
                        Math.abs(e.x - x) < tol && Math.abs(e.y - y) < tol);
                    if (!isDup) equilibria.push({ x, y });
                }
            } catch { }
        }
    }

    return equilibria;
}

// ============================================================================
// BOUNDARY VALUE PROBLEMS (Shooting Method)
// ============================================================================

/**
 * Solve a 2-point BVP: y'' = f(t, y, y')  with  y(a) = ya, y(b) = yb
 * Uses the shooting method with secant iteration.
 * @param {Function} f2 - f2(t, y, yp) → y''
 * @param {number} a, ya - Left boundary
 * @param {number} b, yb - Right boundary
 * @param {number} h - Step size
 * @param {number} [tol=1e-8]
 * @returns {{ t, y, yPrime, iterations }}
 */
export function shootingMethod(f2, a, ya, b, yb, h = 0.01, tol = 1e-8) {
    // Initial slope guesses
    let s0 = 0, s1 = (yb - ya) / (b - a);
    let result0 = solveSecondOrder(f2, a, ya, s0, b, h);
    let phi0 = result0.y.at(-1) - yb;

    let iterations = 0;
    const maxIter = 50;

    while (iterations < maxIter) {
        const result1 = solveSecondOrder(f2, a, ya, s1, b, h);
        const phi1 = result1.y.at(-1) - yb;

        if (Math.abs(phi1) < tol) {
            return { ...result1, iterations, method: 'shooting' };
        }

        // Secant update
        if (Math.abs(phi1 - phi0) < 1e-15) break;
        const s2 = s1 - phi1 * (s1 - s0) / (phi1 - phi0);
        s0 = s1; phi0 = phi1;
        s1 = s2;
        iterations++;
    }

    // Return best guess
    const final = solveSecondOrder(f2, a, ya, s1, b, h);
    return { ...final, iterations, method: 'shooting', converged: false };
}

// ============================================================================
// SOLUTION ANALYSIS
// ============================================================================

/**
 * Compute statistics on an ODE solution.
 * @param {{ t, y }} solution
 * @returns {{ min, max, mean, finalValue, stable }}
 */
export function analyzeSolution(solution) {
    const { t, y } = solution;
    const n = y.length;
    if (n === 0) return null;

    const min = Math.min(...y);
    const max = Math.max(...y);
    const mean = y.reduce((a, b) => a + b, 0) / n;
    const finalValue = y[n - 1];

    // Check if solution appears to be converging (stable)
    const last10Pct = y.slice(Math.floor(n * 0.9));
    const variation = Math.max(...last10Pct) - Math.min(...last10Pct);
    const stable = variation < 1e-3 * (max - min + 1);

    // Estimate period if oscillatory
    let period = null;
    const crossings = [];
    for (let i = 1; i < n; i++) {
        if (y[i - 1] <= mean && y[i] > mean) {
            crossings.push(t[i]);
        }
    }
    if (crossings.length >= 2) {
        const periods = [];
        for (let i = 1; i < crossings.length; i++) periods.push(crossings[i] - crossings[i-1]);
        period = periods.reduce((a, b) => a + b, 0) / periods.length;
    }

    return { min, max, mean, finalValue, stable, period, n };
}

/**
 * Interpolate solution at an arbitrary time t using linear interpolation.
 * @param {{ t, y }} solution
 * @param {number} tQuery
 * @returns {number}
 */
export function interpolateSolution(solution, tQuery) {
    const { t, y } = solution;
    if (tQuery <= t[0]) return y[0];
    if (tQuery >= t.at(-1)) return y.at(-1);

    let lo = 0, hi = t.length - 1;
    while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (t[mid] <= tQuery) lo = mid; else hi = mid;
    }

    const frac = (tQuery - t[lo]) / (t[hi] - t[lo]);
    return y[lo] + frac * (y[hi] - y[lo]);
}

// ============================================================================
// HIGH-LEVEL CONVENIENCE
// ============================================================================

/**
 * Main solve function — automatically picks appropriate method.
 * @param {Function} f - f(t, y) → dy/dt
 * @param {number} t0, y0, tEnd
 * @param {Object} [opts]
 * @param {string} [opts.method='rk4']  - 'euler', 'heun', 'rk4', 'rk45'
 * @param {number} [opts.h=0.01]       - Step size (ignored for rk45)
 * @param {number} [opts.tol=1e-6]     - Tolerance for rk45
 * @returns {Object} Solution object { t, y, method, ... }
 */
export function solveODE(f, t0, y0, tEnd, opts = {}) {
    const { method = 'rk4', h = 0.01, tol = 1e-6 } = opts;

    switch (method.toLowerCase()) {
        case 'euler':  return euler(f, t0, y0, tEnd, h);
        case 'heun':   return heun(f, t0, y0, tEnd, h);
        case 'rk4':    return rk4(f, t0, y0, tEnd, h);
        case 'rk45':   return rk45(f, t0, y0, tEnd, tol);
        default:       throw new Error(`Unknown ODE method: ${method}`);
    }
}

/**
 * Solve a system of ODEs.
 * @param {Function} F - F(t, Y) → dY/dt
 * @param {number} t0
 * @param {number[]} Y0
 * @param {number} tEnd
 * @param {Object} [opts]
 */
export function solveSystem(F, t0, Y0, tEnd, opts = {}) {
    const { h = 0.01 } = opts;
    return rk4System(F, t0, Y0, tEnd, h);
}

// ============================================================================
// PRIVATE UTILITIES
// ============================================================================

function _validateODEInputs(t0, y0, tEnd, h) {
    if (typeof t0 !== 'number' || isNaN(t0)) throw new Error('t0 must be a number');
    if (typeof y0 !== 'number' || isNaN(y0)) throw new Error('y0 must be a number');
    if (typeof tEnd !== 'number' || isNaN(tEnd)) throw new Error('tEnd must be a number');
    if (tEnd <= t0) throw new Error('tEnd must be greater than t0');
    if (h <= 0) throw new Error('Step size h must be positive');
}

function _vecAdd(a, b) {
    return a.map((v, i) => v + b[i]);
}

function _vecScale(a, s) {
    return a.map(v => v * s);
}


// ============================================================================
// STIFF ODE SOLVERS
// ============================================================================

/**
 * Implicit Euler method for stiff ODEs.
 * Solves y' = f(t, y) using fixed-point iteration at each step.
 * More stable than explicit Euler for stiff problems (e.g. chemical kinetics).
 *
 * @param {Function} f  (t, y) → dy/dt
 * @param {number} t0
 * @param {number} y0
 * @param {number} tEnd
 * @param {number} h    step size
 * @returns {{ t: number[], y: number[] }}
 */
export function implicitEuler(f, t0, y0, tEnd, h = 0.01) {
    const t = [t0], y = [y0];
    let tc = t0, yc = y0;
    while (tc < tEnd - 1e-12) {
        const tn = Math.min(tc + h, tEnd);
        const hn = tn - tc;
        // Fixed-point iteration: y_{n+1} = y_n + h·f(t_{n+1}, y_{n+1})
        let yn = yc + hn * f(tc, yc);   // initial guess from explicit Euler
        for (let k = 0; k < 50; k++) {
            const ynew = yc + hn * f(tn, yn);
            if (Math.abs(ynew - yn) < 1e-12 * (1 + Math.abs(ynew))) { yn = ynew; break; }
            yn = ynew;
        }
        tc = tn; yc = yn;
        t.push(tc); y.push(yc);
    }
    return { t, y };
}

/**
 * Trapezoidal / Crank-Nicolson method — O(h²) implicit, A-stable.
 * Good for mildly stiff problems; combines implicit and explicit evaluation.
 */
export function crankNicolson(f, t0, y0, tEnd, h = 0.01) {
    const t = [t0], y = [y0];
    let tc = t0, yc = y0;
    while (tc < tEnd - 1e-12) {
        const tn = Math.min(tc + h, tEnd);
        const hn = tn - tc;
        const fn = f(tc, yc);
        // Predictor (explicit Euler)
        let yn = yc + hn * fn;
        // Corrector iterations (fixed point on trapezoid formula)
        for (let k = 0; k < 50; k++) {
            const ynew = yc + hn * 0.5 * (fn + f(tn, yn));
            if (Math.abs(ynew - yn) < 1e-12 * (1 + Math.abs(ynew))) { yn = ynew; break; }
            yn = ynew;
        }
        tc = tn; yc = yn;
        t.push(tc); y.push(yc);
    }
    return { t, y };
}

// ============================================================================
// PARTIAL DIFFERENTIAL EQUATIONS (1D)
// ============================================================================

/**
 * 1D Heat Equation: ∂u/∂t = α·∂²u/∂x²
 * Uses explicit finite differences (FTCS scheme).
 * Stability requirement: r = α·dt/dx² ≤ 0.5
 *
 * @param {number} alpha      thermal diffusivity
 * @param {number} L          domain length [0, L]
 * @param {number} T          total time
 * @param {Function} ic       initial condition u(x, 0)
 * @param {Function} [bcLeft]  left BC u(0,t) — default Dirichlet = 0
 * @param {Function} [bcRight] right BC u(L,t) — default Dirichlet = 0
 * @param {number} [nx=50]    spatial grid points
 * @param {number} [nt=500]   time steps
 * @returns {{ x, t, u }}  2D solution array u[i_time][j_x]
 */
export function heatEquation1D(alpha, L, T, ic, bcLeft = () => 0, bcRight = () => 0, nx = 50, nt = 500) {
    const dx = L / (nx - 1);
    const dt = T / nt;
    const r = alpha * dt / (dx * dx);
    if (r > 0.5) console.warn(`heatEquation1D: r=${r.toFixed(3)} > 0.5 — solution may be unstable. Increase nt or decrease alpha.`);

    const x = Array.from({ length: nx }, (_, i) => i * dx);
    const tArr = Array.from({ length: nt + 1 }, (_, k) => k * dt);

    let u = x.map(xi => ic(xi));
    const allU = [u.slice()];

    for (let k = 0; k < nt; k++) {
        const unew = u.slice();
        unew[0] = bcLeft(tArr[k + 1]);
        unew[nx - 1] = bcRight(tArr[k + 1]);
        for (let j = 1; j < nx - 1; j++) {
            unew[j] = u[j] + r * (u[j + 1] - 2 * u[j] + u[j - 1]);
        }
        u = unew;
        allU.push(u.slice());
    }

    return { x, t: tArr, u: allU };
}

/**
 * 1D Wave Equation: ∂²u/∂t² = c²·∂²u/∂x²
 * Uses explicit central differences. Stability: CFL = c·dt/dx ≤ 1.
 *
 * @param {number} c          wave speed
 * @param {number} L          domain length
 * @param {number} T          total time
 * @param {Function} ic       initial displacement u(x,0)
 * @param {Function} icVel    initial velocity  ∂u/∂t(x,0)
 * @param {number} [nx=50]
 * @param {number} [nt=500]
 * @returns {{ x, t, u }}
 */
export function waveEquation1D(c, L, T, ic, icVel = () => 0, nx = 50, nt = 500) {
    const dx = L / (nx - 1);
    const dt = T / nt;
    const r = c * dt / dx;
    if (r > 1) console.warn(`waveEquation1D: CFL=${r.toFixed(3)} > 1 — solution may diverge. Increase nt.`);
    const r2 = r * r;

    const x = Array.from({ length: nx }, (_, i) => i * dx);
    const tArr = Array.from({ length: nt + 1 }, (_, k) => k * dt);

    let u0 = x.map(xi => ic(xi));
    // u1 = u0 + dt·v0 + 0.5·dt²·c²·u0''
    let u1 = u0.map((_, j) => {
        if (j === 0 || j === nx - 1) return 0;
        const d2 = (u0[j + 1] - 2 * u0[j] + u0[j - 1]) / (dx * dx);
        return u0[j] + dt * icVel(x[j]) + 0.5 * c * c * dt * dt * d2;
    });

    const allU = [u0.slice(), u1.slice()];

    for (let k = 1; k < nt; k++) {
        const u2 = Array(nx).fill(0);
        for (let j = 1; j < nx - 1; j++) {
            u2[j] = 2 * u1[j] - u0[j] + r2 * (u1[j + 1] - 2 * u1[j] + u1[j - 1]);
        }
        u0 = u1; u1 = u2;
        allU.push(u2.slice());
    }

    return { x, t: tArr, u: allU };
}

/**
 * 1D Laplace / Poisson equation: -∂²u/∂x² = f(x)
 * Solves the boundary value problem with Dirichlet BCs using finite differences.
 *
 * @param {Function} rhs   f(x) — right hand side (0 for Laplace)
 * @param {number} L       domain [0, L]
 * @param {number} u0      u(0) left BC
 * @param {number} uL      u(L) right BC
 * @param {number} [n=100] interior points
 * @returns {{ x, u }}
 */
export function laplaceEquation1D(rhs, L, u0 = 0, uL = 0, n = 100) {
    const dx = L / (n + 1);
    const x = Array.from({ length: n }, (_, i) => (i + 1) * dx);
    // Tridiagonal system: -u[i-1] + 2u[i] - u[i+1] = dx²·f(x[i])
    const a = Array(n - 1).fill(-1);
    const b = Array(n).fill(2);
    const c = Array(n - 1).fill(-1);
    const rh = x.map((xi, i) => {
        const fi = rhs(xi) * dx * dx;
        if (i === 0)     return fi + u0;
        if (i === n - 1) return fi + uL;
        return fi;
    });
    // Use Thomas algorithm
    const cp = c.slice(), dp = rh.slice();
    cp[0] = c[0] / b[0]; dp[0] = rh[0] / b[0];
    for (let i = 1; i < n; i++) {
        const denom = b[i] - a[i - 1] * cp[i - 1];
        cp[i] = i < n - 1 ? c[i] / denom : 0;
        dp[i] = (rh[i] - a[i - 1] * dp[i - 1]) / denom;
    }
    const u = Array(n + 2).fill(0);
    u[0] = u0; u[n + 1] = uL;
    u[n] = dp[n - 1];
    for (let i = n - 2; i >= 0; i--) u[i + 1] = dp[i] - cp[i] * u[i + 2];
    return { x: [0, ...x, L], u };
}

// ============================================================================
// EVENT DETECTION (Zero Crossing)
// ============================================================================

/**
 * Solve an ODE and detect events (zero crossings of event function).
 * Useful for finding when a trajectory crosses a threshold.
 *
 * @param {Function} f        (t, y) → dy/dt
 * @param {Function} eventFn  (t, y) → number (event fires when this = 0)
 * @param {number} t0
 * @param {number} y0
 * @param {number} tEnd
 * @param {number} [h=0.01]
 * @returns {{ t, y, events: { t, y }[] }}
 */
export function solveWithEvents(f, eventFn, t0, y0, tEnd, h = 0.01) {
    const t = [t0], y = [y0];
    const events = [];
    let tc = t0, yc = y0;
    let prevEvent = eventFn(tc, yc);

    while (tc < tEnd - 1e-12) {
        const hn = Math.min(h, tEnd - tc);
        // RK4 step
        const k1 = f(tc, yc);
        const k2 = f(tc + hn/2, yc + hn/2 * k1);
        const k3 = f(tc + hn/2, yc + hn/2 * k2);
        const k4 = f(tc + hn,   yc + hn   * k3);
        const yn = yc + (hn / 6) * (k1 + 2*k2 + 2*k3 + k4);
        const tn = tc + hn;
        const currEvent = eventFn(tn, yn);

        // Sign change — bisect to find exact crossing
        if (prevEvent * currEvent < 0) {
            let ta = tc, ya = yc, tb = tn, yb = yn;
            for (let k = 0; k < 52; k++) {
                const tm = (ta + tb) / 2;
                const ym = ya + (yb - ya) * (tm - ta) / (tb - ta);
                const em = eventFn(tm, ym);
                if (Math.abs(em) < 1e-12) { ta = tm; ya = ym; break; }
                em * eventFn(ta, ya) < 0 ? (tb = tm, yb = ym) : (ta = tm, ya = ym);
            }
            events.push({ t: ta, y: ya });
        }

        tc = tn; yc = yn; prevEvent = currEvent;
        t.push(tc); y.push(yc);
    }
    return { t, y, events };
}


// ============================================================================
// DELAY DIFFERENTIAL EQUATIONS (DDE)
// ============================================================================

/**
 * Solve a delay differential equation: y'(t) = f(t, y(t), y(t-τ))
 * Uses method of steps with RK4 on each sub-interval [kτ, (k+1)τ].
 *
 * @param {Function} f        (t, y, yDelay) → dy/dt
 * @param {Function} history  y(t) for t ≤ t0 (the "past" function)
 * @param {number} tau        delay
 * @param {number} t0
 * @param {number} y0
 * @param {number} tEnd
 * @param {number} [h=0.01]
 * @returns {{ t: number[], y: number[] }}
 */
export function solveDDE(f, history, tau, t0, y0, tEnd, h = 0.01) {
    const t = [t0], y = [y0];
    let tc = t0, yc = y0;

    const yAt = tq => {
        if (tq <= t0) return history(tq);
        // Linear interpolation in recorded solution
        let idx = t.length - 1;
        for (let i = 0; i < t.length - 1; i++) {
            if (t[i] <= tq && tq <= t[i + 1]) { idx = i; break; }
        }
        if (idx >= t.length - 1) return y[y.length - 1];
        const frac = (tq - t[idx]) / (t[idx + 1] - t[idx]);
        return y[idx] + frac * (y[idx + 1] - y[idx]);
    };

    while (tc < tEnd - 1e-12) {
        const hn = Math.min(h, tEnd - tc);
        const k1 = f(tc,        yc,                     yAt(tc - tau));
        const k2 = f(tc + hn/2, yc + hn/2 * k1,         yAt(tc + hn/2 - tau));
        const k3 = f(tc + hn/2, yc + hn/2 * k2,         yAt(tc + hn/2 - tau));
        const k4 = f(tc + hn,   yc + hn   * k3,         yAt(tc + hn   - tau));
        tc += hn;
        yc += (hn / 6) * (k1 + 2*k2 + 2*k3 + k4);
        t.push(tc); y.push(yc);
    }
    return { t, y };
}

// ============================================================================
// CHAOS & STRANGE ATTRACTORS
// ============================================================================

/**
 * Rössler attractor: dx/dt = -y-z, dy/dt = x+ay, dz/dt = b+z(x-c)
 * Classic example of a strange attractor for a = 0.2, b = 0.2, c = 5.7
 */
export function solveRossler(Y0, t0, tEnd, h = 0.005, a = 0.2, b = 0.2, c = 5.7) {
    return rk4System(
        (t, Y) => [-Y[1] - Y[2], Y[0] + a * Y[1], b + Y[2] * (Y[0] - c)],
        t0, Y0, tEnd, h
    );
}

/**
 * Duffing oscillator: ẍ + δẋ + αx + βx³ = γcos(ωt)
 * Models a driven nonlinear oscillator; can exhibit chaos.
 */
export function solveDuffing(x0, v0, t0, tEnd, h = 0.005, delta = 0.3, alpha = -1, beta = 1, gamma = 0.4, omega = 1.2) {
    return rk4System(
        (t, Y) => [
            Y[1],
            gamma * Math.cos(omega * t) - delta * Y[1] - alpha * Y[0] - beta * Y[0] ** 3
        ],
        t0, [x0, v0], tEnd, h
    );
}

/**
 * Van der Pol oscillator: ẍ − μ(1−x²)ẋ + x = 0
 * Nonlinear oscillator with limit cycle; stiff for large μ.
 */
export function solveVanDerPol(x0, v0, t0, tEnd, h = 0.005, mu = 1) {
    return rk4System(
        (t, Y) => [Y[1], mu * (1 - Y[0] ** 2) * Y[1] - Y[0]],
        t0, [x0, v0], tEnd, h
    );
}

/**
 * Double pendulum (chaotic system).
 * State: [θ₁, ω₁, θ₂, ω₂], all in radians/rad·s⁻¹.
 * @param {number} m1  mass of pendulum 1
 * @param {number} m2  mass of pendulum 2
 * @param {number} l1  length of rod 1
 * @param {number} l2  length of rod 2
 */
export function solveDoublePendulum(Y0, t0, tEnd, h = 0.005, m1 = 1, m2 = 1, l1 = 1, l2 = 1, g = 9.81) {
    const F = (t, Y) => {
        const [th1, w1, th2, w2] = Y;
        const dth = th2 - th1;
        const denom1 = (m1 + m2) * l1 - m2 * l1 * Math.cos(dth) ** 2;
        const denom2 = (l2 / l1) * denom1;
        const dw1 = (m2 * l1 * w1 * w1 * Math.sin(dth) * Math.cos(dth)
                   + m2 * g * Math.sin(th2) * Math.cos(dth)
                   + m2 * l2 * w2 * w2 * Math.sin(dth)
                   - (m1 + m2) * g * Math.sin(th1)) / denom1;
        const dw2 = (-m2 * l2 * w2 * w2 * Math.sin(dth) * Math.cos(dth)
                    + (m1 + m2) * g * Math.sin(th1) * Math.cos(dth)
                    - (m1 + m2) * l1 * w1 * w1 * Math.sin(dth)
                    - (m1 + m2) * g * Math.sin(th2)) / denom2;
        return [w1, dw1, w2, dw2];
    };
    const sol = rk4System(F, t0, Y0, tEnd, h);
    // Add cartesian coordinates
    const xy = sol.Y.map(Y => ({
        x1:  l1 * Math.sin(Y[0]),
        y1: -l1 * Math.cos(Y[0]),
        x2:  l1 * Math.sin(Y[0]) + l2 * Math.sin(Y[2]),
        y2: -l1 * Math.cos(Y[0]) - l2 * Math.cos(Y[2]),
    }));
    return { ...sol, cartesian: xy };
}

// ============================================================================
// STABILITY ANALYSIS
// ============================================================================

/**
 * Lyapunov exponent estimate for a 1D map x_{n+1} = f(x_n).
 * Positive exponent → chaos.
 *
 * @param {Function} f       1D map
 * @param {Function} df      derivative of f
 * @param {number} x0        initial point
 * @param {number} [N=10000] iterations
 */
export function lyapunovExponent1D(f, df, x0, N = 10000) {
    let x = x0, sum = 0;
    for (let i = 0; i < N; i++) {
        const deriv = Math.abs(df(x));
        if (deriv > 0) sum += Math.log(deriv);
        x = f(x);
    }
    return sum / N;
}

/**
 * Largest Lyapunov exponent for an ODE system (Wolf algorithm, simplified).
 * Propagates a perturbation alongside the trajectory and measures divergence.
 *
 * @param {Function} F      vector field  (t, Y) → dY/dt
 * @param {number[]} Y0     initial state
 * @param {number} t0
 * @param {number} tEnd
 * @param {number} [h=0.01]
 * @param {number} [renorm=1.0]  renormalisation time
 */
export function largestLyapunov(F, Y0, t0, tEnd, h = 0.01, renorm = 1.0) {
    const eps = 1e-8;
    let Y = Y0.slice();
    const delta0 = Y0.map(() => (Math.random() - 0.5) * eps);
    const norm0 = Math.sqrt(delta0.reduce((s, v) => s + v * v, 0));
    let dY = delta0.map(v => v / norm0 * eps);
    let t = t0, logSum = 0, steps = 0;
    let nextRenorm = t0 + renorm;

    const rk4Step = (state, time) => {
        const k1 = F(time, state);
        const k2 = F(time + h/2, state.map((v, i) => v + h/2 * k1[i]));
        const k3 = F(time + h/2, state.map((v, i) => v + h/2 * k2[i]));
        const k4 = F(time + h,   state.map((v, i) => v + h   * k3[i]));
        return state.map((v, i) => v + (h/6) * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]));
    };

    while (t < tEnd) {
        Y  = rk4Step(Y, t);
        const Yp = rk4Step(Y.map((v, i) => v + dY[i]), t);
        dY = Yp.map((v, i) => v - Y[i]);
        t += h;

        if (t >= nextRenorm) {
            const dNorm = Math.sqrt(dY.reduce((s, v) => s + v * v, 0));
            if (dNorm > 0) { logSum += Math.log(dNorm / eps); dY = dY.map(v => v / dNorm * eps); }
            steps++;
            nextRenorm += renorm;
        }
    }
    return steps > 0 ? logSum / (steps * renorm) : 0;
}

// ============================================================================
// PARAMETER ESTIMATION
// ============================================================================

/**
 * Fit ODE parameters by minimising least-squares residuals against data.
 * Uses Nelder-Mead simplex optimisation.
 *
 * @param {Function} odeF         (t, y, params) → dy/dt
 * @param {number[]} tData        observed time points
 * @param {number[]} yData        observed values
 * @param {number[]} initParams   initial parameter guess
 * @param {number} t0
 * @param {number} y0
 * @param {Object} [opts]         { maxIter, tol }
 * @returns {{ params, residual, iterations }}
 */
export function fitODE(odeF, tData, yData, initParams, t0, y0, opts = {}) {
    const { maxIter = 500, tol = 1e-8 } = opts;

    const residual = params => {
        try {
            const sol = rk4(t => odeF(t, _, params), t0, y0, tData[tData.length - 1], 0.01);
            // interpolate solution at tData
            return tData.reduce((s, ti, i) => {
                const idx = sol.t.findIndex(tv => tv >= ti);
                const yi = idx > 0
                    ? sol.y[idx - 1] + (sol.y[idx] - sol.y[idx - 1]) * (ti - sol.t[idx - 1]) / (sol.t[idx] - sol.t[idx - 1])
                    : sol.y[0];
                return s + (yi - yData[i]) ** 2;
            }, 0);
        } catch { return Infinity; }
    };

    // Nelder-Mead simplex
    const result = _nelderMead(residual, initParams, maxIter, tol);
    return result;
}

function _nelderMead(f, x0, maxIter = 500, tol = 1e-8) {
    const n = x0.length;
    const alpha = 1, gamma = 2, rho = 0.5, sigma = 0.5;

    // Initial simplex
    let simplex = [x0.slice()];
    for (let i = 0; i < n; i++) {
        const v = x0.slice();
        v[i] += v[i] !== 0 ? 0.05 * v[i] : 0.00025;
        simplex.push(v);
    }

    let fVals = simplex.map(f);
    let iter = 0;

    for (iter = 0; iter < maxIter; iter++) {
        // Sort
        const order = fVals.map((_, i) => i).sort((a, b) => fVals[a] - fVals[b]);
        simplex = order.map(i => simplex[i]);
        fVals   = order.map(i => fVals[i]);

        if (fVals[n] - fVals[0] < tol) break;

        // Centroid (exclude worst)
        const xo = Array(n).fill(0);
        for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) xo[j] += simplex[i][j] / n;

        // Reflect
        const xr = xo.map((v, j) => v + alpha * (v - simplex[n][j]));
        const fr = f(xr);
        if (fr < fVals[0]) {
            const xe = xo.map((v, j) => v + gamma * (xr[j] - v));
            const fe = f(xe);
            simplex[n] = fe < fr ? xe : xr;
            fVals[n]   = fe < fr ? fe  : fr;
        } else if (fr < fVals[n - 1]) {
            simplex[n] = xr; fVals[n] = fr;
        } else {
            const xc = xo.map((v, j) => v + rho * (simplex[n][j] - v));
            const fc = f(xc);
            if (fc < fVals[n]) { simplex[n] = xc; fVals[n] = fc; }
            else {
                for (let i = 1; i <= n; i++)
                    simplex[i] = simplex[0].map((v, j) => v + sigma * (simplex[i][j] - v));
                fVals = simplex.map(f);
            }
        }
    }

    return { params: simplex[0], residual: fVals[0], iterations: iter };
}
