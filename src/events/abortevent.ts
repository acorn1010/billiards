import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/base"

export class AbortEvent extends GameEvent {
    constructor() {
        super()
        this.type = EventType.ABORT
    }

    applyToController(controller: Controller): Controller {
        return controller.handleAbort(this)
    }
}