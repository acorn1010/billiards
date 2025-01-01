import { Vector3 } from "three";
import { R, g } from "./constants";
import { UP_VECTOR, upCross, ZERO_VECTOR } from "../../utils/utils";
import { PoolBallRigidBody, PoolBallState } from "./PoolBallRigidBody";

export class Pocket {
  /** Maps a Ball to its 0-based resting depth offset. */
  private readonly restingDepthOffsetByBall = new Map<
    PoolBallRigidBody,
    number
  >();

  constructor(
    /** @VisibleForTesting */
    readonly pos: Vector3,
    private readonly radius: number,
  ) {}

  private static willFall(pocket: Pocket, futurePosition: Vector3) {
    return futurePosition.distanceTo(pocket.pos) < pocket.radius;
  }

  public fall(ball: PoolBallRigidBody, t: number): number {
    ball.vel.z = -g * t;
    ball.state = PoolBallState.Falling;
    ball.pocket = this;
    return ball.vel.length();
  }

  public updateFall(ball: PoolBallRigidBody, t: number) {
    ball.vel.addScaledVector(UP_VECTOR, -R * 10 * t * g);
    const z = ball.pos.z;
    const xypos = ball.pos.clone().setZ(0);
    const distToCentre = xypos.distanceTo(this.pos);
    if (distToCentre > this.radius - R) {
      const toCentre = this.pos.clone().sub(ball.pos).normalize().setZ(0);
      if (z > -R / 2) {
        ball.vel.addScaledVector(toCentre, R * 7 * t * g);
        ball.rvel.addScaledVector(upCross(toCentre), 7 * t * g);
      }
      if (ball.vel.dot(toCentre) < 0) {
        ball.vel.x = (toCentre.x * ball.vel.length()) / 2;
        ball.vel.y = (toCentre.y * ball.vel.length()) / 2;
      }
    }

    const restingDepth = this.restingDepth(ball);
    if (z < restingDepth && ball.rvel.length() !== 0) {
      ball.pos.z = restingDepth;
      ball.vel.z = -R / 10;
      ball.rvel.copy(ZERO_VECTOR);
    }

    if (z < restingDepth - R) {
      ball.pos.z = restingDepth - R;
      ball.setStationary();
      ball.state = PoolBallState.InPocket;
    }
  }

  private restingDepth(ball: PoolBallRigidBody): number {
    if (!this.restingDepthOffsetByBall.has(ball)) {
      this.restingDepthOffsetByBall.set(
        ball,
        this.restingDepthOffsetByBall.size,
      );
    }
    const offset = this.restingDepthOffsetByBall.get(ball)!;
    return -3 * R - (R * offset) / 4;
  }

  static findPocket(
    pocketCenters: Pocket[],
    ball: PoolBallRigidBody,
    t: number,
  ) {
    const futurePosition = ball.futurePosition(t);
    return pocketCenters.find((p) => Pocket.willFall(p, futurePosition));
  }
}
