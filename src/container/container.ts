import { Input } from "../events/input";
import { GameEvent } from "../events/gameevent";
import { StationaryEvent } from "../events/stationaryevent";
import { Controller } from "../controller/controller";
import { Table } from "../model/table";
import { View } from "../view/view";
import { Init } from "../controller/init";
import { AimInputs } from "../view/aiminputs";
import { Keyboard } from "../events/keyboard";
import { Sound } from "../view/sound";
import { controllerName } from "../controller/util";
import { Recorder } from "../events/recorder";
import { Rules } from "../controller/rules/rules";
import { RuleFactory } from "../controller/rules/rulefactory";
import { Menu } from "../view/menu";
import { Hud } from "../view/hud";
import { Throttle } from "../events/throttle";

/**
 * Model, View, Controller container.
 */
export class Container {
  table: Table;
  view: View;
  controller: Controller;
  inputQueue: Input[] = [];
  private readonly eventQueue: GameEvent[] = [];
  keyboard: Keyboard;
  sound: Sound;
  recorder: Recorder;
  id: string = "";
  isSinglePlayer: boolean = true;
  rules: Rules;
  menu: Menu;
  hud: Hud;

  last = performance.now();
  private readonly step = 0.001953125; // 512 steps per second
  /** Elapsed in seconds since the last step. */
  private elapsedRemainderSeconds = 0;

  constructor(element, assets, ruletype?, keyboard?, id?) {
    this.rules = RuleFactory.create(ruletype, this);
    this.table = this.rules.table();
    this.view = new View(element, this.table, assets);
    this.table.cue.aimInputs = new AimInputs(this);
    this.keyboard = keyboard;
    this.sound = assets.sound;
    this.recorder = new Recorder(this);
    this.id = id;
    this.menu = new Menu(this);
    this.table.addToScene(this.view.scene);
    this.hud = new Hud();
    this.updateController(new Init(this));
  }

  private readonly throttle = new Throttle(0, (event: GameEvent) => {
    this.broadcast(event);
  });

  private broadcast(_: GameEvent) {
    // no-op
  }

  addEvent(event: GameEvent) {
    this.eventQueue.push(event);
  }

  getEventCount() {
    return this.eventQueue.length;
  }

  sendEvent(event: GameEvent) {
    this.throttle.send(event);
  }

  /** @VisibleForTesting */
  advance(elapsed: number) {
    const totalElapsed = elapsed + this.elapsedRemainderSeconds;
    const stepCount = Math.floor(totalElapsed / this.step);
    this.elapsedRemainderSeconds = totalElapsed - stepCount * this.step;
    if (!stepCount) {
      return;
    }
    const computedElapsed = stepCount * this.step;
    const wasStationary = this.table.allStationary();

    for (let i = 0; i < stepCount; i++) {
      this.table.advance(this.step);
    }
    this.table.updateBallMesh(computedElapsed);
    this.view.update(computedElapsed, this.table.cue.aim);

    if (!wasStationary && this.table.allStationary()) {
      this.addEvent(new StationaryEvent());
    }
    // this.sound.processOutcomes(this.table.outcomes);
  }

  processEvents() {
    if (this.keyboard) {
      const inputs = this.keyboard.getEvents();
      inputs.forEach((i) => this.inputQueue.push(i));
    }

    while (this.inputQueue.length > 0) {
      this.lastEventTime = this.last;
      const input = this.inputQueue.shift();
      input && this.updateController(this.controller.handleInput(input));
    }

    // only process events when stationary
    if (this.table.allStationary()) {
      const event = this.eventQueue.shift();
      if (event) {
        this.lastEventTime = performance.now();
        this.updateController(event.applyToController(this.controller));
      }
    }
  }

  lastEventTime = performance.now();

  animate(timestamp: number): void {
    this.advance((timestamp - this.last) / 1_000);
    this.last = timestamp;
    this.processEvents();
    // Render for 12 seconds after last event or if something changed.
    const needsRender =
      timestamp < this.lastEventTime + 12_000 ||
      !this.table.allStationary() ||
      this.view.sizeChanged();
    if (needsRender) {
      this.view.render();
    }
    // Request next frame
    requestAnimationFrame((t) => {
      this.animate(t);
    });
  }

  updateController(controller: Controller) {
    if (controller !== this.controller) {
      console.log("Transition to " + controllerName(controller));
      this.controller = controller;
      this.controller.onFirst();
    }
  }
}
