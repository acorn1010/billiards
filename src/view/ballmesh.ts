import {
  IcosahedronGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  ArrowHelper,
} from "three"
import { State } from "../model/ball"
import { norm, up, zero } from "./../utils/utils"

export class BallMesh {
  mesh: Mesh
  shadow: Mesh
  spinAxisArrow: ArrowHelper
  constructor(color) {
    this.initialiseMesh(color)
  }

  updatePosition(pos) {
    this.mesh.position.copy(pos)
    this.shadow.position.copy(pos)
  }

  m = new Matrix4()

  updateRotation(rvel, t) {
    const angle = rvel.length() * t
    const m = this.m.identity().makeRotationAxis(norm(rvel), angle)
    this.mesh.geometry.applyMatrix4(m)
  }

  updateArrows(pos, rvel, state) {
    this.spinAxisArrow.setLength(0.4 + rvel.length() / 2, 0.1, 0.1)
    this.spinAxisArrow.position.copy(pos)
    this.spinAxisArrow.setDirection(norm(rvel))
    if (state == State.Rolling) {
      this.spinAxisArrow.setColor(0xff0000)
    } else {
      this.spinAxisArrow.setColor(0x00ff00)
    }
  }

  initialiseMesh(color) {
    const geometry = new IcosahedronGeometry(0.5, 1)
    const material = new MeshPhongMaterial({
      color: color,
      emissive: 0,
      flatShading: true,
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.name = "ball"

    const shadowGeometry = new CircleGeometry(0.45, 9)
    shadowGeometry.applyMatrix4(
      new Matrix4().identity().makeTranslation(0, 0, -0.49)
    )
    const shadowMaterial = new MeshBasicMaterial({ color: 0x111122 })
    this.shadow = new Mesh(shadowGeometry, shadowMaterial)
    this.spinAxisArrow = new ArrowHelper(up, zero, 2, 0x000000)
    this.spinAxisArrow.visible = false
  }
}
