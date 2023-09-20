import { Vector3 } from "three"

export const zero = new Vector3(0, 0, 0)
export const up = new Vector3(0, 0, 1)

export function vec(v) {
  return new Vector3(v.x, v.y, v.z)
}

export function upCross(v) {
  return up.clone().cross(v)
}

export function norm(v) {
  return v.clone(v).normalize()
}

const vc = new Vector3()

export function passesThroughZero(v, dv) {
  return vc.copy(v).add(dv).dot(v) <= 0
}

export function unitAtAngle(theta) {
  return new Vector3(1, 0, 0).applyAxisAngle(up, theta)
}

export function round(num) {
  return Math.round((num + Number.EPSILON) * 1000) / 1000
}

export function roundVec(v) {
  v.x = round(v.x)
  v.y = round(v.y)
  v.z = round(v.z)
  return v
}
