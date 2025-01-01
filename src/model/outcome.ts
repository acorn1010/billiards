import { Table } from "./table";
import { PoolBallRigidBody } from "./physics/PoolBallRigidBody";

/**
 * Types of game events that can occur
 */
const enum OutcomeType {
  /** Ball falls into a pocket */
  Pot = "Pot",
  /** Ball hits a cushion */
  Cushion = "Cushion",
  /** Two balls collide */
  Collision = "Collision",
  /** Cue hits a ball */
  Hit = "Hit",
}

/**
 * Represents a game event like a collision or pot
 */
export class Outcome {
  /** Unix timestamp when this event occurred in ms. */
  readonly timestamp: number = Date.now();

  /**
   * Create a new game event
   * @param type Type of event
   * @param ballA Primary ball involved
   * @param ballB Secondary ball involved (same as ballA for non-collision events)
   * @param incidentSpeed Speed at time of event
   * @throws Error if either ball is null
   */
  private constructor(
    readonly type: OutcomeType,
    private ballA: PoolBallRigidBody,
    public ballB: PoolBallRigidBody,
    readonly incidentSpeed: number,
  ) {
    if (ballA === null || ballB === null) {
      throw new Error("Ball cannot be null");
    }
  }

  /**
   * Create a pot event
   * @param ballA Ball that was potted
   * @param incidentSpeed Speed when entering pocket
   */
  static pot(ballA: PoolBallRigidBody, incidentSpeed: number): Outcome {
    return new Outcome(OutcomeType.Pot, ballA, ballA, incidentSpeed);
  }

  /**
   * Create a cushion hit event
   * @param ballA Ball that hit cushion
   * @param incidentSpeed Speed at impact in m/s
   */
  static cushion(ballA: PoolBallRigidBody, incidentSpeed: number): Outcome {
    return new Outcome(OutcomeType.Cushion, ballA, ballA, incidentSpeed);
  }

  /**
   * Create a ball collision event
   * @param ballA First ball in collision
   * @param ballB Second ball in collision
   * @param incidentSpeed Speed at impact in m/s
   */
  static collision(
    ballA: PoolBallRigidBody,
    ballB: PoolBallRigidBody,
    incidentSpeed: number,
  ): Outcome {
    return new Outcome(OutcomeType.Collision, ballA, ballB, incidentSpeed);
  }

  /**
   * Create a cue hit event
   * @param ballA Ball that was hit
   * @param incidentSpeed Speed of cue at impact in m/s
   */
  static hit(ballA: PoolBallRigidBody, incidentSpeed: number): Outcome {
    return new Outcome(OutcomeType.Hit, ballA, ballA, incidentSpeed);
  }

  /**
   * Check if cue ball was potted
   * @param cueBall The cue ball
   * @param outcomes List of game events
   * @returns True if cue ball was potted
   */
  static isCueBallPotted(
    cueBall: PoolBallRigidBody,
    outcomes: Outcome[],
  ): boolean {
    return outcomes.some(
      (o) => o.type == OutcomeType.Pot && o.ballA === cueBall,
    );
  }

  /**
   * Check if any non-cue ball was potted legally
   * @param cueBall The cue ball
   * @param outcomes List of game events
   * @returns True if a legal pot occurred
   */
  static isBallPottedNoFoul(
    cueBall: PoolBallRigidBody,
    outcomes: Outcome[],
  ): boolean {
    return (
      outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA !== null) &&
      !Outcome.isCueBallPotted(cueBall, outcomes)
    );
  }

  /**
   * Get list of all potted balls
   * @param outcomes List of game events
   * @returns Array of potted balls
   */
  static pots(outcomes: Outcome[]): PoolBallRigidBody[] {
    return outcomes
      .filter((o) => o.type == OutcomeType.Pot)
      .map((o) => o.ballA!);
  }

  /**
   * Count number of potted balls
   * @param outcomes List of game events
   * @returns Number of pots
   */
  static potCount(outcomes: Outcome[]): number {
    return this.pots(outcomes).length;
  }

  /**
   * Check if only red balls were potted
   * @param _outcomes List of game events
   * @returns True if all potted balls were reds
   */
  static onlyRedsPotted(_outcomes: Outcome[]): boolean {
    // TODO(acorn1010): Move to Snooker logic.
    return false;
    // return this.pots(outcomes).every((b) => b.id > 6);
  }

  /**
   * Get the first ball-to-ball collision
   * @param outcome List of game events
   * @returns First collision event, if any
   */
  static firstCollision(outcome: Outcome[]): Outcome | undefined {
    const collisions = outcome.filter((o) => o.type === OutcomeType.Collision);
    return collisions.length > 0 ? collisions[0] : undefined;
  }

  /**
   * Check if table has been cleared except for cue ball
   * @param table The game table
   * @returns True if only cue ball remains
   */
  static isClearTable(table: Table): boolean {
    const onTable = table.balls.filter((ball) => ball.onTable());
    return onTable.length === 1 && onTable[0] === table.cueball;
  }

  /**
   * Check if a three-cushion point was scored
   * @param cueBall The cue ball
   * @param outcomes List of game events
   * @returns True if three cushions were hit before second collision
   */
  static isThreeCushionPoint(
    cueBall: PoolBallRigidBody,
    outcomes: Outcome[],
  ): boolean {
    outcomes = Outcome.cueBallFirst(cueBall, outcomes).filter(
      (outcome) => outcome.ballA === cueBall,
    );
    const cannons = new Set<PoolBallRigidBody>();
    let cushions = 0;
    for (const outcome of outcomes) {
      if (outcome.type === OutcomeType.Cushion) {
        cushions++;
      }
      if (outcome.type === OutcomeType.Collision) {
        cannons.add(outcome.ballB);
        if (cannons.size === 2) {
          return cushions >= 3;
        }
      }
    }
    return false;
  }

  /**
   * Ensure cue ball is always ballA in collision events
   * @param cueBall The cue ball
   * @param outcomes List of game events to modify
   * @returns Modified outcomes list
   */
  private static cueBallFirst(
    cueBall: PoolBallRigidBody,
    outcomes: Outcome[],
  ): Outcome[] {
    outcomes.forEach((o) => {
      if (o.type === OutcomeType.Collision && o.ballB === cueBall) {
        o.ballB = o.ballA;
        o.ballA = cueBall;
      }
    });
    return outcomes;
  }
}
