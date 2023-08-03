import {
  Vector3,
  Matrix4,
  Mesh,
  CylinderGeometry,
  BoxGeometry,
  MeshPhongMaterial,
} from "three"
import { Knuckle } from "../model/physics/knuckle"
import { Pocket } from "../model/physics/pocket"

// NW 1.05 Qn{x: -22.3, y: 11.3, z: 0}
// N 1 0.9 Qn{x: 0, y: 12.0, z: 0}

export class TableGeometry {
  static tableX = 21.5
  static tableY = 10.5
  static X = TableGeometry.tableX + 0.5
  static Y = TableGeometry.tableY + 0.5
  static PX = TableGeometry.tableX + 0.8
  static PY = TableGeometry.tableY + 0.8
  static knuckleInset = 1.6
  static knuckleRadius = 0.31
  static middleKnuckleInset = 1.385
  static middleKnuckleRadius = 0.2
  static cornerRadius = 1.1
  static middleRadius = 0.9
  static readonly pockets = {
    pocketNW: {
      pocket: new Pocket(
        new Vector3(-TableGeometry.PX, TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          -TableGeometry.X + TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.X - TableGeometry.knuckleRadius,
          TableGeometry.Y - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketN: {
      pocket: new Pocket(
        new Vector3(0, TableGeometry.PY + 0.7, 0),
        TableGeometry.middleRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.middleKnuckleInset,
          TableGeometry.Y + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          TableGeometry.Y + TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
    },
    pocketS: {
      pocket: new Pocket(
        new Vector3(0, -TableGeometry.PY - 0.7, 0),
        TableGeometry.middleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.middleKnuckleInset,
          -TableGeometry.Y - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          -TableGeometry.middleKnuckleInset,
          -TableGeometry.Y - TableGeometry.middleKnuckleRadius,
          0
        ),
        TableGeometry.middleKnuckleRadius
      ),
    },
    pocketNE: {
      pocket: new Pocket(
        new Vector3(TableGeometry.PX, TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          TableGeometry.X - TableGeometry.knuckleInset,
          TableGeometry.Y + TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          TableGeometry.X + TableGeometry.knuckleRadius,
          TableGeometry.Y - TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketSE: {
      pocket: new Pocket(
        new Vector3(TableGeometry.PX, -TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleNE: new Knuckle(
        new Vector3(
          TableGeometry.X + TableGeometry.knuckleRadius,
          -TableGeometry.Y + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleSW: new Knuckle(
        new Vector3(
          TableGeometry.X - TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
    pocketSW: {
      pocket: new Pocket(
        new Vector3(-TableGeometry.PX, -TableGeometry.PY, 0),
        TableGeometry.cornerRadius
      ),
      knuckleSE: new Knuckle(
        new Vector3(
          -TableGeometry.X + TableGeometry.knuckleInset,
          -TableGeometry.Y - TableGeometry.knuckleRadius,
          0
        ),
        TableGeometry.knuckleRadius
      ),
      knuckleNW: new Knuckle(
        new Vector3(
          -TableGeometry.X - TableGeometry.knuckleRadius,
          -TableGeometry.Y + TableGeometry.knuckleInset,
          0
        ),
        TableGeometry.knuckleRadius
      ),
    },
  }

  static readonly knuckles = [
    TableGeometry.pockets.pocketNW.knuckleNE,
    TableGeometry.pockets.pocketNW.knuckleSW,
    TableGeometry.pockets.pocketN.knuckleNW,
    TableGeometry.pockets.pocketN.knuckleNE,
    TableGeometry.pockets.pocketS.knuckleSW,
    TableGeometry.pockets.pocketS.knuckleSE,
    TableGeometry.pockets.pocketNE.knuckleNW,
    TableGeometry.pockets.pocketNE.knuckleSE,
    TableGeometry.pockets.pocketSE.knuckleNE,
    TableGeometry.pockets.pocketSE.knuckleSW,
    TableGeometry.pockets.pocketSW.knuckleSE,
    TableGeometry.pockets.pocketSW.knuckleNW,
  ]

  static readonly pocketCenters = [
    TableGeometry.pockets.pocketNW.pocket,
    TableGeometry.pockets.pocketSW.pocket,
    TableGeometry.pockets.pocketN.pocket,
    TableGeometry.pockets.pocketS.pocket,
    TableGeometry.pockets.pocketNE.pocket,
    TableGeometry.pockets.pocketSE.pocket,
  ]

  /* istanbul ignore next */
  static addToScene(scene) {
    TableGeometry.knuckles.forEach((k) =>
      TableGeometry.knuckleCylinder(k, scene)
    )
    TableGeometry.pocketCenters.forEach((p) =>
      TableGeometry.knuckleCylinder(p, scene)
    )
    /*
    const p = TableGeometry.pockets.pocketNW.pocket
    const k = TableGeometry.pockets.pocketNW.knuckleNE
    console.log("knuckle-pocket gap = " + (p.pos.distanceTo(k.pos) - p.radius - k.radius))
    */
  }

  /* istanbul ignore next */
  private static material = new MeshPhongMaterial({
    color: 0x445599,
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.4,
  })

  /* istanbul ignore next */
  private static knuckleCylinder(knuckle, scene) {
    const k = TableGeometry.cylinder(knuckle.pos, knuckle.radius, 0.75, scene)
    k.position.setZ(-0.25 / 2)
  }

  /* istanbul ignore next */
  private static cylinder(pos, radius, depth, scene) {
    const geometry = new CylinderGeometry(radius, radius, depth, 16)
    const mesh = new Mesh(geometry, TableGeometry.material)
    mesh.position.copy(pos)
    mesh.geometry.applyMatrix4(
      new Matrix4()
        .identity()
        .makeRotationAxis(new Vector3(1, 0, 0), Math.PI / 2)
    )
    scene.add(mesh)
    return mesh
  }

  /* istanbul ignore next */
  static addCushions(scene) {
    const th = 10
    TableGeometry.plane(
      new Vector3(0, 0, -0.5 - th / 2),
      2 * TableGeometry.X,
      2 * TableGeometry.Y,
      th,
      scene
    )

    const d = 1
    const h = 0.75
    const e = -0.25 / 2
    const lengthN = Math.abs(
      TableGeometry.pockets.pocketNW.knuckleNE.pos.x -
        TableGeometry.pockets.pocketN.knuckleNW.pos.x
    )
    const lengthE = Math.abs(
      TableGeometry.pockets.pocketNW.knuckleSW.pos.y -
        TableGeometry.pockets.pocketSW.knuckleNW.pos.y
    )

    TableGeometry.plane(
      new Vector3(TableGeometry.X + d / 2, 0, e),
      d,
      lengthE,
      h,
      scene
    )
    TableGeometry.plane(
      new Vector3(-TableGeometry.X - d / 2, 0, e),
      d,
      lengthE,
      h,
      scene
    )

    TableGeometry.plane(
      new Vector3(-TableGeometry.X / 2, TableGeometry.Y + d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
    TableGeometry.plane(
      new Vector3(-TableGeometry.X / 2, -TableGeometry.Y - d / 2, e),
      lengthN,
      d,
      h,
      scene
    )

    TableGeometry.plane(
      new Vector3(TableGeometry.X / 2, TableGeometry.Y + d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
    TableGeometry.plane(
      new Vector3(TableGeometry.X / 2, -TableGeometry.Y - d / 2, e),
      lengthN,
      d,
      h,
      scene
    )
  }

  /* istanbul ignore next */
  private static plane(pos, x, y, z, scene) {
    const geometry = new BoxGeometry(x, y, z)
    const mesh = new Mesh(geometry, TableGeometry.material)
    mesh.receiveShadow = true
    mesh.position.copy(pos)
    scene.add(mesh)
  }
}
