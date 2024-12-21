import { Vector3, Vector3Like } from "three";
import { norm, upCross, up } from "../../utils/utils";
import { muS, muC, g, m, Mz, Mxy, R, I, e } from "./constants";
import { Mathaven } from "./mathaven";
import { ee, μs, μw } from "../../diagram/constants";
import { BodyKinematics } from "./BodyKinematics";

/**
 * Computes the velocity at the point on the ball’s surface (in the XY plane)
 * where it contacts the table. Returns a Vector3 with Z set to 0.
 *
 * @param v Current linear velocity of the ball
 * @param w Current angular velocity of the ball
 * @returns A Vector3 representing the surface velocity in X-Y
 */
export function surfaceVelocity(v: Vector3, w: Vector3) {
  return surfaceVelocityFull(v, w).setZ(0);
}

const sv = new Vector3();

/**
 * Computes the velocity at a point on the surface of the ball in full 3D.
 * This combines the ball’s linear velocity with the tangential speed
 * due to angular velocity.
 *
 * @param v Current linear velocity
 * @param w Current angular velocity
 * @returns A Vector3 representing the 3D surface velocity
 */
export function surfaceVelocityFull(v: Vector3, w: Vector3) {
  return sv.copy(v).addScaledVector(upCross(w), R);
}

const delta = { v: new Vector3(), w: new Vector3() };
Object.freeze(delta);

/**
 * Models the change in linear (v) and angular (w) velocities while the ball is
 * slipping (sliding) on the table. It uses the friction coefficient muS and
 * ball parameters to compute the delta values.
 *
 * @param v Current linear velocity
 * @param w Current angular velocity
 * @returns A structure containing the updated velocity (v) and spin (w)
 */
export function sliding(v: Vector3, w: Vector3) {
  const va = surfaceVelocity(v, w);
  delta.v.copy(norm(va).multiplyScalar(-muS * g));
  delta.w.copy(norm(upCross(va)).multiplyScalar(((5 / 2) * muS * g) / R));
  delta.w.setZ(-(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z));
  return delta;
}

/**
 * Models the change in linear (v) and angular (w) velocities while the ball is
 * rolling in full 3D. Uses friction parameters and the ball's spin to compute
 * the updated kinematics.
 *
 * @param w Current angular velocity
 * @returns A BodyKinematics object containing delta.v and delta.w
 */
export function rollingFull(w: Vector3Like): BodyKinematics {
  const mag = new Vector3(w.x, w.y, 0).length();
  const k = ((5 / 7) * Mxy) / (m * R) / mag;
  const kw = ((5 / 7) * Mxy) / (m * R * R) / mag;
  delta.v.set(-k * w.y, k * w.x, 0);
  delta.w.set(
    -kw * w.x,
    -kw * w.y,
    -(5 / 2) * (Mz / (m * R * R)) * Math.sign(w.z),
  );
  return delta;
}

/**
 * Adjusts the ball’s spin (w) so that it rolls consistently based on its
 * linear velocity (v). This ensures a no-slip rolling motion by setting
 * w in relation to v.
 *
 * @param v Current linear velocity
 * @param w Current angular velocity (updated in place)
 */
export function forceRoll(v: Vector3Like, w: Vector3) {
  const wz = w.z;
  w.copy(upCross(v).multiplyScalar(1 / R));
  w.setZ(wz);
}

/**
 * Rotates the velocity and spin about the vertical axis by a given angle (theta),
 * applies a provided model function (e.g., for collision or bounce calculations),
 * and then rotates the results back. Useful for modeling collisions that assume
 * the ball is traveling along a particular axis.
 *
 * @param theta Angle in radians by which to rotate about the up axis
 * @param v Current linear velocity
 * @param w Current angular velocity
 * @param model A function that transforms (v, w) into a BodyKinematics delta
 * @returns Updated BodyKinematics in the original reference frame
 */
export function rotateApplyUnrotate(
  theta: number,
  v: Vector3,
  w: Vector3,
  model: (v: Vector3, w: Vector3) => BodyKinematics,
): BodyKinematics {
  const vr = v.clone().applyAxisAngle(up, theta);
  const wr = w.clone().applyAxisAngle(up, theta);

  const delta = model(vr, wr);

  delta.v.applyAxisAngle(up, -theta);
  delta.w.applyAxisAngle(up, -theta);
  return delta;
}

