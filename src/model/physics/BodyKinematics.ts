import type { Vector3 } from "three";

export type BodyKinematics = {
  /** Linear velocity */
  v: Vector3;
  /** Angular velocity */
  w: Vector3;
};
