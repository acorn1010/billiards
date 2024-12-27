import { Color, Vector3 } from "three";
import { Container } from "../container/container";
import { Input } from "../events/input";
import { Overlap } from "../utils/overlap";
import { unitAtAngle } from "../utils/utils";

export class AimInputs {
  readonly cueBallElement;
  readonly cueTipElement;
  readonly cuePowerElement;
  readonly cueHitElement;
  readonly objectBallStyle: CSSStyleDeclaration | undefined;
  readonly container: Container;
  readonly overlap: Overlap;

  ballWidth;
  ballHeight;
  tipRadius;

  constructor(container: Container) {
    this.container = container;
    this.cueBallElement = document.getElementById("cueBall");
    this.cueTipElement = document.getElementById("cueTip");
    this.cuePowerElement = document.getElementById("cuePower");
    this.cueHitElement = document.getElementById("cueHit");
    this.objectBallStyle = document.getElementById("objectBall")?.style;
    this.overlap = new Overlap(this.container.table.balls);
    this.addListeners();
  }

  private addListeners() {
    this.cueBallElement?.addEventListener("pointermove", (e) => {
      e.buttons === 1 && this.adjustSpin(e);
    });
    this.cueBallElement?.addEventListener("click", (e) => {
      this.adjustSpin(e);
    });
    this.cuePowerElement?.addEventListener("change", () => {
      this.container.table.cue.setPower(this.cuePowerElement.value);
    });

    const onHit = () => {
      this.container.table.cue.setPower(this.cuePowerElement?.value);
      this.container.inputQueue.push(new Input(0, "SpaceUp"));
    };
    this.cueHitElement?.addEventListener("click", onHit);
    if (!("ontouchstart" in window)) {
      document.getElementById("viewP1")?.addEventListener("dblclick", onHit);
    }

    document.addEventListener("wheel", (e) => {
      if (this.cuePowerElement) {
        this.cuePowerElement.value -= Math.sign(e.deltaY) / 10;
        this.container.table.cue.setPower(this.cuePowerElement.value);
        this.container.lastEventTime = performance.now();
      }
    });
  }

  setButtonText(text: string) {
    this.cueHitElement && (this.cueHitElement.innerText = text);
  }

  readDimensions() {
    this.ballWidth = this.cueBallElement?.offsetWidth;
    this.ballHeight = this.cueBallElement?.offsetHeight;
    this.tipRadius = this.cueTipElement?.offsetWidth / 2;
  }

  private adjustSpin(e: { offsetX: number; offsetY: number }) {
    this.readDimensions();
    this.container.table.cue.setSpin(
      new Vector3(
        -(e.offsetX - this.ballWidth / 2) / this.ballWidth,
        -(e.offsetY - this.ballHeight / 2) / this.ballHeight,
      ),
    );
    this.container.lastEventTime = performance.now();
  }

  updateVisualState(x: number, y: number) {
    this.readDimensions();
    const elt = this.cueTipElement?.style;
    if (elt) {
      elt.left = (-x + 0.5) * this.ballWidth - this.tipRadius + "px";
      elt.top = (-y + 0.5) * this.ballHeight - this.tipRadius + "px";
    }
    this.showOverlap();
  }

  showOverlap() {
    if (this.objectBallStyle) {
      const table = this.container.table;
      const dir = unitAtAngle(table.cue.aim.angle);
      const closest = this.overlap.getOverlapOffset(table.cueball, dir);
      if (closest) {
        this.readDimensions();
        this.objectBallStyle.visibility = "visible";
        this.objectBallStyle.left =
          5 + (closest.overlap * this.ballWidth) / 2 + "px";
        this.objectBallStyle.backgroundColor = new Color(0, 0, 0)
          .lerp(closest.ball.ballmesh.color, 0.5)
          .getStyle();
      } else {
        this.objectBallStyle.visibility = "hidden";
      }
    }
  }

  updatePowerSlider(power: number) {
    if (power > 0 && this.cuePowerElement?.value) {
      this.cuePowerElement.value = power;
    }
  }
}
