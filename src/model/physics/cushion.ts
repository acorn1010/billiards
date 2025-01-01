import { PocketGeometry } from "../../view/pocketgeometry";
import { TableGeometry } from "../../view/tablegeometry";
import { bounceHanBlend, rotateApplyUnrotate } from "./physics";
import { Vector3 } from "three";
import { BodyKinematics } from "./BodyKinematics";
import { PoolBallRigidBody } from "./PoolBallRigidBody";

export class CushionRigidBody {
  constructor(private readonly pocketGeometry: PocketGeometry) {}

  /**
   * Modify ball state reflecting in cushion if it impacts in time t.
   * Returns impact speed else undefined.
   *
   * Knuckle impacts are not part of this and handled elsewhere.
   */
  bounceAny(
    ball: PoolBallRigidBody,
    t: number,
    hasPockets: boolean = true,
    cushionModel = bounceHanBlend,
  ): number | undefined {
    const futurePosition = ball.futurePosition(t);

    if (this.willBounceLong(futurePosition, hasPockets)) {
      const dir =
        futurePosition.y > TableGeometry.tableY ? -Math.PI / 2 : Math.PI / 2;
      return this.bounceIn(dir, ball, cushionModel);
    }

    if (this.willBounceShort(futurePosition, hasPockets)) {
      const dir = futurePosition.x > TableGeometry.tableX ? 0 : Math.PI;
      return this.bounceIn(dir, ball, cushionModel);
    }

    return undefined;
  }

  willBounceShort(futurePosition: Vector3, hasPockets: boolean) {
    if (!hasPockets) {
      return this.willBounceShortSegment(
        TableGeometry.Y,
        -TableGeometry.Y,
        futurePosition,
      );
    }
    const pockets = this.pocketGeometry.getPockets();
    return this.willBounceShortSegment(
      pockets.pocketNW.knuckleSW.pos.y,
      pockets.pocketSW.knuckleNW.pos.y,
      futurePosition,
    );
  }

  willBounceLong(futurePosition: Vector3, hasPockets: boolean) {
    if (!hasPockets) {
      return this.willBounceLongSegment(
        -TableGeometry.X,
        TableGeometry.X,
        futurePosition,
      );
    }
    const pockets = this.pocketGeometry.getPockets();
    return (
      this.willBounceLongSegment(
        pockets.pocketNW.knuckleNE.pos.x,
        pockets.pocketN.knuckleNW.pos.x,
        futurePosition,
      ) ||
      this.willBounceLongSegment(
        pockets.pocketN.knuckleNE.pos.x,
        pockets.pocketNE.knuckleNW.pos.x,
        futurePosition,
      )
    );
  }

  /**
   * Long Cushion refers to the longest dimension of table (skipping middle pocket),
   * in this model that is oriented along the X axis.
   */
  private willBounceLongSegment(
    left: number,
    right: number,
    futurePosition: Vector3,
  ): boolean {
    return (
      futurePosition.x > left &&
      futurePosition.x < right &&
      Math.abs(futurePosition.y) > TableGeometry.tableY
    );
  }

  private willBounceShortSegment(
    top: number,
    bottom: number,
    futurePosition: Vector3,
  ): boolean {
    return (
      futurePosition.y > bottom &&
      futurePosition.y < top &&
      Math.abs(futurePosition.x) > TableGeometry.tableX
    );
  }

  private bounceIn(
    rotation: number,
    ball: PoolBallRigidBody,
    cushionModel: (v: Vector3, w: Vector3) => BodyKinematics,
  ) {
    const delta = rotateApplyUnrotate(
      rotation,
      ball.vel,
      ball.rvel,
      cushionModel,
    );
    ball.vel.add(delta.v);
    ball.rvel.add(delta.w);
    return delta.v.length();
  }
}
