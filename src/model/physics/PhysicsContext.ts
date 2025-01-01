import { PoolBall, PoolBallRigidBody } from "./PoolBallRigidBody";
import { Vector3 } from "three";
import { Collision } from "./collision";
import { TableGeometry } from "../../view/tablegeometry";
import { Outcome } from "../outcome";
import { Pocket } from "./pocket";
import { PocketGeometry } from "../../view/pocketgeometry";
import { mathavenAdapter } from "./physics";
import { R } from "./constants";
import { CushionRigidBody } from "./cushion";

/** Represents a pair of billiard balls for collision detection */
type Pair = {
  /** First ball in the pair */
  a: PoolBallRigidBody;
  /** Second ball in the pair */
  b: PoolBallRigidBody;
};

/** Handles pool physics / updates to the world state. */
export class PhysicsContext {
  // private readonly world = new World();
  private readonly balls: (PoolBallRigidBody | null)[] = [];
  /** All possible pairs of balls for collision detection */
  private readonly pairs: Pair[] = [];

  /** Geometry for the table itself. */
  private tableGeometry?: any = true;

  /** The locations / diameters / etc. of each pool ball at the start of the game. */
  private initialBalls: PoolBall[] = [];

  private ready = false;

  /**
   * `outcomes` is a list of events that occurred during the physics simulation, including
   * ball-ball, ball-cushion, and ball-pocket collisions.
   */
  private readonly outcomes: Outcome[] = [];
  /** Last 0-based element index of `outcomes` sent in `#step` + 1. */
  private lastOutcomeIndex = 0;

  private readonly cushionModel = mathavenAdapter; // bounceHanBlend;

  private readonly pocketGeometry = new PocketGeometry(R);
  private readonly cushion = new CushionRigidBody(this.pocketGeometry);

  constructor() {}

  setBallPositions(ballPositions: PoolBall[]) {
    // cloneDeep. Replace with our cloneDeep once we move this to Foony's codebase.
    this.initialBalls = JSON.parse(JSON.stringify(ballPositions));
    this.reset();
  }

  reset() {
    if (!this.tableGeometry || !this.initialBalls.length) {
      return;
    }

    this.ready = false;

    this.onReset();

    this.balls.length = 0;

    this.createBalls();

    this.ready = true;
  }

  /** Advances the state of the physics simulation by `timestepSeconds` seconds. */
  step(timestepSeconds: number): Outcome[] {
    let depth = 0;
    while (!this.prepareAdvanceAll(timestepSeconds)) {
      if (depth++ > 100) {
        throw new Error("Depth exceeded resolving collisions");
      }
    }

    for (const ball of this.balls) {
      ball?.update(timestepSeconds);
    }

    const result = this.outcomes.slice(this.lastOutcomeIndex);
    this.lastOutcomeIndex = this.outcomes.length;
    return result;
  }

  /** Called at the start of #reset. Use for cleaning up any state related to the physics. */
  protected onReset() {
    // Do nothing.
  }

  private readonly TEMP_POSITION_VECTOR = new Vector3();
  private readonly TEMP_ROTATION_VECTOR = new Vector3();
  private createBalls() {
    const balls = this.balls;
    for (let i = 0; i < this.initialBalls.length; ++i) {
      const { x, y, z, type, diameter, rotation, pocket } =
        this.initialBalls[i];
      if (pocket) {
        this.balls.push(null); // Placeholder for pocketed balls.
        continue;
      }
      this.TEMP_POSITION_VECTOR.set(x, y, z);
      this.TEMP_ROTATION_VECTOR.set(...rotation);
      const ball = new PoolBallRigidBody(
        this.TEMP_POSITION_VECTOR,
        this.TEMP_ROTATION_VECTOR,
      );
      balls.push(ball);
    }

    this.pairs.length = 0;
    for (let a = 0; a < balls.length; a++) {
      if (!balls[a]) {
        continue;
      }
      for (let b = a + 1; b < balls.length; b++) {
        if (!balls[b]) {
          continue;
        }
        if (a < b) {
          this.pairs.push({ a: balls[a]!, b: balls[b]! });
        }
      }
    }
  }

  private prepareAdvanceAll(t: number): boolean {
    return (
      this.pairs.every((pair) => this.prepareAdvancePair(pair.a, pair.b, t)) &&
      this.balls.every((ball) => this.prepareAdvanceToCushions(ball, t))
    );
  }

  /**
   * Check if a pair of balls can advance without colliding
   * @param a First ball
   * @param b Second ball
   * @param t Time step in seconds
   * @returns True if no collision will occur
   */
  private prepareAdvancePair(
    a: PoolBallRigidBody,
    b: PoolBallRigidBody,
    t: number,
  ): boolean {
    if (Collision.willCollide(a, b, t)) {
      const incidentSpeed = Collision.collide(a, b);
      this.outcomes.push(Outcome.collision(a, b, incidentSpeed));
      return false;
    }
    return true;
  }

  /**
   * Check if a ball can advance without hitting table elements
   * @param ball Ball to check
   * @param t Time step in seconds
   * @returns True if no collisions with cushions, knuckles or pockets
   */
  private prepareAdvanceToCushions(
    ball: PoolBallRigidBody | null,
    t: number,
  ): boolean {
    if (!ball) {
      return true;
    }
    if (!ball.onTable()) {
      return true;
    }
    const futurePosition = ball.futurePosition(t);
    if (
      Math.abs(futurePosition.y) < TableGeometry.tableY &&
      Math.abs(futurePosition.x) < TableGeometry.tableX
    ) {
      return true;
    }

    const incidentSpeed = this.cushion.bounceAny(
      ball,
      t,
      TableGeometry.hasPockets,
      this.cushionModel,
    );
    if (incidentSpeed) {
      this.outcomes.push(Outcome.cushion(ball, incidentSpeed));
      return false;
    }

    const knuckle = this.pocketGeometry.findBouncingKnuckle(ball, t);
    if (knuckle) {
      const knuckleIncidentSpeed = knuckle.bounce(ball);
      this.outcomes.push(Outcome.cushion(ball, knuckleIncidentSpeed));
      return false;
    }
    // TODO(acorn1010): Move this PocketGeometry logic. It shouldn't be static.
    const maybePocket = Pocket.findPocket(
      this.pocketGeometry.getPocketCenters(),
      ball,
      t,
    );
    if (maybePocket) {
      const pocketIncidentSpeed = maybePocket.fall(ball, t);
      this.outcomes.push(Outcome.pot(ball, maybePocket, pocketIncidentSpeed));
      return false;
    }

    return true;
  }

  getBalls() {
    return this.balls;
  }

  setOutcomes(outcomes: Outcome[]): void {
    this.outcomes.length = 0;
    for (const outcome of outcomes) {
      this.outcomes.push(outcome);
    }
  }
}
