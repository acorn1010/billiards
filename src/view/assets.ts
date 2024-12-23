import { Mesh } from "three";
import { RuleFactory } from "../controller/rules/rulefactory";
import { Rules } from "../controller/rules/rules";
import { Sound } from "./sound";
import { TableMesh } from "./tablemesh";
import { CueMesh } from "./cuemesh";
import { TableGeometry } from "./tablegeometry";
import { R } from "../model/physics/constants";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Assets {
  rules: Rules;
  background: Mesh;
  table: Mesh;
  cue: Mesh;

  sound: Sound;

  constructor(ruletype) {
    this.rules = RuleFactory.create(ruletype, null);
    this.rules.tableGeometry();
  }

  /** Returns a promise that resolves when all assets are loaded. */
  async loadFromWeb(): Promise<void> {
    this.sound = new Sound(true);
    await Promise.all([
      importGltf("models/background.gltf").then(
        (m) => (this.background = m.scene as any),
      ),
      importGltf(this.rules.asset()).then((m) => {
        this.table = m.scene as any;
        TableMesh.mesh = m.scene.children[0];
      }),
      importGltf("models/cue.gltf").then((m) => {
        this.cue = m as any;
        CueMesh.mesh = m.scene.children[0] as any;
      }),
    ]);
  }

  creatLocal() {
    this.sound = new Sound(false);
    TableMesh.mesh = new TableMesh().generateTable(TableGeometry.hasPockets);
    this.table = TableMesh.mesh;
  }

  static localAssets(ruletype = "") {
    const assets = new Assets(ruletype);
    assets.creatLocal();
    return assets;
  }
}

async function importGltf(path: string): Promise<GLTF> {
  const loader = new GLTFLoader();
  return new Promise<GLTF>((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        gltf.scene.scale.set(R / 0.5, R / 0.5, R / 0.5);
        gltf.scene.matrixAutoUpdate = false;
        gltf.scene.updateMatrix();
        gltf.scene.updateMatrixWorld();
        gltf.scene.name = path;
        resolve(gltf);
      },
      (xhr) => console.log(path + " " + xhr.loaded + " bytes loaded"),
      () => reject("Error loading " + path),
    );
  });
}
