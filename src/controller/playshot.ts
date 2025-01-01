import { Controller, Input } from "./controller";
import { ControllerBase } from "./controllerbase";
import { Container } from "../container/container";

/**
 * PlayShot starts balls rolling using cue state, applies rules to outcome
 *
 */
export class PlayShot extends ControllerBase {
  constructor(container: Container) {
    super(container);
    this.hit();
  }

  override handleStationary(_) {
    const table = this.container.table;
    const outcomes = table.outcomes;
    const nextController = this.container.rules.update(outcomes);
    this.container.recorder.updateBreak(outcomes);
    table.cue.aimAtNext(
      table.cueball,
      this.container.rules.nextCandidateBall(),
    );
    return nextController;
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input);
    return this;
  }
}
