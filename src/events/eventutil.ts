import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"
import { AimEvent } from "./aimevent"
import { WatchEvent } from "./watchevent"
import { AbortEvent } from "./abortevent"

export class EventUtil {
  static serialise(event: GameEvent) {
    return JSON.stringify(event)
  }

  static fromSerialised(data: string) {
    let json = JSON.parse(data)
    switch (json.type) {
      case EventType.AIM:
        return AimEvent.fromJson(json)
      case EventType.WATCHAIM:
        return WatchEvent.fromJson(json)
      case EventType.ABORT:
        return new AbortEvent()
      default:
        throw Error("Unknown GameEvent :" + data)
    }
  }
}
