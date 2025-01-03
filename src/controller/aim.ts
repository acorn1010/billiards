import { BreakEvent } from "../events/breakevent";
import { Controller, HitEvent, Input } from "./controller";
import { ControllerBase } from "./controllerbase";
import { PlayShot } from "./playshot";
import { Replay } from "./replay";
import { Container } from "../container/container";

/**
 * Aim using input events.
 *
 */
export class Aim extends ControllerBase {
  constructor(container: Container) {
    super(container);
    const table = this.container.table;
    table.cue.aimMode();
    table.cueball = this.container.rules.cueball;
    table.cue.moveTo(table.cueball.pos);
    table.cue.aimInputs.showOverlap();
  }

  override handleInput(input: Input): Controller {
    switch (input.key) {
      case "Space":
        this.container.table.cue.adjustPower(input.t * this.scale * 0.7);
        break;
      case "SpaceUp":
        return this.playShot();
      default:
        if (!this.commonKeyHandler(input)) {
          return this;
        }
    }

    this.container.sendEvent(this.container.table.cue.aim);
    return this;
  }

  override handleBreak(breakEvent: BreakEvent): Controller {
    return new Replay(
      this.container,
      breakEvent.init,
      breakEvent.shots,
      breakEvent.retry,
    );
  }

  playShot() {
    const hitEvent = new HitEvent(this.container.table.serialise());
    this.container.sendEvent(hitEvent);
    this.container.recorder.record(hitEvent);
    return new PlayShot(this.container);
  }
}
