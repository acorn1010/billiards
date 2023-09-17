import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { GameEvent } from "../../events/gameevent"

/**
 * Handle websocket connection to server
 */
export class SocketConnection {
  ws: WebSocket
  id: string
  eventHandler
  retryCount = 0
  retryDelay = 1000
  lastSentIdentifier = ""
  lastRecvIdentifier = ""
  readonly url
  constructor(url: string, id: string) {
    this.url = url
    this.id = id
    this.connect()
  }

  connect() {
    const encoded = encodeURI(
      `${this.url}&sent=${this.lastSentIdentifier}&recv=${this.lastRecvIdentifier}`
    )
    console.log("connecting to " + encoded)
    this.ws = new WebSocket(encoded)
    this.ws.onopen = () => {
      this.notifyClient(`✓`)
    }
    this.ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // binary frame
        const s = String.fromCharCode.apply(
          null,
          Array.from(new Uint16Array(event.data))
        )
        console.log(s)
      } else {
        // text frame
        const json = JSON.parse(event.data)
        if ("sequence" in json) {
          this.lastRecvIdentifier = json.sequence
        }
        this.eventHandler(event.data)
      }
    }
    this.ws.onclose = (_) => {
      console.log(`🖧🚪${this.ws.readyState}`)
      this.reconnect()
    }
    this.ws.onerror = (_) => {
      this.notifyClient(`🖧🌧${this.ws.readyState}`)
    }
  }

  reconnect() {
    if (this.ws.readyState === 1) {
      console.log("connected")
      return
    }
    this.notifyClient(`🛜${this.retryCount}`)
    if (this.retryCount++ < 5) {
      setTimeout(() => {
        this.connect()
      }, this.retryDelay)
      this.retryDelay += 5000
    }
  }

  notifyClient(message) {
    console.log(message)
    this.eventHandler(EventUtil.serialise(new ChatEvent("network", message)))
  }

  send(event: GameEvent) {
    this.lastSentIdentifier = `${this.id}-${performance.now()}`
    event.sequence = this.lastSentIdentifier
    this.ws.send(EventUtil.serialise(event))
  }

  close() {
    console.log("Force close socket")
    this.ws.close()
  }
}
