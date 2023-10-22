import "mocha"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"
import { PocketGeometry } from "../../src/view/pocketgeometry"
import { R } from "../../src/model/physics/constants"
import { Vector3 } from "three"
import { State } from "../../src/model/ball"
import { Aim } from "../../src/controller/aim"
import { BeginEvent } from "../../src/events/beginevent"
import { PlaceBall } from "../../src/controller/placeball"
import { Input } from "../../src/events/input"
import { PlayShot } from "../../src/controller/playshot"
import { WatchEvent } from "../../src/events/watchevent"
import { RerackEvent } from "../../src/events/rerackevent"

initDom()

describe("FourteenOne", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "fourteenone"

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, false, rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  it("Fourteenone has 16 balls", (done) => {
    expect(container.table.balls).to.be.length(4)
    done()
  })

  function bringToAimMode() {
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    container.advance(1)
    container.processEvents()
  }

  const edge =
    PocketGeometry.pockets.pocketS.pocket.pos.y +
    PocketGeometry.middleRadius +
    0.01 * R

  function setupTableWithTwoBallsRemaining() {
    const balls = container.table.balls
    for (let i = 3; i < balls.length; i++) {
      balls[i].pos.copy(PocketGeometry.pockets.pocketS.pocket.pos)
      balls[i].state = State.InPocket
    }
    balls[0].pos.copy(new Vector3(0, edge + R * 2, 0))
    balls[1].pos.copy(new Vector3(0, edge, 0))
  }

  function playShotWaitForOutcome() {
    container.table.cue.aim.angle = -Math.PI / 4
    container.table.cue.aim.power = 0.1
    container.table.cue.aim.pos.copy(container.table.balls[0].pos)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    container.advance(1)
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
  }

  it("Pot penultimate ball, causing rerack", (done) => {
    bringToAimMode()
    expect(container.controller).to.be.an.instanceof(Aim)

    setupTableWithTwoBallsRemaining()
    expect(container.table.balls.filter((b) => b.onTable())).to.be.length(3)

    playShotWaitForOutcome()
    const watchEvent = broadcastEvents[3] as WatchEvent
    expect(watchEvent.json.rerack).to.be.true
    expect(container.recoder.shots[1].type).to.be.equal("RERACK")

    const rerack = container.recoder.shots[1] as RerackEvent
    const before = container.table.shortSerialise()
    rerack.applyToController(container.controller)
    const after = container.table.shortSerialise()
    expect(before).to.be.deep.equal(after)

    done()
  })
})
