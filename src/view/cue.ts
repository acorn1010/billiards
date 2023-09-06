import { TableGeometry } from "../view/tablegeometry"
import { Table } from "../model/table"
import { upCross, unitAtAngle } from "../utils/utils"
import { AimEvent } from "../events/aimevent"
import { AimInputs } from "./aiminputs"
import { Ball, State } from "../model/ball"
import { cueToSpin } from "../model/physics/physics"
import { CueMesh } from "./cuemesh"
import { Mesh, Raycaster, Vector3, MathUtils } from "three"

export class Cue {
  mesh: Mesh
  helperMesh: Mesh
  placerMesh: Mesh
  limit = 0.5
  maxPower = 60.0
  t = 0
  aimInputs: AimInputs
  aim: AimEvent = new AimEvent()

  length = TableGeometry.tableX * 1

  constructor() {
    this.mesh = CueMesh.createCue(0.05, 0.15, this.length)
    this.helperMesh = CueMesh.createHelper()
    this.placerMesh = CueMesh.createPlacer()
  }

  rotateAim(angle) {
    this.aim.angle += angle
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
  }

  adjustHeight(delta) {
    this.aim.verticalOffset = MathUtils.clamp(
      this.aim.verticalOffset + delta,
      -this.limit,
      this.limit
    )
    this.mesh.position.z = this.aim.verticalOffset
    this.updateAimInput()
  }

  adjustSide(delta) {
    this.aim.sideOffset = MathUtils.clamp(
      this.aim.sideOffset + delta,
      -this.limit,
      this.limit
    )
    this.updateAimInput()
  }

  adjustPower(delta) {
    this.aim.power = Math.min(this.maxPower, this.aim.power + delta)
    this.updateAimInput()
  }

  setPower(value: number) {
    this.aim.power = value * this.maxPower
  }

  hit(ball: Ball) {
    const aim = this.aim
    this.t = 0
    ball.state = State.Sliding
    ball.vel.copy(unitAtAngle(aim.angle).multiplyScalar(aim.power))
    const offset = new Vector3(aim.sideOffset, aim.verticalOffset, 0)
    ball.rvel.copy(cueToSpin(offset, ball.vel))
  }

  setSpin(x: number, y: number) {
    const offset = new Vector3(x, y)
    if (offset.length() > 0.26) {
      offset.normalize().multiplyScalar(0.25)
    }
    this.aim.verticalOffset = offset.y
    this.aim.sideOffset = offset.x
    this.updateAimInput()
  }

  updateAimInput() {
    this.aimInputs?.updateVisualState(
      this.aim.sideOffset,
      this.aim.verticalOffset
    )
    this.aimInputs?.updatePowerSlider(this.aim.power / this.maxPower)
  }

  moveTo(pos) {
    this.aim.pos.copy(pos)
    this.mesh.rotation.z = this.aim.angle
    this.helperMesh.rotation.z = this.aim.angle
    const offset = upCross(unitAtAngle(this.aim.angle))
      .multiplyScalar(this.aim.sideOffset)
      .setZ(this.aim.verticalOffset)
    const swing =
      (Math.sin(this.t + Math.PI / 2) - 1) * (this.aim.power / this.maxPower)
    const distanceToBall = unitAtAngle(this.aim.angle)
      .clone()
      .multiplyScalar(swing)
    this.mesh.position.copy(pos.clone().add(offset).add(distanceToBall))
    this.helperMesh.position.copy(pos)
    this.placerMesh.position.copy(pos)
    this.placerMesh.rotation.z = this.t
  }

  update(t) {
    this.t += t
    this.moveTo(this.aim.pos)
  }

  placeBallMode() {
    this.mesh.visible = false
    this.placerMesh.visible = true
  }

  aimMode() {
    this.mesh.visible = true
    this.placerMesh.visible = false
  }

  intersectsAnything(table: Table) {
    const origin = table.balls[0].pos
      .clone()
      .addScaledVector(unitAtAngle(this.aim.angle), -this.length / 2)
    origin.z = this.aim.verticalOffset
    const direction = unitAtAngle(this.aim.angle)
    const raycaster = new Raycaster(origin, direction, 0, this.length / 2 - 0.6)
    const intersections = raycaster.intersectObjects(
      table.balls.map((b) => b.ballmesh.mesh)
    )
    return intersections.length > 0
  }

  showHelper(b) {
    this.helperMesh.visible = b
  }

  toggleHelper() {
    this.showHelper(!this.helperMesh.visible)
  }
}
