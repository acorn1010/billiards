import { Controller } from "./base"
import { AimEvent } from "../events/aimevent"
import { AbortEvent } from "../events/abortevent"

/**
 * Aim using input events.
 *
 * Transitions to PlayShot.
 * Game events are ignored besides chat and abort messages.
 */
export class Aim extends Controller {
    handleAim(event: AimEvent): Controller {
        console.log("handling "+event)
        return this
    }
    handleAbort(event: AbortEvent): Controller {
        console.log("ignoring "+event)
        return this
    }
}