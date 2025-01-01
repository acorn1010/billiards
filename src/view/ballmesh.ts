import {
  IcosahedronGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  CircleGeometry,
  MeshBasicMaterial,
  ArrowHelper,
  Color,
  BufferAttribute,
  Vector3,
} from "three";
import { Ball } from "../model/ball";
import { norm, UP_VECTOR, ZERO_VECTOR } from "./../utils/utils";
import { R } from "../model/physics/constants";
import { PoolBallState } from "../model/physics/PoolBallRigidBody";

export class BallMesh {
  mesh: Mesh;
  shadow: Mesh;
  spinAxisArrow: ArrowHelper;
  color: Color;

  constructor(color: number) {
    this.color = new Color(color);
    this.initialiseMesh(color);
  }

  updateAll(ball: Ball, t: number) {
    this.updatePosition(ball.pos);
    this.updateArrows(ball.pos, ball.rvel, ball.state);
    if (ball.rvel.lengthSq() !== 0) {
      this.updateRotation(ball.rvel, t);
    }
  }

  updatePosition(pos: Vector3) {
    this.mesh.position.copy(pos);
    this.shadow.position.copy(pos);
  }

  readonly m = new Matrix4();

  private updateRotation(rvel: Vector3, t: number) {
    const angle = rvel.length() * t;
    this.mesh.rotateOnWorldAxis(norm(rvel), angle);
  }

  private updateArrows(pos: Vector3, rvel: Vector3, state: PoolBallState) {
    this.spinAxisArrow.setLength(R + (R * rvel.length()) / 2, R, R);
    this.spinAxisArrow.position.copy(pos);
    this.spinAxisArrow.setDirection(norm(rvel));
    if (state == PoolBallState.Rolling) {
      this.spinAxisArrow.setColor(0xcc0000);
    } else {
      this.spinAxisArrow.setColor(0x00cc00);
    }
  }

  initialiseMesh(color: number) {
    const geometry = new IcosahedronGeometry(R, 1);
    const material = new MeshPhongMaterial({
      emissive: 0,
      flatShading: true,
      vertexColors: true,
      forceSinglePass: true,
      shininess: 25,
      specular: 0x555533,
    });
    this.addDots(geometry, color);
    this.mesh = new Mesh(geometry, material);
    this.mesh.name = "ball";
    this.updateRotation(new Vector3().random(), 100);

    const shadowGeometry = new CircleGeometry(R * 0.9, 9);
    shadowGeometry.applyMatrix4(
      new Matrix4().identity().makeTranslation(0, 0, -R * 0.99),
    );
    const shadowMaterial = new MeshBasicMaterial({ color: 0x111122 });
    this.shadow = new Mesh(shadowGeometry, shadowMaterial);
    this.spinAxisArrow = new ArrowHelper(
      UP_VECTOR,
      ZERO_VECTOR,
      2,
      0x000000,
      0.01,
      0.01,
    );
    this.spinAxisArrow.visible = false;
  }

  addDots(geometry, baseColor: number) {
    const count = geometry.attributes.position.count;
    const color = new Color(baseColor);
    const red = new Color(0xaa2222);

    geometry.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(count * 3), 3),
    );

    const vertices = geometry.attributes.color;
    for (let i = 0; i < count / 3; i++) {
      this.colorVerticesForFace(
        i,
        vertices,
        this.scaleNoise(color.r),
        this.scaleNoise(color.g),
        this.scaleNoise(color.b),
      );
    }

    const dots = [0, 96, 111, 156, 186, 195];
    dots.forEach((i) => {
      this.colorVerticesForFace(i / 3, vertices, red.r, red.g, red.b);
    });
  }

  addToScene(scene) {
    scene.add(this.mesh);
    scene.add(this.shadow);
    scene.add(this.spinAxisArrow);
  }

  private colorVerticesForFace(
    face: number,
    vertices,
    r: number,
    g: number,
    b: number,
  ) {
    vertices.setXYZ(face * 3, r, g, b);
    vertices.setXYZ(face * 3 + 1, r, g, b);
    vertices.setXYZ(face * 3 + 2, r, g, b);
  }

  private scaleNoise(v: number) {
    return (1.0 - Math.random() * 0.25) * v;
  }
}
