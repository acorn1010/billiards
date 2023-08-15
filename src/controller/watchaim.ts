import { AimEvent } from "../events/aimevent"
import { HitEvent } from "../events/hitevent"
import { WatchShot } from "./watchshot"
import { ControllerBase } from "./controllerbase"

export class WatchAim extends ControllerBase {
  constructor(container) {
    super(container)
    this.container.table.cue.moveTo(this.container.table.balls[0].pos)
    this.container.view.camera.suggestMode(this.container.view.camera.topView)
  }

  override handleAim(event: AimEvent) {
    this.container.table.cue.aim = event
    this.container.table.balls[0].pos = event.pos
    return this
  }

  override handleHit(event: HitEvent) {
    this.container.table.updateFromSerialised(event.tablejson)
    return new WatchShot(this.container)
  }
}
