import { Color, Vector3 } from "three"
import { Container } from "../container/container"
import { Input } from "../events/input"
import { Overlap } from "../utils/overlap"
import { unitAtAngle } from "../utils/utils"

export class AimInputs {
  readonly cueBallElement
  readonly cueTipElement
  readonly cuePowerElement
  readonly cueHitElement
  readonly objectBall: HTMLElement
  readonly container: Container
  readonly overlap: Overlap

  ballWidth
  ballHeight
  tipRadius

  constructor(container) {
    this.container = container
    this.cueBallElement = document.getElementById("cueBall")
    this.cueTipElement = document.getElementById("cueTip")
    this.cuePowerElement = document.getElementById("cuePower")
    this.cueHitElement = document.getElementById("cueHit")
    this.objectBall = document.getElementById("objectBall") as HTMLElement
    this.overlap = new Overlap(this.container.table.balls)
    this.addListeners()
  }

  addListeners() {
    this.cueBallElement?.addEventListener("pointermove", this.mousemove)
    this.cueBallElement?.addEventListener("click", (e) => {
      this.adjustSpin(e)
    })
    this.cueHitElement?.addEventListener("click", this.hit)
    this.cuePowerElement?.addEventListener("change", this.powerChanged)
    document.addEventListener("dblclick", this.hit)
    document.addEventListener("wheel", this.mousewheel)
  }

  setButtonText(text) {
    this.cueHitElement && (this.cueHitElement.innerText = text)
  }

  mousemove = (e) => {
    e.buttons === 1 && this.adjustSpin(e)
  }

  readDimensions() {
    this.ballWidth = this.cueBallElement?.offsetWidth
    this.ballHeight = this.cueBallElement?.offsetHeight
    this.tipRadius = this.cueTipElement?.offsetWidth / 2
  }

  adjustSpin(e) {
    this.readDimensions()
    this.container.table.cue.setSpin(
      new Vector3(
        -(e.offsetX - this.ballWidth / 2) / this.ballWidth,
        -(e.offsetY - this.ballHeight / 2) / this.ballHeight
      )
    )
    this.container.lastEventTime = performance.now()
  }

  updateVisualState(x: number, y: number) {
    this.readDimensions()
    const elt = this.cueTipElement?.style
    if (elt) {
      elt.left = (-x + 0.5) * this.ballWidth - this.tipRadius + "px"
      elt.top = (-y + 0.5) * this.ballHeight - this.tipRadius + "px"
    }
    this.showOverlap()
  }

  showOverlap() {
    const elt = this.objectBall?.style
    if (!elt) {
      return
    }
    const table = this.container.table
    const dir = unitAtAngle(table.cue.aim.angle)
    const closest = this.overlap.getOverlapOffset(table.cueball, dir)
    if (closest) {
      this.readDimensions()
      elt.visibility = "visible"
      elt.left = (closest.overlap * this.ballWidth) / 2 + "px"
      elt.backgroundColor = new Color(0, 0, 0)
        .lerp(closest.ball.ballmesh.color, 0.5)
        .getStyle()
    } else {
      elt.visibility = "hidden"
    }
  }

  powerChanged = (_) => {
    this.container.table.cue.setPower(this.cuePowerElement.value)
  }

  updatePowerSlider(power) {
    power > 0 &&
      this.cuePowerElement?.value &&
      (this.cuePowerElement.value = power)
  }

  hit = (_) => {
    this.container.table.cue.setPower(this.cuePowerElement?.value)
    this.container.inputQueue.push(new Input(0, "SpaceUp"))
  }

  mousewheel = (e) => {
    if (this.cuePowerElement) {
      this.cuePowerElement.value -= Math.sign(e.deltaY) / 10
      this.container.table.cue.setPower(this.cuePowerElement.value)
      this.container.lastEventTime = performance.now()
    }
  }
}
