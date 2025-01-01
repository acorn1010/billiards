import { GameEvent } from "./gameevent";
import { EventType } from "./eventtype";
import { Controller } from "../controller/controller";
import { vec } from "../utils/utils";
import { Vector3 } from "three";

export class PlaceBallEvent extends GameEvent {
  pos: Vector3;
  allTable: boolean;

  constructor(pos: Vector3, allTable: boolean) {
    super();
    this.pos = pos;
    // wtf is allTable???
    this.allTable = allTable;
    this.type = EventType.PLACEBALL;
  }

  static fromJson(json) {
    return new PlaceBallEvent(vec(json.pos), json.allTable);
  }
  applyToController(controller: Controller) {
    return controller.handlePlaceBall(this);
  }
}