// Han paper cushion physics

// cushion contact point epsilon above ball centre
const epsilon = R * 0.1;
const theta_a = Math.asin(epsilon / R);
const sin_a = Math.sin(theta_a);
const cos_a = Math.cos(theta_a);

/**
 * Used in cushion bounce calculations (Han model).
 * Calculates a 2D-like vector (X, Y) from the ball's velocity and spin,
 * factoring in the slight offset from the center (epsilon).
 *
 * @param v Ball's velocity
 * @param w Ball's spin
 * @returns A Vector3 holding transformed velocity components (X, Y)
 */
export function s0(v: Vector3, w: Vector3) {
  return new Vector3(
    v.x * sin_a - v.z * cos_a + R * w.y,
    -v.y - R * w.z * cos_a + R * w.x * sin_a,
  );
}

/**
 * A helper function in Han cushion model.
 * Extracts part of the velocity vector by multiplying its x-component by cos_a.
 *
 * @param v Ball's velocity
 * @returns The x-component scaled by cos_a
 */
export function c0(v: Vector3) {
  return v.x * cos_a;
}

/**
 * Returns the impulse magnitude in the Z-axis direction based on velocity s,
 * following the Han model’s 7/2 / m factor.
 *
 * @param s Vector from s0 function
 * @returns A scalar impulse magnitude for the Z-axis
 */
export function Pzs(s: Vector3) {
  const A = 7 / 2 / m;
  return s.length() / A;
}

/**
 * Computes the impulse magnitude in the Z-axis direction for the cushion bounce
 * using the restitutionCushion model, the normal velocity component c,
 * and friction with the cushion (muC).
 *
 * @param c x-component of velocity scaled by cos_a
 * @returns A scalar impulse magnitude
 */
export function Pze(c: number) {
  const B = 1 / m;
  const coeff = restitutionCushion(new Vector3(c / cos_a, 0, 0));
  return (muC * ((1 + coeff) * c)) / B;
}

/**
 * Determines if the ball ‘grips’ the cushion during contact rather than slipping.
 * This is based on comparing the slip impulse (Pzs) to the needed Z impulse (Pze).
 *
 * @param v Ball’s velocity
 * @param w Ball’s spin
 * @returns True if the ball grips the cushion, false if it slips
 */
export function isGripCushion(v: Vector3, w: Vector3) {
  const Pze_val = Pze(c0(v));
  const Pzs_val = Pzs(s0(v, w));
  return Pzs_val <= Pze_val;
}

/**
 * Computes the bounce off a cushion using the Han2005 model. Chooses between a ‘grip’
 * solution or a ‘slip’ solution based on the isGripCushion test. Returns deltas for
 * velocity and spin.
 *
 * @param v Ball velocity
 * @param w Ball angular velocity
 * @returns BodyKinematics with delta.v and delta.w for the bounce
 */
export function bounceHan(v: Vector3, w: Vector3) {
  return isGripCushion(v, w) ? gripHan(v, w) : slipHan(v, w);
}

/**
 * A blended version of bounceHan that mixes the ‘grip’ and ‘slip’ solutions to avoid
 * a sharp transition (cliff edge). This provides more realistic behavior for check side
 * (reverse side played at a steep angle).
 *
 * @param v Ball velocity
 * @param w Ball angular velocity
 * @returns A blended BodyKinematics from both grip and slip solutions
 */
export function bounceHanBlend(v: Vector3, w: Vector3) {
  const deltaGrip = gripHan(v, w);
  const deltaSlip = slipHan(v, w);

  const isCheckSide = Math.sign(v.y) === Math.sign(w.z);
  const factor = isCheckSide ? Math.cos(Math.atan2(v.y, v.x)) : 1;

  return {
    v: deltaSlip.v.lerp(deltaGrip.v, factor),
    w: deltaSlip.w.lerp(deltaGrip.w, factor),
  };
}

/**
 * Computes the spin (angular velocity) imparted to the ball by a cue strike
 * offset from the center. The offset is a fraction of the ball’s radius (R).
 * Formula adapted from established billiards analysis.
 *
 * @param offset A Vector3 representing (x, y, 0) offset from the center
 * @param v Ball velocity post-strike
 * @returns A Vector3 representing the new spin (ω) due to the offset
 */
