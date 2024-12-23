import { Vector3 } from "three";
import { zero, vec, passesThroughZero } from "../utils/utils";
import {
  forceRoll,
  rollingFull,
  sliding,
  surfaceVelocityFull,
} from "../model/physics/physics";
import { BallMesh } from "../view/ballmesh";
import { Pocket } from "./physics/pocket";
import { BodyKinematics } from "./physics/BodyKinematics";

/**
 * Possible states of a billiard ball
 */
export const enum State {
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
export class Ball {
  /** Current position vector */
  readonly pos: Vector3;
  /** Current linear velocity vector */
  readonly vel: Vector3 = zero.clone();
  /** Current angular velocity vector */
  readonly rvel: Vector3 = zero.clone();
  /** Cached future position for calculations */
  readonly futurePos: Vector3 = zero.clone();
  /** Visual mesh representation */
  readonly ballmesh: BallMesh;
  /** Current motion state */
  state: State = State.Stationary;
  /** Pocket the ball is falling into (if any) */
  pocket: Pocket | undefined;

  /**
   * Counter for generating unique ball IDs
   * @VisibleForTesting
   */
  static id = 0;
  /** Unique identifier for this ball */
  readonly id = Ball.id++;

  /** Velocity threshold for transitioning between sliding and rolling in m/s. */
  static readonly transition = 0.05;

  /**
   * Create a new ball
   * @param pos Initial position vector
   * @param color Optional color value (random if not provided)
   */
  constructor(pos: Vector3, color?: number) {
    this.pos = pos.clone();
    this.ballmesh = new BallMesh(color || 0xeeeeee * Math.random());
  }

  /**
   * Update ball physics for the next time step
   * @param t Time step in seconds
   */
  update(t: number): void {
    this.updatePosition(t);
    if (this.state == State.Falling) {
      this.pocket?.updateFall(this, t);
    } else {
      this.updateVelocity(t);
    }
  }

  /**
   * Update the visual mesh representation of the ball
   * @param t Time step in seconds
   */
  updateMesh(t: number): void {
    this.ballmesh.updateAll(this, t);
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
      this.state = State.Rolling;
      forceRoll(this.vel, this.rvel);
      this.addDelta(t, rollingFull(this.rvel));
    } else {
      this.state = State.Sliding;
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
    const halts = this.state === State.Rolling ? vz || wz : vz && wz;
    if (halts && Math.abs(this.rvel.z) < 0.01) {
      // TODO(acorn1010): Seems like this will mean we can't have balls spinning in place.
      //  Might want to change the way halt works so that angular / linear velocity are stopped
      //  separately.
      this.setStationary();
      return true;
    }
    return false;
  }

  /**
   * Set ball to stationary state with zero velocities
   */
  setStationary(): void {
    this.vel.copy(zero);
    this.rvel.copy(zero);
    this.state = State.Stationary;
  }

  /**
   * Check if ball is in rolling motion
   * @returns True if ball is rolling (not sliding)
   */
  isRolling(): boolean {
    return (
      this.vel.lengthSq() !== 0 &&
      this.rvel.lengthSq() !== 0 &&
      surfaceVelocityFull(this.vel, this.rvel).length() < Ball.transition
    );
  }

  /**
   * Check if ball is still on the table
   * @returns True if ball is not falling or in a pocket
   */
  onTable(): boolean {
    return this.state !== State.Falling && this.state !== State.InPocket;
  }

  /**
   * Check if ball is in any kind of motion
   * @returns True if ball is rolling, sliding or falling
   */
  inMotion(): boolean {
    return (
      this.state === State.Rolling ||
      this.state === State.Sliding ||
      this.isFalling()
    );
  }

  /**
   * Check if ball is currently falling into a pocket
   * @returns True if ball is in falling state
   */
  isFalling(): boolean {
    return this.state === State.Falling;
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

  serialise(): { pos: Vector3; id: number } {
    return {
      pos: this.pos.clone(),
      id: this.id,
    };
  }

  static fromSerialised(data: Pick<Ball, "pos" | "id">): Ball {
    return Ball.updateFromSerialised(new Ball(vec(data.pos)), data);
  }

  static updateFromSerialised(
    b: Ball,
    data: Pick<Ball, "pos"> & Partial<Pick<Ball, "vel" | "rvel">>,
  ): Ball {
    b.pos.copy(data.pos);
    b.vel.copy(data?.vel ?? zero);
    b.rvel.copy(data?.rvel ?? zero);
    b.state = State.Stationary;
    return b;
  }
}
