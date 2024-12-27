import "mocha";
import { expect } from "chai";
import { AimInputs } from "../../src/view/aiminputs";
import { initDom, canvas3d } from "./dom";
import { Container } from "../../src/container/container";
import { fireEvent } from "@testing-library/dom";
import { Assets } from "../../src/view/assets";

initDom();

describe("AimInput", () => {
  let container: Container;
  let aiminputs: AimInputs;

  beforeEach(function (done) {
    container = new Container(canvas3d, Assets.localAssets());
    aiminputs = new AimInputs(container);
    done();
  });

  it("adjust power", (done) => {
    aiminputs.cuePowerElement.value = 1;
    fireEvent.change(aiminputs.cuePowerElement, { target: { value: 1 } });
    expect(container.table.cue.aim.power).to.be.greaterThan(0);
    done();
  });

  it("click hit button", (done) => {
    document.getElementById("cueHit")?.click();
    expect(aiminputs.container.inputQueue).to.be.not.empty;
    done();
  });
});