export function cueToSpin(offset: Vector3, v: Vector3) {
  const spinAxis = Math.atan2(-offset.x, offset.y);
  const spinRate = ((5 / 2) * v.length() * (offset.length() * R)) / (R * R);
  const dir = v.clone().normalize();
  return upCross(dir).applyAxisAngle(dir, spinAxis).multiplyScalar(spinRate);
}

/**
 * Applies a coordinate transform so the ball is effectively traveling in +Y
 * for the Mathaven model, runs the model, then rotates back. This is needed
 * because mathaven expects the ball’s motion in a particular reference frame.
 *
 * @param v Ball velocity
 * @param w Ball angular velocity
 * @returns BodyKinematics delta from the mathaven solver
 */
export function mathavenAdapter(v: Vector3, w: Vector3) {
  return rotateApplyUnrotate(Math.PI / 2, v, w, cartesianToBallCentric);
}

/**
 * Approximates the friction coefficient (mu) for a cushion collision
 * based on the angle of incidence in the X-Y plane.
 *
 * @param v Ball velocity
 * @returns A friction value between 0 and 1 (approximately)
 */
function muCushion(v: Vector3) {
  const theta = Math.atan2(Math.abs(v.y), v.x);
  return 0.471 - theta * 0.241;
}

/**
 * Approximates the normal restitution of a collision with the cushion
 * using a quadratic function of the ball’s X velocity.
 *
 * @param v Ball velocity
 * @returns A coefficient of restitution between 0 and 1 (approximately)
 */
function restitutionCushion(v: Vector3) {
  return 0.39 + 0.257 * v.x - 0.044 * v.x * v.x;
}

/** Internal helper function for applying the Mathaven solver in ball-centric coordinates. */
function cartesianToBallCentric(v: Vector3, w: Vector3) {
  const mathaven = new Mathaven(m, R, ee, μs, μw + 0.1);
  mathaven.solve(v.x, v.y, w.x, w.y, w.z);

  const rv = new Vector3(mathaven.vx, mathaven.vy, 0);
  const rw = new Vector3(mathaven.ωx, mathaven.ωy, mathaven.ωz);

  return { v: rv.sub(v), w: rw.sub(w) };
}

/**
 * Converts an impulse (PX, PY, PZ) on the ball into its resulting changes in
 * linear velocity (v) and angular velocity (w). Internal function used by
 * gripHan/slipHan to compute final velocity/spin.
 */
function impulseToDelta(PX: number, PY: number, PZ: number) {
  return {
    v: new Vector3(PX / m, PY / m),
    w: new Vector3(
      (-R / I) * PY * sin_a,
      (R / I) * (PX * sin_a - PZ * cos_a),
      (R / I) * PY * cos_a,
    ),
  };
}

/** Internal helper for computing whether the ball grips or slips. */
function gripHan(v: Vector3, w: Vector3) {
  const { c, s, A, B } = basisHan(v, w);
  const ecB = (1 + e) * (c / B);
  const PX = (-s.x / A) * sin_a - ecB * cos_a;
  const PY = s.y / A;
  const PZ = (s.x / A) * cos_a - ecB * sin_a;
  return impulseToDelta(PX, PY, PZ);
}

/** Internal helper for computing whether the ball is in slip mode on cushion. */
function slipHan(v: Vector3, w: Vector3) {
  const { c, B } = basisHan(v, w);
  const ecB = (1 + e) * (c / B);
  const mu = muCushion(v);
  const phi = Math.atan2(v.y, v.x);
  const cos_phi = Math.cos(phi);
  const sin_phi = Math.sin(phi);
  const PX = -mu * ecB * cos_phi * cos_a - ecB * cos_a;
  const PY = mu * ecB * sin_phi;
  const PZ = mu * ecB * cos_phi * cos_a - ecB * sin_a;
  return impulseToDelta(PX, PY, PZ);
}

/** Internal helper to group basis values used by slipHan and gripHan. */
function basisHan(v: Vector3, w: Vector3) {
  return {
    c: c0(v),
    s: s0(v, w),
    A: 7 / 2 / m,
    B: 1 / m,
  };
}
