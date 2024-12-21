import "mocha";
import { expect } from "chai";
import { Vector3 } from "three";
import {
  isGripCushion,
  bounceHan,
  cueToSpin,
} from "../../src/model/physics/physics";
import { R } from "../../src/model/physics/constants";

describe("Physics", () => {
  it("isCushionGrip slow direct into cushion should grip", (done) => {
    const v = new Vector3(0.1, 0, 0);
    const w = new Vector3(0, 0, 0.1);
    expect(isGripCushion(v, w)).true;
    done();
  });

  it("isCushionGrip fast glancing angle into cushion should not grip", (done) => {
    const v = new Vector3(0.1, 20, 0);
    const w = new Vector3(0, 0, 0.1);
    expect(isGripCushion(v, w)).false;
    done();
  });

  it("bounceHan with right side makes ball move right on bounce and reduces spin", (done) => {
    const v = new Vector3(1.0, 0, 0);
    const w = new Vector3(0, 0, -5);
    const delta = bounceHan(v, w);
    expect(delta.v.y).to.be.greaterThan(0);
    expect(delta.w.z).to.be.greaterThan(0).and.lessThan(5);
    done();
  });

  it("cueToSpin with no offset has no angular velocity", (done) => {
    const v = new Vector3(10, 0, 0);
    const offset = new Vector3(0, 0, 0);
    const w = cueToSpin(offset, v);
    expect(w.length()).to.be.equals(0);
    done();
  });

  it("2R/5 above center gets natural roll", (done) => {
    const v = new Vector3(10, 0, 0);
    const offset = new Vector3(0, 2 / 5, 0);
    const w = cueToSpin(offset, v);
    expect(w.length()).to.be.approximately(v.length() / R, 0.01);
    done();
  });
});
