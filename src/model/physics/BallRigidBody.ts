import { Vector3 } from "three";
import { World } from "./World";

// type PoolBallType =
//   | 1
//   | 2
//   | 3
//   | 4
//   | 5
//   | 6
//   | 7
//   | 8
//   | 9
//   | 10
//   | 11
//   | 12
//   | 13
//   | 14
//   | 15
//   | "Cue";

// type PoolBall = {
//   type: PoolBallType;
//   /** The diameter in meters of the pool ball. */
//   diameter: number;
//   /** The x-axis for the center of the pool ball on the table. */
//   x: number;
//   /** The y-axis for the center of the pool ball on (or off) the table. */
//   y: number;
//   /** The z-axis for the center of the pool ball on the table. */
//   z: number;
//   /** The ball's rotation. */
//   rotation: [x: number, y: number, z: number];
//   /**
//    * 0-based index of the pocket that this ball landed in, if any. Once a ball is pocketed, it
//    * should no longer appear on the table. This is a string because we can't trust people naming
//    * Blender table models to be consistent.
//    *
//    * @minLength 1
//    * @maxLength 32
//    */
//   pocket?: string;
//
//   /**
//    * The Unix timestamp when this ball was pocketed. If two balls are pocketed at the same time, we
//    * count the ball with the lower `ballId` (e.g. cue ball is always ballId 0) as the first ball
//    * pocketed.
//    */
//   pocketedAt?: number;
// };

export class BallRigidBody {
  constructor(readonly _world: World) {}

  applyImpulseAtPoint(_impulse: Vector3, _point: Vector3) {
    // this.container.table.outcomes = [
    //   Outcome.hit(
    //     this.container.table.cueball,
    //     this.container.table.cue.aim.power,
    //   ),
    // ];
    // this.container.table.hit();
  }
}
