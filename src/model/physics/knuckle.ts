import { Vector3 } from "three";
import { e } from "./constants";
import { PoolBallRigidBody } from "./PoolBallRigidBody";

export class Knuckle {
  pos: Vector3;
  radius: number;

  constructor(pos: Vector3, radius: number) {
    this.pos = pos;
    this.radius = radius;
  }

  public bounce(ball: PoolBallRigidBody): number {
    const kb = ball.pos.clone().sub(this.pos).normalize();
    const velDotCenters = kb.dot(ball.vel);
    ball.vel.addScaledVector(kb, -2 * e * velDotCenters);
    ball.rvel.multiplyScalar(0.5);
    return Math.abs(velDotCenters);
  }
}
