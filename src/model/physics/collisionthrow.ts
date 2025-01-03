import { Vector3 } from "three";
import { Collision } from "./collision";
import { I, m, R } from "./constants";
import { PoolBallRigidBody } from "./PoolBallRigidBody";

/**
 * Based on
 * https://billiards.colostate.edu/technical_proofs/new/TP_A-14.pdf
 *
 */
export class CollisionThrow {
  private dynamicFriction(vRel: number): number {
    return 0.01 + 0.108 * Math.exp(-1.088 * vRel);
  }

  public updateVelocities(a: PoolBallRigidBody, b: PoolBallRigidBody) {
    const contact = Collision.positionsAtContact(a, b);
    const ab = contact.b.sub(contact.a).normalize();
    const abTangent = new Vector3(-ab.y, ab.x, 0);

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

    // matches paper when throwAngle = Math.atan2(tangentialImpulse, normalImpulse)

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

    return vRelNormalMag;
  }
}
