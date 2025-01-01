import { CushionRigidBody } from "./physics/cushion";
import { Collision } from "./physics/collision";
import { Pocket } from "./physics/pocket";
import { Cue } from "../view/cue";
import { Ball } from "./ball";
import { AimEvent } from "../events/aimevent";
import { Outcome } from "./outcome";
import { PocketGeometry } from "../view/pocketgeometry";
import { TableGeometry } from "../view/tablegeometry";
import { bounceHanBlend } from "./physics/physics";
import { norm, ZERO_VECTOR } from "../utils/utils";
import { R } from "./physics/constants";
import { Scene, Vector3Like } from "three";
import { PhysicsContext } from "./physics/PhysicsContext";
import {
  PoolBall,
  PoolBallState,
  PoolBallType,
} from "./physics/PoolBallRigidBody";

/** Represents a pair of billiard balls for collision detection */
type Pair = {
  /** First ball in the pair */
  a: Ball;
  /** Second ball in the pair */
  b: Ball;
};

/**
 * Represents a billiards table with balls, cushions, and game logic
 */
export class Table {
  /** All balls on the table */
  balls: Ball[];
  /** The cue stick for hitting balls */
  cue = new Cue();
  /** All possible pairs of balls for collision detection */
  pairs: Pair[];
  /** List of game events that may occur as the physics is advanced. */
  readonly outcomes: Outcome[] = [];
  /** The white cue ball */
  cueball: Ball;
  /** Physics model for cushion bounces */
  cushionModel = bounceHanBlend;
  /** Visual mesh representation */
  mesh;

  private readonly physicsContext = new PhysicsContext();

  private readonly pocketGeometry = new PocketGeometry(R);
  private readonly cushion = new CushionRigidBody(this.pocketGeometry);

  /**
   * Create a new table
   * @param balls Array of balls to place on the table (first ball is cue ball)
   */
  constructor(balls: Ball[]) {
    this.cueball = balls[0];
    this.initialiseBalls(balls);
  }

  /**
   * Initialize ball positions and create all possible ball pairs
   * @param balls Array of balls to initialize
   */
  initialiseBalls(balls: Ball[]): void {
    this.balls = balls;
    this.pairs = [];
    for (let a = 0; a < balls.length; a++) {
      for (let b = a + 1; b < balls.length; b++) {
        this.pairs.push({ a: balls[a], b: balls[b] });
      }
    }

    this.updateBallPositions();
  }

  /**
   * Updates the pool physics context ball positions. Call whenever modifying ball positions
   * outside of calls to step().
   */
  updateBallPositions(): void {
    const balls = this.balls;
    // Add balls to the physics world.
    const ballPositions: PoolBall[] = [];
    for (let i = 0; i < balls.length; ++i) {
      const ball = balls[i];
      const rotation = norm(ball.rvel);
      ballPositions.push({
        type: ball === this.cueball ? "Cue" : ((i + 1) as PoolBallType),
        diameter: R * 2,
        x: ball.pos.x,
        y: ball.pos.y,
        z: ball.pos.z,
        rotation: [rotation.x, rotation.y, rotation.z],
      });
    }
    this.physicsContext.setBallPositions(ballPositions);
  }

  /**
   * Update visual meshes for all balls
   * @param t Time step in seconds
   */
  updateBallMesh(t: number): void {
    this.balls.forEach((a) => {
      a.updateMesh(t);
    });
  }

  /**
   * Advance physics simulation by one time step
   * @param t Time step in seconds
   * @throws Error if collision resolution exceeds maximum depth
   */
  advance(t: number): void {
    let depth = 0;
    this.physicsContext.step(t);
    while (!this.prepareAdvanceAll(t)) {
      if (depth++ > 100) {
        throw new Error("Depth exceeded resolving collisions");
      }
    }
    this.balls.forEach((a) => {
      a.update(t);
    });
  }

