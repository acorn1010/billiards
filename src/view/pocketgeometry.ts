import { Vector3 } from "three";
import { Knuckle } from "../model/physics/knuckle";
import { Pocket } from "../model/physics/pocket";
import { TableGeometry } from "./tablegeometry";
import { R } from "../model/physics/constants";

export class PocketGeometry {
  private static PX: number;
  private static PY: number;
  private static knuckleInset: number;
  private static knuckleRadius: number;
  private static middleKnuckleInset: number;
  private static middleKnuckleRadius: number;
  private static cornerRadius: number;
  /** @VisibleForTesting */
  static middleRadius: number;

  static pockets;
  static knuckles;
  static pocketCenters;

  static {
    PocketGeometry.scaleToRadius(R);
  }

  private static scaleToRadius(ballRadius: number) {
    PocketGeometry.PX = TableGeometry.tableX + ballRadius * (0.8 / 0.5);
    PocketGeometry.PY = TableGeometry.tableY + ballRadius * (0.8 / 0.5);
    PocketGeometry.knuckleInset = (ballRadius * 1.6) / 0.5;
    PocketGeometry.knuckleRadius = (ballRadius * 0.31) / 0.5;
    PocketGeometry.middleKnuckleInset = (ballRadius * 1.385) / 0.5;
    PocketGeometry.middleKnuckleRadius = (ballRadius * 0.2) / 0.5;
    PocketGeometry.cornerRadius = (ballRadius * 1.1) / 0.5;
    PocketGeometry.middleRadius = (ballRadius * 0.9) / 0.5;
    PocketGeometry.pocketLayout(ballRadius);
    PocketGeometry.enumerateCenters();
    PocketGeometry.enumerateKnuckles();
  }

  private static enumerateKnuckles() {
    PocketGeometry.knuckles = [
      PocketGeometry.pockets.pocketNW.knuckleNE,
      PocketGeometry.pockets.pocketNW.knuckleSW,
      PocketGeometry.pockets.pocketN.knuckleNW,
      PocketGeometry.pockets.pocketN.knuckleNE,
      PocketGeometry.pockets.pocketS.knuckleSW,
      PocketGeometry.pockets.pocketS.knuckleSE,
      PocketGeometry.pockets.pocketNE.knuckleNW,
      PocketGeometry.pockets.pocketNE.knuckleSE,
      PocketGeometry.pockets.pocketSE.knuckleNE,
      PocketGeometry.pockets.pocketSE.knuckleSW,
      PocketGeometry.pockets.pocketSW.knuckleSE,
      PocketGeometry.pockets.pocketSW.knuckleNW,
    ];
  }

  private static enumerateCenters() {
    PocketGeometry.pocketCenters = [
      PocketGeometry.pockets.pocketNW.pocket,
      PocketGeometry.pockets.pocketSW.pocket,
      PocketGeometry.pockets.pocketN.pocket,
      PocketGeometry.pockets.pocketS.pocket,
      PocketGeometry.pockets.pocketNE.pocket,
      PocketGeometry.pockets.pocketSE.pocket,
    ];
  }

  private static pocketLayout(ballRadius: number) {
    PocketGeometry.pockets = {
      pocketNW: {
        pocket: new Pocket(
          new Vector3(-PocketGeometry.PX, PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius,
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            -TableGeometry.X + PocketGeometry.knuckleInset,
            TableGeometry.Y + PocketGeometry.knuckleRadius,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -TableGeometry.X - PocketGeometry.knuckleRadius,
            TableGeometry.Y - PocketGeometry.knuckleInset,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
      },
      pocketN: {
        pocket: new Pocket(
          new Vector3(0, PocketGeometry.PY + (ballRadius * 0.7) / 0.5, 0),
          PocketGeometry.middleRadius,
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            PocketGeometry.middleKnuckleInset,
            TableGeometry.Y + PocketGeometry.middleKnuckleRadius,
            0,
          ),
          PocketGeometry.middleKnuckleRadius,
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -PocketGeometry.middleKnuckleInset,
            TableGeometry.Y + PocketGeometry.middleKnuckleRadius,
            0,
          ),
          PocketGeometry.middleKnuckleRadius,
        ),
      },
      pocketS: {
        pocket: new Pocket(
          new Vector3(0, -PocketGeometry.PY - (ballRadius * 0.7) / 0.5, 0),
          PocketGeometry.middleRadius,
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            PocketGeometry.middleKnuckleInset,
            -TableGeometry.Y - PocketGeometry.middleKnuckleRadius,
            0,
          ),
          PocketGeometry.middleKnuckleRadius,
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            -PocketGeometry.middleKnuckleInset,
            -TableGeometry.Y - PocketGeometry.middleKnuckleRadius,
            0,
          ),
          PocketGeometry.middleKnuckleRadius,
        ),
      },
      pocketNE: {
        pocket: new Pocket(
          new Vector3(PocketGeometry.PX, PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius,
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            TableGeometry.X - PocketGeometry.knuckleInset,
            TableGeometry.Y + PocketGeometry.knuckleRadius,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            TableGeometry.X + PocketGeometry.knuckleRadius,
            TableGeometry.Y - PocketGeometry.knuckleInset,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
      },
      pocketSE: {
        pocket: new Pocket(
          new Vector3(PocketGeometry.PX, -PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius,
        ),
        knuckleNE: new Knuckle(
          new Vector3(
            TableGeometry.X + PocketGeometry.knuckleRadius,
            -TableGeometry.Y + PocketGeometry.knuckleInset,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
        knuckleSW: new Knuckle(
          new Vector3(
            TableGeometry.X - PocketGeometry.knuckleInset,
            -TableGeometry.Y - PocketGeometry.knuckleRadius,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
      },
      pocketSW: {
        pocket: new Pocket(
          new Vector3(-PocketGeometry.PX, -PocketGeometry.PY, 0),
          PocketGeometry.cornerRadius,
        ),
        knuckleSE: new Knuckle(
          new Vector3(
            -TableGeometry.X + PocketGeometry.knuckleInset,
            -TableGeometry.Y - PocketGeometry.knuckleRadius,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
        knuckleNW: new Knuckle(
          new Vector3(
            -TableGeometry.X - PocketGeometry.knuckleRadius,
            -TableGeometry.Y + PocketGeometry.knuckleInset,
            0,
          ),
          PocketGeometry.knuckleRadius,
        ),
      },
    };
  }
}
