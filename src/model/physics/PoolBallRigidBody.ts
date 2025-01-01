import { Vector3 } from "three";
import { Pocket } from "./pocket";
import { passesThroughZero, unitAtAngle, ZERO_VECTOR } from "../../utils/utils";
import {
  cueToSpin,
  forceRoll,
  rollingFull,
  sliding,
  surfaceVelocityFull,
} from "./physics";
import { BodyKinematics } from "./BodyKinematics";

export type PoolBallType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | "Cue";

export type PoolBall = {
  type: PoolBallType;
  /** The diameter in meters of the pool ball. TODO(acorn1010): Replace with radius. */
  diameter: number;
  /** The x-axis for the center of the pool ball on the table. */
  x: number;
  /** The y-axis for the center of the pool ball on (or off) the table. */
  y: number;
  /** The z-axis for the center of the pool ball on the table. */
  z: number;
  /** The ball's rotation. */
  rotation: [x: number, y: number, z: number];
  /**
   * 0-based index of the pocket that this ball landed in, if any. Once a ball is pocketed, it
   * should no longer appear on the table. This is a string because we can't trust people naming
   * Blender table models to be consistent.
   *
   * @minLength 1
   * @maxLength 32
   */
  pocket?: string;

  /**
   * The Unix timestamp when this ball was pocketed. If two balls are pocketed at the same time, we
   * count the ball with the lower `ballId` (e.g. cue ball is always ballId 0) as the first ball
   * pocketed.
   */
  pocketedAt?: number;
};

/**
 * Possible states of a billiard ball
 */
export const enum PoolBallState {
  /** Ball is not moving */
  Stationary = "Stationary",
  /** Ball is rolling without sliding */
  Rolling = "Rolling",
  /** Ball is sliding with friction */
  Sliding = "Sliding",
  /** Ball is falling into a pocket */
  Falling = "Falling",
  /** Ball has fallen into a pocket */
  InPocket = "InPocket",
}

/**
 * Represents a billiard ball with physics properties and visual representation
 */
export class PoolBallRigidBody {
  /** Current position vector */
  readonly pos: Vector3;
  /** Current linear velocity vector */
  readonly vel: Vector3 = ZERO_VECTOR.clone();
  /** Current angular velocity vector */
  readonly rvel: Vector3 = ZERO_VECTOR.clone();
  /** Cached future position for calculations */
  readonly futurePos: Vector3 = ZERO_VECTOR.clone();
  /** Current motion state */
  state: PoolBallState = PoolBallState.Stationary;
  /** Pocket the ball is falling into (if any) */
  pocket: Pocket | undefined;

  /** Velocity threshold for transitioning between sliding and rolling in m/s. */
  private static readonly transitionThreshold = 0.05;

  /**
   * Create a new ball
   * @param pos Initial position vector
   * @param rotation Initial rotation vector
   */
  constructor(pos: Vector3, rotation: Vector3) {
    this.pos = pos.clone();
    this.rvel.copy(rotation);
  }

  /**
   * Applies a cue stick hit to this ball.
   * @param aimAngle The direction the cue stick is pointing on the unit circle. 0 is right, PI/2
   *                 is up, PI is left, and 3PI/2 is down.
   * @param power The power of the hit. Usually in range [0, 150 * R] where R is ball radius.
   * @param english The spin applied to the ball. Top-left is normalized(0.5, 0.5) * 0.5, and
   *                bottom-right is normalized(-0.5, -0.5) * 0.5.
   */
  hit(aimAngle: number, power: number, english: Vector3) {
    this.state = PoolBallState.Sliding;
    this.vel.copy(unitAtAngle(aimAngle).multiplyScalar(power));
    this.rvel.copy(cueToSpin(english, this.vel));
  }

  /**
   * Update ball physics for the next time step
   * @param t Time step in seconds
   */
  update(t: number): void {
    this.updatePosition(t);
    if (this.state === PoolBallState.Falling) {
      this.pocket?.updateFall(this, t);
    } else {
      this.updateVelocity(t);
    }
  }

  /**
   * Update ball position based on current velocity
   * @param t Time step in seconds
   */
  private updatePosition(t: number): void {
    this.pos.addScaledVector(this.vel, t);
  }

  /**
   * Update ball velocity based on current state (rolling or sliding)
   * @param t Time step in seconds
   */
  private updateVelocity(t: number): void {
    if (!this.inMotion()) {
      return;
    }
    if (this.isRolling()) {
      this.state = PoolBallState.Rolling;
      forceRoll(this.vel, this.rvel);
      this.addDelta(t, rollingFull(this.rvel));
    } else {
      this.state = PoolBallState.Sliding;
      this.addDelta(t, sliding(this.vel, this.rvel));
    }
  }

  /**
   * Add velocity and angular velocity changes to the ball
   * @param t Time step in seconds
   * @param delta Changes in linear and angular velocity
   */
  private addDelta(t: number, delta: BodyKinematics): void {
    delta.v.multiplyScalar(t);
    delta.w.multiplyScalar(t);
    if (!this.passesZero(delta)) {
      this.vel.add(delta.v);
      this.rvel.add(delta.w);
    }
  }

  /**
   * Check if ball velocity will pass through zero in the next update
   * @param delta Changes in linear and angular velocity
   * @returns True if ball will come to a stop
   */
  private passesZero(delta: BodyKinematics): boolean {
    const vz = passesThroughZero(this.vel, delta.v);
    const wz = passesThroughZero(this.rvel, delta.w);
    const halts = this.state === PoolBallState.Rolling ? vz || wz : vz && wz;
    if (halts && Math.abs(this.rvel.z) < 0.01) {
      this.setStationary();
      return true;
    }
    return false;
  }

  /**
   * Set ball to stationary state with zero velocities
   */
  setStationary(): void {
    this.vel.copy(ZERO_VECTOR);
    this.rvel.copy(ZERO_VECTOR);
    this.state = PoolBallState.Stationary;
  }

  /**
   * Check if ball is in rolling motion
   * @returns True if ball is rolling (not sliding)
   */
  isRolling(): boolean {
    return (
      this.vel.lengthSq() !== 0 &&
      this.rvel.lengthSq() !== 0 &&
      surfaceVelocityFull(this.vel, this.rvel).length() <
        PoolBallRigidBody.transitionThreshold
    );
  }

  /**
   * Check if ball is still on the table
   * @returns True if ball is not falling or in a pocket
   */
  onTable(): boolean {
    return (
      this.state !== PoolBallState.Falling &&
      this.state !== PoolBallState.InPocket
    );
  }

  /**
   * Check if ball is in any kind of motion
   * @returns True if ball is rolling, sliding or falling
   */
  inMotion(): boolean {
    return (
      this.state === PoolBallState.Rolling ||
      this.state === PoolBallState.Sliding ||
      this.isFalling()
    );
  }

  /**
   * Check if ball is currently falling into a pocket
   * @returns True if ball is in falling state
   */
  isFalling(): boolean {
    return this.state === PoolBallState.Falling;
  }

  /**
   * Calculate the future position of the ball after time t
   * @param t Time in seconds
   * @returns Future position vector
   */
  futurePosition(t: number): Vector3 {
    this.futurePos.copy(this.pos).addScaledVector(this.vel, t);
    return this.futurePos;
  }
}