  /**
   * Check if all balls can advance by time step without collisions
   * @param t Time step in seconds
   * @returns True if no collisions will occur
   * @VisibleForTesting
   */
  prepareAdvanceAll(t: number): boolean {
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
  private prepareAdvancePair(a: Ball, b: Ball, t: number): boolean {
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
  private prepareAdvanceToCushions(ball: Ball, t: number): boolean {
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
    const maybePocket = Pocket.findPocket(
      this.pocketGeometry.getPocketCenters(),
      ball,
      t,
    );
    if (maybePocket) {
      const pocketIncidentSpeed = maybePocket.fall(ball, t);
      this.outcomes.push(Outcome.pot(ball, pocketIncidentSpeed));
      return false;
    }

    return true;
  }

  private wasStationary = true;
  /**
   * Check if all balls are stationary
   * @returns True if no balls are in motion
   */
  allStationary(): boolean {
    const result = this.balls.every((b) => !b.inMotion());
    this.wasStationary = result;
    return result;
  }

  /**
   * Count number of balls in pockets
   * @returns Number of potted balls
   */
  inPockets(): number {
    return this.balls.reduce((acc, b) => (b.onTable() ? acc : acc + 1), 0);
  }

  /**
   * Hit the cue ball with the cue stick
   */
  hit(): void {
    this.physicsContext.reset();

    // TODO(acorn1010): Populate the world with balls and cushions

    this.outcomes.length = 0;
    this.outcomes.push(Outcome.hit(this.cueball, this.cue.aim.power));
    this.physicsContext.setOutcomes(this.outcomes);

    this.cue.hit(this.cueball);
    const maybeCueBall = this.physicsContext.getBalls()[0];
    if (maybeCueBall) {
      // TODO(acorn1010): In our code, replace this with wherever we're calling
      //  applyImpulseAtPoint.
      this.cue.hit(maybeCueBall!);
    }
  }

  /**
   * Serialize table state to JSON
   * @returns Serialized table data
   */
  serialise(): {
    balls: ReturnType<Ball["serialise"]>[];
    aim: ReturnType<Cue["aim"]["copy"]>;
  } {
    return {
      balls: this.balls.map((b) => b.serialise()),
      aim: this.cue.aim.copy(),
    };
  }

  /**
   * Create a new table from serialized data
   * @param data Serialized table data
   * @returns New table instance
   */
  static fromSerialised(data: { balls: any[]; aim?: any }): Table {
    const table = new Table(data.balls.map((b) => Ball.fromSerialised(b)));
    table.updateFromSerialised(data);
    return table;
  }

  /**
   * Update table state from serialized data
   * @param data Serialized table data
   */
  updateFromSerialised(data: { balls?: any[]; aim?: any }): void {
    if (data.balls) {
      data.balls.forEach((b) => Ball.updateFromSerialised(this.balls[b.id], b));
    }
    if (data.aim) {
      this.cue.aim = AimEvent.fromJson(data.aim);
    }
  }

  /**
   * Create compact serialized representation of ball positions
   * @returns Array of x,y coordinates for all balls
   */
  shortSerialise(): number[] {
    return this.balls
      .map((b) => [b.pos.x, b.pos.y])
      .reduce((acc, val) => acc.concat(val), []);
  }

  /**
   * Update ball positions from compact serialized data
   * @param data Array of x,y coordinates for all balls
   */
  updateFromShortSerialised(data: number[]): void {
    this.balls.forEach((b, i) => {
      b.pos.x = data[i * 2];
      b.pos.y = data[i * 2 + 1];
      b.pos.z = 0;
      b.vel.copy(ZERO_VECTOR);
      b.rvel.copy(ZERO_VECTOR);
      b.state = PoolBallState.Stationary;
    });
  }

  /**
   * Add table elements to the 3D scene
   * @param scene Three.js scene to add elements to
   */
  addToScene(scene: Scene): void {
    this.balls.forEach((b) => {
      b.ballmesh.addToScene(scene);
    });
    scene.add(this.cue.mesh);
    scene.add(this.cue.helperMesh);
    scene.add(this.cue.placerMesh);
  }

  /**
   * Toggle visibility of ball spin indicators
   * @param visible Whether spin indicators should be visible
   */
  showSpin(visible: boolean): void {
    this.balls.forEach((b) => {
      b.ballmesh.spinAxisArrow.visible = visible;
    });
  }

  /**
   * Stop all ball motion
   */
  halt(): void {
    this.balls.forEach((b) => {
      b.vel.copy(ZERO_VECTOR);
      b.rvel.copy(ZERO_VECTOR);
      b.state = PoolBallState.Stationary;
    });
  }

  /**
   * Round cue ball position if it doesn't overlap other balls
   */
  roundCueBallPosition(): void {
    const pos = this.cueball.pos.clone();
    if (this.overlapsAny(pos)) {
      return;
    }
    this.cueball.pos.copy(pos);
  }

  /**
   * Check if a position overlaps with any ball
   * @param pos Position to check
   * @param excluding Ball to exclude from check (default: cue ball)
   * @returns True if position overlaps any non-excluded ball
   */
  overlapsAny(pos: Vector3Like, excluding = this.cueball): boolean {
    return this.balls
      .filter((b) => b !== excluding)
      .some((b) => b.pos.distanceTo(pos) < 2 * R);
  }
}
