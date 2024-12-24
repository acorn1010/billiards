import { PerspectiveCamera, MathUtils } from "three";
import { up, zero, unitAtAngle } from "../utils/utils";
import { AimEvent } from "../events/aimevent";
import { CameraTop } from "./cameratop";
import { R } from "../model/physics/constants";

export class Camera {
  constructor(aspectRatio: number) {
    // Why is the ball radius used here? wtf?
    this.camera = new PerspectiveCamera(45, aspectRatio, R, R * 1_000);
  }

  camera: PerspectiveCamera;
  private readonly mode = this.topView;
  private height = R * 8;

  elapsed: number;

  update(elapsed: number, aim: AimEvent) {
    this.elapsed = elapsed;
    this.mode(aim);
  }

  topView(_: AimEvent) {
    this.camera.fov = CameraTop.fov;
    this.camera.position.lerp(
      CameraTop.viewPoint(this.camera.aspect, this.camera.fov),
      0.9,
    );
    this.camera.up = up;
    this.camera.lookAt(zero);
  }

  aimView(aim: AimEvent, fraction = 0.08) {
    const h = this.height;
    const portrait = this.camera.aspect < 0.8;
    this.camera.fov = portrait ? 60 : 40;
    if (h < 10 * R) {
      const factor = 100 * (10 * R - h);
      this.camera.fov -= factor * (portrait ? 3 : 1);
    }
    this.camera.position.lerp(
      aim.pos.clone().addScaledVector(unitAtAngle(aim.angle), -R * 18),
      fraction,
    );
    this.camera.position.z = h;
    this.camera.up = up;
    this.camera.lookAt(aim.pos.clone().addScaledVector(up, h / 2));
  }

  adjustHeight(delta: number) {
    delta = this.height < 10 * R ? delta / 8 : delta;
    this.height = MathUtils.clamp(this.height + delta, R * 6, R * 120);
  }

  forceMove(aim: AimEvent) {
    if (this.mode === this.aimView) {
      this.aimView(aim, 1);
    }
  }
}
