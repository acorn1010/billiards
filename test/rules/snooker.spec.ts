import "mocha"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"

initDom()

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("Snooker", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "snooker"

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, false, rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  it("Fourteenone has 13 balls", (done) => {
    expect(container.table.balls).to.be.length(13)
    done()
  })
})
