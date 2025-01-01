import { Vector3 } from "three";
import { Knuckle } from "../model/physics/knuckle";
import { Pocket } from "../model/physics/pocket";
import { TableGeometry } from "./tablegeometry";
import { PoolBallRigidBody } from "../model/physics/PoolBallRigidBody";
import { R } from "../model/physics/constants";

export class PocketGeometry {
  private PX: number;
  private PY: number;
  private knuckleInset: number;
  private knuckleRadius: number;
  /** @VisibleForTesting */
  middleKnuckleInset: number;
  private middleKnuckleRadius: number;
  private cornerRadius: number;
  /** @VisibleForTesting */
  middleRadius: number;

  private pockets: ReturnType<typeof PocketGeometry.prototype.createPockets>;
  private knuckles: Knuckle[];
  private pocketCenters: Pocket[];

  constructor(ballRadius: number) {
    this.scaleToRadius(ballRadius);
  }

  getPockets() {
    return this.pockets;
  }

  getPocketCenters() {
    return this.pocketCenters;
  }

  /** Returns the knuckle that the ball will bounce off of, or undefined if none. */
  findBouncingKnuckle(ball: PoolBallRigidBody, t: number) {
    const futurePosition = ball.futurePosition(t);
    return this.knuckles.find((knuckle: Knuckle) =>
      this.willBounce(knuckle, futurePosition),
    );
  }

  private willBounce(knuckle: Knuckle, futurePosition: Vector3) {
    return futurePosition.distanceTo(knuckle.pos) < R + knuckle.radius;
  }

  private scaleToRadius(ballRadius: number) {
    this.PX = TableGeometry.tableX + ballRadius * (0.8 / 0.5);
    this.PY = TableGeometry.tableY + ballRadius * (0.8 / 0.5);
    this.knuckleInset = (ballRadius * 1.6) / 0.5;
    this.knuckleRadius = (ballRadius * 0.31) / 0.5;
    this.middleKnuckleInset = (ballRadius * 1.385) / 0.5;
    this.middleKnuckleRadius = (ballRadius * 0.2) / 0.5;
    this.cornerRadius = (ballRadius * 1.1) / 0.5;
    this.middleRadius = (ballRadius * 0.9) / 0.5;
    this.pockets = this.createPockets(ballRadius);
    this.pocketCenters = this.createPocketCenters();
    this.knuckles = this.createKnuckles();
  }

  private createKnuckles(): Knuckle[] {
    return [
      this.pockets.pocketNW.knuckleNE,
      this.pockets.pocketNW.knuckleSW,
      this.pockets.pocketN.knuckleNW,
      this.pockets.pocketN.knuckleNE,
      this.pockets.pocketS.knuckleSW,
      this.pockets.pocketS.knuckleSE,
      this.pockets.pocketNE.knuckleNW,
      this.pockets.pocketNE.knuckleSE,
      this.pockets.pocketSE.knuckleNE,
      this.pockets.pocketSE.knuckleSW,
      this.pockets.pocketSW.knuckleSE,
      this.pockets.pocketSW.knuckleNW,
    ];
  }

  private createPocketCenters(): Pocket[] {
    return [
      this.pockets.pocketNW.pocket,
      this.pockets.pocketSW.pocket,
      this.pockets.pocketN.pocket,
      this.pockets.pocketS.pocket,
      this.pockets.pocketNE.pocket,
      this.pockets.pocketSE.pocket,
    ];
  }

  private createPockets(ballRadius: number) {
    // TODO(acorn1010): Rename knuckleSE / knuckleSW, etc. to knuckleLeft, knuckleRight.
    return {
      pocketNW: {
        pocket: new Pocket(
          new Vector3(-this.PX, this.PY, 0),
          this.cornerRadius,
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            -TableGeometry.X + this.knuckleInset,
            TableGeometry.Y + this.knuckleRadius,
            0,
          ),
          this.knuckleRadius,
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -TableGeometry.X - this.knuckleRadius,
            TableGeometry.Y - this.knuckleInset,
            0,
          ),
          this.knuckleRadius,
        ),
      },
      pocketN: {
        pocket: new Pocket(
          new Vector3(0, this.PY + (ballRadius * 0.7) / 0.5, 0),
          this.middleRadius,
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            this.middleKnuckleInset,
            TableGeometry.Y + this.middleKnuckleRadius,
            0,
          ),
          this.middleKnuckleRadius,
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -this.middleKnuckleInset,
            TableGeometry.Y + this.middleKnuckleRadius,
            0,
          ),
          this.middleKnuckleRadius,
        ),
      },
      pocketS: {
        pocket: new Pocket(
          new Vector3(0, -this.PY - (ballRadius * 0.7) / 0.5, 0),
          this.middleRadius,
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            this.middleKnuckleInset,
            -TableGeometry.Y - this.middleKnuckleRadius,
            0,
          ),
          this.middleKnuckleRadius,
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -this.middleKnuckleInset,
            -TableGeometry.Y - this.middleKnuckleRadius,
            0,
          ),
          this.middleKnuckleRadius,
        ),
      },
      pocketNE: {
        pocket: new Pocket(new Vector3(this.PX, this.PY, 0), this.cornerRadius),
        knuckleNW: new Knuckle(
          new Vector3(
            TableGeometry.X - this.knuckleInset,
            TableGeometry.Y + this.knuckleRadius,
            0,
          ),
          this.knuckleRadius,
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            TableGeometry.X + this.knuckleRadius,
            TableGeometry.Y - this.knuckleInset,
            0,
          ),
          this.knuckleRadius,
        ),
      },
      pocketSE: {
        pocket: new Pocket(
          new Vector3(this.PX, -this.PY, 0),
          this.cornerRadius,
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            TableGeometry.X + this.knuckleRadius,
            -TableGeometry.Y + this.knuckleInset,
            0,
          ),
          this.knuckleRadius,
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            TableGeometry.X - this.knuckleInset,
            -TableGeometry.Y - this.knuckleRadius,
            0,
          ),
          this.knuckleRadius,
        ),
      },
      pocketSW: {
        pocket: new Pocket(
          new Vector3(-this.PX, -this.PY, 0),
          this.cornerRadius,
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            -TableGeometry.X + this.knuckleInset,
            -TableGeometry.Y - this.knuckleRadius,
            0,
          ),
          this.knuckleRadius,
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -TableGeometry.X - this.knuckleRadius,
            -TableGeometry.Y + this.knuckleInset,
            0,
          ),
          this.knuckleRadius,
        ),
      },
    };
  }
}
