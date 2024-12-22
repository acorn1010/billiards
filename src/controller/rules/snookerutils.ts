import { Outcome } from "../../model/outcome";
import { Respot } from "../../utils/respot";
import { Table } from "../../model/table";

export type ShotInfo = {
  /** Returns the number of potted balls? */
  pots: number;
  firstCollision: Outcome | undefined;
  /** True if the first collision was a legal move (e.g. hitting your assigned color). */
  legalFirstCollision: boolean;
  /** True if the cue ball was potted. */
  whitePotted: boolean;
};

export class SnookerUtils {
  static shotInfo(
    table: Table,
    outcome: Outcome[],
    targetIsRed: boolean,
  ): ShotInfo {
    const firstCollision = Outcome.firstCollision(outcome);
    return {
      pots: Outcome.potCount(outcome),
      firstCollision: firstCollision,
      legalFirstCollision: SnookerUtils.isLegalFirstCollision(
        table,
        targetIsRed,
        firstCollision,
      ),
      whitePotted: Outcome.isCueBallPotted(table.cueball, outcome),
    };
  }

  static isLegalFirstCollision(
    table: Table,
    targetIsRed: boolean,
    firstCollision?: Outcome,
  ) {
    if (!firstCollision) {
      return false;
    }
    const id = firstCollision.ballB!.id;
    if (targetIsRed) {
      return id >= 7;
    }
    const lesserBallOnTable =
      SnookerUtils.coloursOnTable(table).filter((b) => b.id < id).length > 0;
    return !lesserBallOnTable;
  }

  static respotAllPottedColours(table, outcome: Outcome[]) {
    return Outcome.pots(outcome)
      .filter((ball) => ball.id < 7)
      .filter((ball) => ball.id !== 0)
      .map((ball) => Respot.respot(ball, table));
  }

  static redsOnTable(table: Table) {
    return table.balls.slice(7).filter((ball) => ball.onTable());
  }

  static coloursOnTable(table: Table) {
    return table.balls.slice(1, 7).filter((ball) => ball.onTable());
  }
}
