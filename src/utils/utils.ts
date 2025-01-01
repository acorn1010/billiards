import { Vector3, Vector3Like } from "three";

export const ZERO_VECTOR = new Vector3(0, 0, 0);
export const UP_VECTOR = new Vector3(0, 0, 1);

export function vec(v: Vector3Like) {
  return new Vector3(v.x, v.y, v.z);
}

const upCrossVec = new Vector3();
export function upCross(v: Vector3Like) {
  return upCrossVec.copy(UP_VECTOR).cross(v);
}
const normVec = new Vector3();
export function norm(v: Vector3Like) {
  return normVec.copy(v).normalize();
}

const vc = new Vector3();
export function passesThroughZero(v: Vector3Like, dv: Vector3Like) {
  return vc.copy(v).add(dv).dot(v) <= 0;
}

export function unitAtAngle(theta: number) {
  return new Vector3(1, 0, 0).applyAxisAngle(UP_VECTOR, theta);
}

export function round(num: number) {
  const sign = Math.sign(num);
  return (
    (sign * Math.floor((Math.abs(num) + Number.EPSILON) * 10_000)) / 10_000
  );
}

export function roundVec(v: Vector3) {
  v.x = round(v.x);
  v.y = round(v.y);
  v.z = round(v.z);
  return v;
}
