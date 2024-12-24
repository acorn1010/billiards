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
  eventQueue: GameEvent[] = [];
  keyboard: Keyboard;
  sound: Sound;
  recorder: Recorder;
  id: string = "";
  isSinglePlayer: boolean = true;
  rules: Rules;
  menu: Menu;
  hud: Hud;

  last = performance.now();
  /**
   * Time in milliseconds for a physics step. This is a whole number to prevent rounding errors.
   * Any step duration over about 10ms will cause the physics to become very unstable.
   */
  private readonly STEP_DURATION_MS = 2;

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

  sendEvent(event: GameEvent) {
    this.throttle.send(event);
  }

  /**
   * Advances the physics state by `elapsedMs` milliseconds.
   * @VisibleForTesting
   */
  advance(elapsedMs: number) {
    const steps = Math.floor(elapsedMs / this.STEP_DURATION_MS);
    const computedElapsed = (steps * this.STEP_DURATION_MS) / 1_000;
    const stateBefore = this.table.allStationary();
    // table.advance is the slowest part of the physics simulation loop by a lot.
    for (let i = 0; i < steps; i++) {
      this.table.advance(this.STEP_DURATION_MS);
    }
    this.table.updateBallMesh(computedElapsed);
    this.view.update(computedElapsed, this.table.cue.aim);
    this.table.cue.update(computedElapsed);
    if (!stateBefore && this.table.allStationary()) {
      this.eventQueue.push(new StationaryEvent());
    }
    this.sound.processOutcomes(this.table.outcome);
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
    this.advance(timestamp - this.last);
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

  updateController(controller) {
    if (controller !== this.controller) {
      console.log("Transition to " + controllerName(controller));
      this.controller = controller;
      this.controller.onFirst();
    }
  }
}
