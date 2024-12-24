import { Container } from "../container/container";
import { BreakEvent } from "../events/breakevent";
import { ChatEvent } from "../events/chatevent";
import { StationaryEvent } from "../events/stationaryevent";
import { share, shorten } from "../utils/shorten";

export class Menu {
  container: Container;
  redo: HTMLButtonElement;
  share: HTMLButtonElement;
  replay: HTMLButtonElement;
  camera: HTMLButtonElement;

  constructor(container) {
    this.container = container;

    this.replay = Menu.getElement("replay");
    this.redo = Menu.getElement("redo");
    this.share = Menu.getElement("share");
    this.camera = Menu.getElement("camera");
    if (this.camera) {
      this.setMenu(true);
      this.camera.onclick = (_) => {
        this.adjustCamera();
      };
    }
  }

  private setMenu(disabled: boolean) {
    this.replay.disabled = disabled;
    this.redo.disabled = disabled;
    this.share.disabled = disabled;
  }

  private adjustCamera() {
    this.container.lastEventTime = performance.now();
  }

  /** @VisibleForTesting */
  replayMode(url: string, breakEvent: BreakEvent) {
    if (!this.replay) {
      return;
    }

    this.setMenu(false);
    const queue = this.container.eventQueue;
    this.share.onclick = (_) => {
      shorten(url, (url) => {
        const response = share(url);
        queue.push(new ChatEvent(null, response));
      });
    };
    this.redo.onclick = (_) => {
      const redoEvent = new BreakEvent(breakEvent.init, breakEvent.shots);
      redoEvent.retry = true;
      this.interruptEventQueue(redoEvent);
    };
    this.replay.onclick = (_) => {
      this.interruptEventQueue(breakEvent);
    };
  }

  private interruptEventQueue(breakEvent: BreakEvent) {
    this.container.table.halt();
    const queue = this.container.eventQueue;
    queue.length = 0;
    queue.push(new StationaryEvent());
    queue.push(breakEvent);
  }

  private static getElement(id: string): HTMLButtonElement {
    return document.getElementById(id)! as HTMLButtonElement;
  }
}
