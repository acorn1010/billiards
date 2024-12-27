import { TableGeometry } from "../view/tablegeometry";
import { Table } from "../model/table";
import { upCross, unitAtAngle, norm } from "../utils/utils";
import { AimEvent } from "../events/aimevent";
import { AimInputs } from "./aiminputs";
import { Ball, State } from "../model/ball";
import { cueToSpin } from "../model/physics/physics";
import { CueMesh } from "./cuemesh";
import { Mesh, Raycaster, Vector3 } from "three";
import { R } from "../model/physics/constants";

export class Cue {
  mesh: Mesh;
  readonly helperMesh: Mesh;
  readonly placerMesh: Mesh;
  private readonly offCenterLimit = 0.3;
  private readonly maxPower = 150 * R;
  // TODO(acorn1010): Make this private. Only used by Replay.ts, which is only used by tests/.
  t = 0;
  aimInputs: AimInputs;
  aim: AimEvent = new AimEvent();

  length = TableGeometry.tableX;

  constructor() {
    this.mesh = CueMesh.createCue(
      (R * 0.05) / 0.5,
      (R * 0.15) / 0.5,
      this.length,
    );
    this.helperMesh = CueMesh.createHelper();
    this.placerMesh = CueMesh.createPlacer();
  }

  rotateAim(angle: number) {
    this.aim.angle = this.aim.angle + angle;
    this.mesh.rotation.z = this.aim.angle;
    this.helperMesh.rotation.z = this.aim.angle;
    this.aimInputs.showOverlap();
  }

  adjustPower(delta: number) {
    this.aim.power = Math.min(this.maxPower, this.aim.power + delta);
    this.updateAimInput();
  }

  setPower(value: number) {
    this.aim.power = value * this.maxPower;
  }

  hit(ball: Ball) {
    const aim = this.aim;
    this.t = 0;
    ball.state = State.Sliding;
    ball.vel.copy(unitAtAngle(aim.angle).multiplyScalar(aim.power));
    ball.rvel.copy(cueToSpin(aim.offset, ball.vel));
  }

  aimAtNext(cueball: Ball, ball: Ball) {
    if (!ball) {
      return;
    }
    const lineTo = norm(ball.pos.clone().sub(cueball.pos));
    this.aim.angle = Math.atan2(lineTo.y, lineTo.x);
  }

  setSpin(offset: Vector3) {
    if (offset.length() > this.offCenterLimit) {
      offset.normalize().multiplyScalar(this.offCenterLimit);
    }
    this.aim.offset.copy(offset);
    this.updateAimInput();
  }

  /** @VisibleForTesting */
  updateAimInput() {
    this.aimInputs?.updateVisualState(this.aim.offset.x, this.aim.offset.y);
    this.aimInputs?.updatePowerSlider(this.aim.power / this.maxPower);
    this.aimInputs?.showOverlap();
  }

  moveTo(pos: Vector3) {
    this.aim.pos.copy(pos);
    this.mesh.rotation.z = this.aim.angle;
    this.helperMesh.rotation.z = this.aim.angle;
    const offset = this.spinOffset();
    const swing =
      (Math.sin(this.t + Math.PI / 2) - 1) *
      2 *
      R *
      (this.aim.power / this.maxPower);
    const distanceToBall = unitAtAngle(this.aim.angle)
      .clone()
      .multiplyScalar(swing);
    this.mesh.position.copy(pos.clone().add(offset).add(distanceToBall));
    this.helperMesh.position.copy(pos);
    this.placerMesh.position.copy(pos);
    this.placerMesh.rotation.z = this.t;
  }

  /** Adds `elapsedTimeSeconds` to the current timestamp for this cue stick. */
  update(elapsedTimeSeconds: number) {
    this.t += elapsedTimeSeconds;
    this.moveTo(this.aim.pos);
  }

  placeBallMode() {
    this.mesh.visible = false;
    this.placerMesh.visible = true;
    this.aim.angle = 0;
  }

  aimMode() {
    this.mesh.visible = true;
    this.placerMesh.visible = false;
  }

  private spinOffset() {
    return upCross(unitAtAngle(this.aim.angle))
      .multiplyScalar(this.aim.offset.x * 2 * R)
      .setZ(this.aim.offset.y * 2 * R);
  }

  /** @VisibleForTesting */
  intersectsAnything(table: Table) {
    const offset = this.spinOffset();
    const origin = table.cueball.pos.clone().add(offset);
    const direction = norm(unitAtAngle(this.aim.angle + Math.PI).setZ(0.1));
    const raycaster = new Raycaster(origin, direction);
    const items = table.balls.map((b) => b.ballmesh.mesh);
    if (table.mesh) {
      items.push(table.mesh);
    }
    const intersections = raycaster.intersectObjects(items, true);
    return intersections.length > 0;
  }
}
