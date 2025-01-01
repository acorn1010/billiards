import "mocha";
import { expect } from "chai";
import { Ball } from "../../src/model/ball";
import { Vector3 } from "three";
import { ZERO_VECTOR, passesThroughZero } from "../../src/utils/utils";
import { forceRoll, surfaceVelocity } from "../../src/model/physics/physics";
import { R } from "../../src/model/physics/constants";
import { PoolBallState } from "../../src/model/physics/PoolBallRigidBody";

const t = 0.1;

describe("Ball", () => {
  it("serialise/deserialise", (done) => {
    const pos = new Vector3(1, 2, 0);
    const ball = new Ball(pos);
    const data = ball.serialise();
    const ball2 = Ball.fromSerialised(data);
    expect(ball2.pos).to.deep.equal(pos);
    done();
  });

  it("initialises and is stationary", (done) => {
    const pos = new Vector3(1, 2, 0);
    const ball = new Ball(pos);
    expect(ball.pos).to.deep.equal(pos);
    expect(ball.vel).to.deep.equal(ZERO_VECTOR);
    expect(ball.rvel).to.deep.equal(ZERO_VECTOR);
    done();
  });

  it("stationary remains stationary after time step", (done) => {
    const pos = new Vector3(1, 2, 0);
    const ball = new Ball(pos);
    ball.update(1);
    expect(ball.pos).to.deep.equal(pos);
    expect(ball.vel).to.deep.equal(ZERO_VECTOR);
    expect(ball.rvel).to.deep.equal(ZERO_VECTOR);
    done();
  });

  it("friction slows ball", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 0.01;
    ball.state = PoolBallState.Sliding;
    ball.update(0.01);
    expect(ball.vel.x).to.be.below(0.01);
    done();
  });

  it("ball moving with no spin is not rolling", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 1;
    expect(ball.isRolling()).to.be.false;
    done();
  });

  it("ball with matched rotational vel is rolling", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 1;
    ball.rvel.y = ball.vel.x / R;
    expect(ball.isRolling()).to.be.true;
    ball.state = PoolBallState.Sliding;
    ball.update(t);
    ball.updateMesh(t);
    expect(ball.state).to.equal(PoolBallState.Rolling);
    done();
  });

  it("ball close to matched rotational vel is rolling", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 1;
    ball.rvel.y = ball.vel.x / R + 0.0001;
    ball.state = PoolBallState.Sliding;
    expect(ball.isRolling()).to.be.true;
    done();
  });

  it("topspin accelerates ball", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 0;
    ball.rvel.y = 100;
    ball.state = PoolBallState.Sliding;
    expect(ball.isRolling()).to.be.false;
    ball.update(t);
    expect(ball.vel.x).to.be.above(0);
    done();
  });

  it("topspin spins less over time", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 0;
    ball.rvel.y = 1;
    ball.state = PoolBallState.Sliding;
    expect(ball.isRolling()).to.be.false;
    ball.update(t);
    expect(ball.rvel.y).to.be.below(1);
    done();
  });

  it("rolling ball eventualy stops", (done) => {
    const ball = new Ball(new Vector3());
    ball.vel.x = 0.1 * R;
    ball.rvel.y = ball.vel.x * (1 / R);
    ball.state = PoolBallState.Rolling;
    const maxiter = 100;
    let i = 0;
    while (i++ < maxiter && ball.isRolling()) {
      ball.update(t);
      ball.updateMesh(t);
    }
    expect(i).to.be.below(maxiter);
    done();
  });

  it("spinning ball eventualy stops", (done) => {
    const ball = new Ball(new Vector3());
    ball.state = PoolBallState.Rolling;
    const initialz = 100 * R;
    ball.rvel.z = initialz;
    ball.update(t);
    expect(ball.rvel.z).to.be.lessThan(initialz);
    ball.state = PoolBallState.Sliding;
    ball.rvel.z = initialz;
    ball.update(t);
    ball.updateMesh(t);
    expect(ball.rvel.z).to.be.lessThan(initialz);
    done();
  });

  it("stun ball does not roll back at end", (done) => {
    const ball = new Ball(new Vector3());
    ball.rvel.y = 0.2;
    ball.state = PoolBallState.Sliding;
    const maxiter = 100;
    let i = 0;
    while (i++ < maxiter && ball.inMotion()) {
      ball.update(t / 10);
      expect(ball.vel.x).to.be.at.least(0);
    }
    expect(i).to.be.below(maxiter);
    done();
  });

  it("halts at close to zero", (done) => {
    expect(passesThroughZero(new Vector3(1, 1, 0), new Vector3(-0.5, -0.5, 0)))
      .to.be.false;
    expect(passesThroughZero(new Vector3(1, 1, 0), new Vector3(-2, -2, 0))).to
      .be.true;
    expect(passesThroughZero(new Vector3(1, 1, 0), new Vector3(-1, -1, 0))).to
      .be.true;
    done();
  });

  it("slightly rolling ball halts", (done) => {
    const b = Ball.fromSerialised({
      pos: { x: 0, y: 0, z: 0 },
      vel: { x: 0.0026704887947856175, y: -0.04722559231618879, z: 0 },
      rvel: { x: 0.00001806789773622572, y: -0.00008182140227559905, z: 0 },
      state: "Rolling",
    });
    forceRoll(b.vel, b.rvel);
    b.update(1);
    expect(b.inMotion()).to.be.false;
    done();
  });

  it("force roll leaves roll unaffected", (done) => {
    const b = Ball.fromSerialised({
      pos: { x: 0, y: 0, z: 0 },
      vel: { x: 1, y: 0, z: 0 },
      rvel: { x: 0, y: 1 / R, z: 0 },
      state: "Rolling",
    });
    forceRoll(b.vel, b.rvel);
    expect(surfaceVelocity(b.vel, b.rvel)).to.be.deep.equal(ZERO_VECTOR);
    expect(b.vel.x).to.be.equal(1);
    done();
  });
});
