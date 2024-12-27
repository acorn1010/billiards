import { AbortEvent } from "../events/abortevent";
import { Controller } from "./controller";
import { End } from "./end";
import { Outcome } from "../model/outcome";

export abstract class ControllerBase extends Controller {
  readonly scale = 0.001;

  override handleAbort(_: AbortEvent): Controller {
    return new End(this.container);
  }

  hit() {
    this.container.table.outcomes = [
      Outcome.hit(
        this.container.table.cueball,
        this.container.table.cue.aim.power,
      ),
    ];
    this.container.table.hit();
  }

  commonKeyHandler(input) {
    const cue = this.container.table.cue;
    const delta = input.t * this.scale;
    switch (input.key) {
      case "movementXUp":
        cue.rotateAim(delta * 2);
        return true;
      default:
        return false;
    }
  }
}
