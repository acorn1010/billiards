import { Vector3 } from "three";
import { ZERO_VECTOR, vec } from "../utils/utils";
import { BallMesh } from "../view/ballmesh";
import { PoolBallRigidBody, PoolBallState } from "./physics/PoolBallRigidBody";

/**
 * Represents a billiard ball with physics properties and visual representation
 */
export class Ball extends PoolBallRigidBody {
  /** Visual mesh representation */
  readonly ballmesh: BallMesh;

  /**
   * Counter for generating unique ball IDs
   * @VisibleForTesting
   */
  static id = 0;
  /** Unique identifier for this ball */
  readonly id = Ball.id++;

  /**
   * Create a new ball
   * @param pos Initial position vector
   * @param color Optional color value (random if not provided)
   */
  constructor(pos: Vector3, color?: number) {
    super(pos, ZERO_VECTOR);
    this.ballmesh = new BallMesh(color || 0xeeeeee * Math.random());
  }

  /**
   * Update the visual mesh representation of the ball
   * @param t Time step in seconds
   */
  updateMesh(t: number): void {
    this.ballmesh.updateAll(this, t);
  }

  serialise(): { pos: Vector3; id: number } {
    return {
      pos: this.pos.clone(),
      id: this.id,
    };
  }

  static fromSerialised(
    data: Pick<Ball, "pos"> & Partial<Pick<Ball, "vel" | "rvel">>,
  ): Ball {
    // This doesn't seem to get called during a normal game. Seems like it's for networking.
    return Ball.updateFromSerialised(new Ball(vec(data.pos)), data);
  }

  static updateFromSerialised(
    b: Ball,
    data: Pick<Ball, "pos"> & Partial<Pick<Ball, "vel" | "rvel">>,
  ): Ball {
    // This doesn't seem to get called during a normal game. Seems like it's for networking.
    b.pos.copy(data.pos);
    b.vel.copy(data?.vel ?? ZERO_VECTOR);
    b.rvel.copy(data?.rvel ?? ZERO_VECTOR);
    b.state = PoolBallState.Stationary;
    return b;
  }
}
