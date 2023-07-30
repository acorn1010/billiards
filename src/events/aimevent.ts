import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { vec, round } from "../utils/utils"
import { Vector3 } from "three"

export class AimEvent extends GameEvent {
  verticalOffset: number = 0
  sideOffset: number = 0
  angle = 0
  power = 0
  pos = new Vector3(0, 0, 0)
  spinOnly: boolean = false

  constructor() {
    super()
    this.type = EventType.AIM
  }

  applyToController(controller: Controller) {
    return controller.handleAim(this)
  }

  static fromJson(json) {
    const event = new AimEvent()
    event.pos = vec(json.pos)
    event.angle = json.angle
    event.verticalOffset = json.verticalOffset
    event.sideOffset = json.sideOffset
    event.power = json.power
    event.spinOnly = json.spinOnly
    return event
  }

  copy(): AimEvent {
    return AimEvent.fromJson(this)
  }

  round() {
    this.angle = round(this.angle)
    this.power = round(this.power)
    this.verticalOffset = round(this.verticalOffset)
    this.sideOffset = round(this.sideOffset)
  }
}
