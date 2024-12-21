/**
 * The following code provides custom implementations of Math.cos(), Math.exp(), and Math.tan()
 * using fixed polynomial (or rational) approximations and argument reductions. The goal is to
 * achieve bit-for-bit identical results across different browsers and platforms by avoiding any
 * platform-dependent Math routines for these functions.
 *
 * Why this might work:
 * 1. We rely only on basic arithmetic operations (+, -, *, /) which are strictly defined by IEEE 754
 *    and ECMAScript.
 * 2. We use the same deterministic sequence of operations and avoid calls to native Math functions
 *    that could differ slightly due to platform-level libraries.
 * 3. By keeping the approximations fixed and not branching on environment conditions, the output
 *    should be identical across compliant JS engines.
 *
 * Caveats:
 * - These are approximations. For many inputs, these will not be as accurate as the native Math
 *   implementations. They are primarily illustrative of a method to produce consistent cross-browser
 *   results, rather than maximum accuracy.
 * - The chosen polynomials and ranges are a trade-off between complexity and accuracy.
 * - If extremely high precision or correctness for large inputs is required, more sophisticated
 *   approximations or argument reductions may be needed.
 * - As long as the arithmetic is performed the same way, results should be reproducible across all
 *   browsers following IEEE 754 and ECMAScript specs.
 */

/**
 * Approximate cosine using a Chebyshev or Taylor-like polynomial approximation
 * centered around 0, after angle reduction.
 *
 * Polynomial approximation of cos(x) around 0 (Maclaurin series truncated):
 * cos(x) ≈ 1 - x²/2! + x⁴/4! - x⁶/6!
 * Here we take a few terms for demonstration.
 */
function crossBrowserCos(x) {
  const xr = reduceAngle(x);
  const x2 = xr * xr;
  // Using up to x^6 term from the Maclaurin series:
  // cos(x) ~ 1 - x²/2 + x⁴/24 - x⁶/720
  return 1 - x2 / 2 + (x2 * x2) / 24 - (x2 * x2 * x2) / 720;
}

/**
 * Approximate exp(x) with a polynomial approximation.
 *
 * We can use a truncated series for e^x:
 * e^x ≈ 1 + x + x²/2! + x³/3! + x⁴/4! + x⁵/5!
 * Truncating might reduce accuracy far from 0, so for large x we can
 * reduce the problem by using e^(x) = e^(n + r) = e^n * e^r where n is an integer
 * and |r| small. But to keep it simple and consistent, we'll just do a direct approximation
 * (this will lose accuracy for large magnitude values but remain consistent).
 */
function crossBrowserExp(x) {
  // For large |x|, the approximation will be poor, but consistent.
  // Terms up to x^5:
  const x2 = x * x;
  const x3 = x2 * x;
  const x4 = x3 * x;
  const x5 = x4 * x;

  // e^x ~ 1 + x + x²/2! + x³/3! + x⁴/4! + x⁵/5!
  // 2! = 2, 3! = 6, 4! = 24, 5! = 120
  return 1 + x + x2 / 2 + x3 / 6 + x4 / 24 + x5 / 120;
}

/**
 * Approximate tan(x) using the relationship tan(x) = sin(x)/cos(x).
 * We can approximate sin(x) similarly to cos(x) and then divide.
 *
 * sin(x) Maclaurin series:
 * sin(x) ≈ x - x³/3! + x⁵/5!
 * We'll use a few terms for sin(x) and then do tan(x) = sin(x)/cos(x).
 */
function crossBrowserTan(x) {
  const xr = reduceAngle(x);
  const x2 = xr * xr;

  // sin(x) ~ x - x³/6 + x⁵/120 (just 3 terms)
  const sinApprox = xr - (xr * x2) / 6 + (xr * x2 * x2 * x2) / 120;

  // Use our crossBrowserCos to avoid native Math.cos
  const cosApprox = crossBrowserCos(xr);

  // Just divide:
  return sinApprox / cosApprox;
}

/**
 * Reduce angle x into the range [-π, π] for better polynomial approximation accuracy.
 * This helps with cos and tan approximations.
 */
function reduceAngle(x) {
  // Twoπ
  const TWO_PI = 6.283185307179586;

  // Use modulo to reduce, but since JS % can be imprecise for large numbers,
  // do a careful reduction. This is a simple approach; for very large |x|,
  // some floating-point drift may occur, but should still be consistent.
  let n = Math.round(x / TWO_PI);
  return x - n * TWO_PI;
}

// The below Math functions are known to be dangerous across different architectures.
// Math.cos <-- dangerous
// Math.tan <-- dangerous
// Math.exp <-- dangerous
// Math.atan <-- dangerous
// Math.atan2 <-- dangerous
// Math.log <-- dangerous
// Math.log1p <-- dangerous
// Math.log10 <-- dangerous
// Math.log2 <-- dangerous
// Math.tanh <-- dangerous
// Math.sin <-- dangerous
// Math.asinh <-- dangerous
// Math.expm1 <-- dangerous
export const MathUtils = {
  cos: crossBrowserCos,
  exp: crossBrowserExp,
  tan: crossBrowserTan,
};
