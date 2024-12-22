import { Ball } from "./ball";
import { Table } from "./table";

const enum OutcomeType {
  Pot = "Pot",
  Cushion = "Cushion",
  Collision = "Collision",
  Hit = "Hit",
}

export class Outcome {
  readonly timestamp: number = Date.now();

  private constructor(
    readonly type: OutcomeType,
    private ballA: Ball,
    private ballB: Ball,
    readonly incidentSpeed: number,
  ) {
    if (ballA === null || ballB === null) {
      throw new Error("Ball cannot be null");
    }
  }

  static pot(ballA: Ball, incidentSpeed: number) {
    return new Outcome(OutcomeType.Pot, ballA, ballA, incidentSpeed);
  }

  static cushion(ballA: Ball, incidentSpeed: number) {
    return new Outcome(OutcomeType.Cushion, ballA, ballA, incidentSpeed);
  }

  static collision(ballA: Ball, ballB: Ball, incidentSpeed: number) {
    return new Outcome(OutcomeType.Collision, ballA, ballB, incidentSpeed);
  }

  static hit(ballA: Ball, incidentSpeed: number) {
    return new Outcome(OutcomeType.Hit, ballA, ballA, incidentSpeed);
  }

  static isCueBallPotted(cueBall: Ball, outcomes: Outcome[]) {
    return outcomes.some(
      (o) => o.type == OutcomeType.Pot && o.ballA === cueBall,
    );
  }

  static isBallPottedNoFoul(cueBall: Ball, outcomes: Outcome[]) {
    return (
      outcomes.some((o) => o.type == OutcomeType.Pot && o.ballA !== null) &&
      !Outcome.isCueBallPotted(cueBall, outcomes)
    );
  }

  static pots(outcomes: Outcome[]): Ball[] {
    return outcomes
      .filter((o) => o.type == OutcomeType.Pot)
      .map((o) => o.ballA!);
  }
  static potCount(outcomes: Outcome[]) {
    return this.pots(outcomes).length;
  }

  static onlyRedsPotted(outcomes: Outcome[]) {
    return this.pots(outcomes).every((b) => b.id > 6);
  }

  static firstCollision(outcome: Outcome[]) {
    const collisions = outcome.filter((o) => o.type === OutcomeType.Collision);
    return collisions.length > 0 ? collisions[0] : undefined;
  }

  static isClearTable(table: Table) {
    const onTable = table.balls.filter((ball) => ball.onTable());
    return onTable.length === 1 && onTable[0] === table.cueball;
  }

  static isThreeCushionPoint(cueBall: Ball, outcomes: Outcome[]) {
    outcomes = Outcome.cueBallFirst(cueBall, outcomes).filter(
      (outcome) => outcome.ballA === cueBall,
    );
    const cannons = new Set<Ball>();
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

  /** Mutates `outcomes` so that the cue ball is always ballA. */
  private static cueBallFirst(cueBall: Ball, outcomes: Outcome[]) {
    outcomes.forEach((o) => {
      if (o.type === OutcomeType.Collision && o.ballB === cueBall) {
        o.ballB = o.ballA;
        o.ballA = cueBall;
      }
    });
    return outcomes;
  }
}
