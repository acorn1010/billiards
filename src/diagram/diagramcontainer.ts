import { Container } from "../container/container";
import { Keyboard } from "../events/keyboard";
import { BreakEvent } from "../events/breakevent";
import { CameraTop } from "../view/cameratop";
import { bounceHan } from "../model/physics/physics";
import { Assets } from "../view/assets";

/**
 * Integrate billiards container into diagram html page
 */
export class DiagramContainer {
  container: Container;
  canvas3d;
  ruletype;
  replay: string;
  cushionModel;
  breakState = {
    init: null,
    shots: Array<string>(),
  };

  constructor(canvas3d, ruletype, replay) {
    this.replay = replay;
    this.ruletype = ruletype;
    this.canvas3d = canvas3d;
    CameraTop.zoomFactor = 0.88;
  }

  start() {
    const keyboard = new Keyboard(this.canvas3d);
    this.container = new Container(
      this.canvas3d,
      Assets.localAssets(this.ruletype),
      this.ruletype,
      keyboard,
      "diagram",
    );
    if (this.cushionModel) {
      this.container.table.cushionModel = this.cushionModel;
    }
    this.onAssetsReady();
  }

  onAssetsReady = () => {
    console.log(`diagram ready`);
    this.breakState = JSON.parse(decodeURIComponent(this.replay));
    const replaybutton = document.getElementById(
      "replay",
    )! as HTMLButtonElement;
    this.replayButton(replaybutton);
    this.container.addEvent(
      new BreakEvent(this.breakState.init, this.breakState.shots),
    );
    this.container.animate(performance.now());
  };

  replayButton(replaybutton) {
    replaybutton.innerHTML = "↻";
    replaybutton.addEventListener("click", () => {
      if (this.container.getEventCount() == 0) {
        this.container.addEvent(
          new BreakEvent(this.breakState.init, this.breakState.shots),
        );
      }
    });
  }

  static fromDiamgramElement(diagram): DiagramContainer {
    const containerDiv = diagram?.getElementsByClassName("topview")[0];
    const stateUrl = containerDiv?.getAttribute("data-state");
    const params = new URLSearchParams(stateUrl);
    const p = diagram?.getElementsByClassName("description")[0];
    const common = document.getElementById("common");
    const editlink = document.createElement("a");
    editlink.href = `../${stateUrl}`;
    editlink.innerHTML = "⬀";
    editlink.target = "_blank";
    p?.appendChild(editlink);
    common?.appendChild(editlink);
    const replaybutton = document.createElement("button");
    p?.appendChild(replaybutton);
    const diagramcontainer = new DiagramContainer(
      containerDiv,
      params.get("ruletype"),
      params.get("state"),
    );
    diagramcontainer.replayButton(replaybutton);
    if (params.get("cushionModel") == "bounceHan") {
      diagramcontainer.cushionModel = bounceHan;
    }
    return diagramcontainer;
  }
}
