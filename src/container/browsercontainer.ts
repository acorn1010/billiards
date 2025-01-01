import { Container } from "./container";
import { Keyboard } from "../events/keyboard";
import { BreakEvent } from "../events/breakevent";
import { mathavenAdapter } from "../model/physics/physics";
import { Assets } from "../view/assets";
import { GameEvent } from "../events/gameevent";

/**
 * Integrate game container into HTML page
 */
export class BrowserContainer {
  container: Container;
  canvas3d;
  tableId;
  clientId;
  ruletype;
  playername: string;
  replay: string | null;
  breakState = {
    init: null,
    shots: Array<string>(),
    now: 0,
    score: 0,
  };
  cushionModel;
  assets: Assets;

  constructor(canvas3d, params) {
    this.playername = params.get("name") ?? "";
    this.tableId = params.get("tableId") ?? "default";
    this.clientId = params.get("clientId") ?? "default";
    this.replay = params.get("state");
    this.ruletype = params.get("ruletype") ?? "nineball";
    this.canvas3d = canvas3d;
    this.cushionModel = mathavenAdapter; // this.cushion(params.get("cushionModel"));
  }

  async start(): Promise<void> {
    this.assets = new Assets(this.ruletype);
    await this.assets.loadFromWeb();
    this.onAssetsReady();
  }

  private onAssetsReady() {
    console.log(`${this.playername} assets ready`);
    this.container = new Container(
      this.canvas3d,
      this.assets,
      this.ruletype,
      new Keyboard(this.canvas3d),
      this.playername,
    );
    this.container.table.cushionModel = this.cushionModel;

    this.container.addEvent(new BreakEvent());

    // trigger animation loops
    this.container.animate(performance.now());
  }

  /** @VisibleForTesting */
  broadcast(event: GameEvent) {
    // Tests overwrite this broadcast function. It's stupid, I know.
    console.log("broadcast", event);
  }
}
