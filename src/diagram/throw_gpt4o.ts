import { Vector3 } from "three";
import { Ball } from "../model/ball";
import { UP_VECTOR, ZERO_VECTOR } from "../utils/utils";
import { I, m } from "../model/physics/constants";

export class CollisionThrow {
  public static R: number = 0.029; // ball radius in meters

  // Friction parameters
  private static a: number = 0.01; // Minimum friction coefficient
  private static b: number = 0.108; // Range of friction variation
  private static c: number = 1.088; // Decay rate

  private dynamicFriction(vRel: number): number {
    return (
      CollisionThrow.a + CollisionThrow.b * Math.exp(-CollisionThrow.c * vRel)
    );
  }

  protected relativeVelocity(
    v: number,
    ωx: number,
    ωz: number,
    ϕ: number,
  ): number {
    return Math.sqrt(
      Math.pow(v * Math.sin(ϕ) - ωz * CollisionThrow.R, 2) +
        Math.pow(Math.cos(ϕ) * ωx * CollisionThrow.R, 2),
    );
  }

  public throwAngle(v: number, ωx: number, ωz: number, ϕ: number): number {
    const vRel = this.relativeVelocity(v, ωx, ωz, ϕ);
    const μ = this.dynamicFriction(vRel);
    const numerator =
      Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) *
      (v * Math.sin(ϕ) - CollisionThrow.R * ωz);
    const denominator = v * Math.cos(ϕ);
    console.log(`inputs:v=${v}, ωx=${ωx}, ωz=${ωz}, ϕ=${ϕ}`);
    console.log(`   v * Math.sin(ϕ) =${v * Math.sin(ϕ)}`);
    console.log(`   CollisionThrow.R * ωz =${CollisionThrow.R * ωz}`);
    console.log(
      `   Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7) =${Math.min((μ * v * Math.cos(ϕ)) / vRel, 1 / 7)}`,
    );
    console.log(
      `   (v * Math.sin(ϕ) - CollisionThrow.R * ωz) =${v * Math.sin(ϕ) - CollisionThrow.R * ωz}`,
    );
    console.log("");
    console.log("vRel = ", vRel);
    console.log("μ = ", μ);
    console.log("numerator = ", numerator);
    console.log("denominator = ", denominator);
    console.log("throw = ", Math.atan2(numerator, denominator));

    return Math.atan2(numerator, denominator);
  }

  public plot(v: number, ωx: number, ωz: number, ϕ: number) {
    // assume balls in contact along y axis
    // cue ball a is travelling +y only
    // object ball positioned so that collision angle is phi

    const a = new Ball(ZERO_VECTOR);
    a.vel.copy(new Vector3(0, v, 0));
    a.rvel.copy(new Vector3(ωx, 0, ωz));

    const straight = new Vector3(0, 2 * CollisionThrow.R);
    const bpos = straight.applyAxisAngle(UP_VECTOR, ϕ);
    const b = new Ball(bpos);

    console.log("---original---");
    let result = this.throwAngle(v, ωx, ωz, ϕ);
    console.log("");
    console.log("---new code");
    result = this.updateVelocities(a, b);
    return result;
  }

  private updateVelocities(a: Ball, b: Ball) {
    const ab = b.pos.clone().sub(a.pos).normalize();
    const abTangent = new Vector3(-ab.y, ab.x, 0);

    const R: number = 0.029;
    const e = 0.98;
    const vPoint = a.vel
      .clone()
      .sub(b.vel)
      .add(
        ab
          .clone()
          .multiplyScalar(-R)
          .cross(a.rvel)
          .sub(ab.clone().multiplyScalar(R).cross(b.rvel)),
      );

    const vRelNormalMag = ab.dot(vPoint);
    const vRel = vPoint.addScaledVector(ab, -vRelNormalMag);
    const vRelMag = vRel.length();
    const vRelTangential = abTangent.dot(vRel); // slip velocity perpendicular to line of impact

    const μ = this.dynamicFriction(vRelMag);

    let normalImpulse = vRelNormalMag;
    let tangentialImpulse =
      Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) * -vRelTangential;

    let throwAngle = Math.atan2(tangentialImpulse, normalImpulse);

    console.log("vRelMag =", vRelMag);
    console.log("μ =", μ);
    console.log("tangentialImpulse (numerator)=", tangentialImpulse);
    console.log("normalImpulse (denominator)=", normalImpulse);
    console.log("throwAngle =", throwAngle);
    console.log("");
    console.log(
      `Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7) = ${Math.min((μ * vRelNormalMag) / vRelMag, 1 / 7)}`,
    );
    console.log(
      `(-vRelMag * Math.sign(vRelTangential)) = ${-vRelMag * Math.sign(vRelTangential)}`,
    );
    console.log("vRelNormalMag =", vRelNormalMag);
    console.log("vRelTangential =", vRelTangential);

    // Normal impulse (inelastic collision)
    normalImpulse = (-(1 + e) * vRelNormalMag) / (2 / m);

    // Tangential impulse (frictional constraint)
    tangentialImpulse =
      Math.min((μ * Math.abs(normalImpulse)) / vRelMag, 1 / 7) *
      -vRelTangential;

    // Impulse vectors
    const impulseNormal = ab.clone().multiplyScalar(normalImpulse);
    const impulseTangential = abTangent
      .clone()
      .multiplyScalar(tangentialImpulse);

    // Apply impulses to linear velocities
    a.vel
      .addScaledVector(impulseNormal, 1 / m)
      .addScaledVector(impulseTangential, 1 / m);
    b.vel
      .addScaledVector(impulseNormal, -1 / m)
      .addScaledVector(impulseTangential, -1 / m);

    // Angular velocity updates
    const angularImpulseA = ab
      .clone()
      .multiplyScalar(-R)
      .cross(impulseTangential);
    const angularImpulseB = ab
      .clone()
      .multiplyScalar(R)
      .cross(impulseTangential);

    a.rvel.addScaledVector(angularImpulseA, 1 / I);
    b.rvel.addScaledVector(angularImpulseB, 1 / I);

    return throwAngle;
  }
}
