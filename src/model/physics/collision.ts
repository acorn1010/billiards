import { CollisionThrow } from "./collisionthrow";
import { R } from "./constants";
import { PoolBallRigidBody, PoolBallState } from "./PoolBallRigidBody";

const FOUR_R_SQUARED = 4 * R * R;
export class Collision {
  static willCollide(
    a: PoolBallRigidBody,
    b: PoolBallRigidBody,
    t: number,
  ): boolean {
    return (
      (a.inMotion() || b.inMotion()) &&
      a.onTable() &&
      b.onTable() &&
      a.futurePosition(t).distanceToSquared(b.futurePosition(t)) <
        FOUR_R_SQUARED
    );
  }

  static collide(a: PoolBallRigidBody, b: PoolBallRigidBody) {
    return Collision.updateVelocities(a, b);
  }

  static positionsAtContact(a: PoolBallRigidBody, b: PoolBallRigidBody) {
    const sep = a.pos.distanceTo(b.pos);
    const rv = a.vel.clone().sub(b.vel);
    const t = (sep - 2 * R) / rv.length() || 0;
    return {
      a: a.pos.clone().addScaledVector(a.vel, t),
      b: b.pos.clone().addScaledVector(b.vel, t),
    };
  }

  private static readonly model = new CollisionThrow();

  private static updateVelocities(a: PoolBallRigidBody, b: PoolBallRigidBody) {
    const impactSpeed = Collision.model.updateVelocities(a, b);
    a.state = PoolBallState.Sliding;
    b.state = PoolBallState.Sliding;
    return impactSpeed;
  }
}
