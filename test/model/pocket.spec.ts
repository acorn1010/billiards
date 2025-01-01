import "mocha";
import { expect } from "chai";
import { Ball } from "../../src/model/ball";
import { Pocket } from "../../src/model/physics/pocket";
import { Vector3 } from "three";
import { PocketGeometry } from "../../src/view/pocketgeometry";
import { R } from "../../src/model/physics/constants";

const t = 0.1;

const pocketGeometry = new PocketGeometry(R);
describe("Pocket", () => {
  it("willFall", (done) => {
    const edge =
      pocketGeometry.getPockets().pocketS.pocket.pos.y +
      pocketGeometry.middleRadius +
      0.01;
    const pos = new Vector3(0, edge, 0);
    const ball = new Ball(pos);
    ball.vel.y = -1;
    const p = Pocket.findPocket(pocketGeometry.getPocketCenters(), ball, t);
    expect(p).to.be.not.null;
    done();
  });
});
