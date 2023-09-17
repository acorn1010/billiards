import { BeginEvent } from "../../events/beginevent"
import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { RejoinEvent } from "../../events/rejoinevent"
import { Tables } from "./tables"
import { Client } from "./tableinfo"
import { GameEvent } from "../../events/gameevent"
import { ServerLog } from "./serverlog"
import { EventType } from "../../events/eventtype"

export class Lobby {
  readonly tables = new Tables()

  createClient(ws, tableId, clientId, name): Client | undefined {
    if (!tableId || !clientId) {
      const message =
        "Invalid: Connection request must contain tableId and clientId"
      ServerLog.log(message)
      ws.send(message)
      return undefined
    }
    return { ws: ws, name: name, clientId: clientId }
  }

  joinTable(client, tableId, clientLastSent = "", clientLastRecv = "") {
    const tableInfo = this.tables.getTable(tableId)

    if (
      tableInfo.isActive(client) &&
      clientLastSent === "" &&
      clientLastRecv === ""
    ) {
      this.sendInfo(client, tableId, "Already joined in another window")
      return false
    }

    if (tableInfo.isRejoin(client)) {
      return this.rejoin(client, tableInfo, clientLastSent, clientLastRecv)
    }

    if (tableInfo.isFull()) {
      this.sendInfo(client, tableId, "Table already full")
      return false
    }

    tableInfo.join(client)

    if (tableInfo.clients.length == 1) {
      this.sendInfo(client, tableId, "Waiting for opponent...")
      return true
    }

    // both players arrived
    this.notifyJoined(client, tableInfo)
    this.send(client, tableId, new BeginEvent())
    return true
  }

  lastSequenceId(list: GameEvent[]) {
    if (list.length === 0) {
      return ""
    }
    return list[list.length - 1].sequence
  }

  rejoin(client, tableInfo, clientLastSent, clientLastRecv) {
    const history = tableInfo.eventHistory.get(client.clientId)
    const sent = this.lastSequenceId(history.sentTo)
    const recv = this.lastSequenceId(history.recvFrom)
    const rejoin: RejoinEvent = new RejoinEvent(
      recv !== clientLastSent ? recv : "",
      sent !== clientLastRecv ? sent : ""
    )
    tableInfo.leave(client)
    tableInfo.rejoin(client)
    this.send(client, tableInfo.tableId, rejoin)
    if (sent) {
      let replay = history.sentTo.find((e) => e.sequence === sent)
      while (replay < history.sentTo.length) {
        // should mark these to not be included in next replay
        this.send(client, tableInfo.tableId, history.sentToClient[replay++])
      }
    }
    return true
  }

  notifyJoined(client, tableInfo) {
    const otherClient = tableInfo.otherClients(client)[0]
    const message = this.message(
      "lobby",
      `${client.name} and ${otherClient.name} have joined '${tableInfo.tableId}'`
    )
    this.send(client, tableInfo.tableId, message)
    this.send(otherClient, tableInfo.tableId, message)
  }

  handleTableMessage(client: Client, tableId, message) {
    const tableInfo = this.tables.getTable(tableId)
    const m = message.toString()
    const event = EventUtil.fromSerialised(m)
    tableInfo.recordRecvEvent(client, event)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, tableId, event)
    })
  }

  handleLeaveTable(client, tableId) {
    ServerLog.log(`${client.name} closed connection`)
    const tableInfo = this.tables.getTable(tableId)
    tableInfo.leave(client)
    const message = `${client.name} has left`
    tableInfo.otherClients(client).forEach((c) => {
      this.sendInfo(c, tableId, message)
    })
  }

  seq = 1000
  private message(playerId, text) {
    const event = new ChatEvent(playerId, text)
    event.sequence = `server-${this.seq++}`
    return event
  }

  sendInfo(client, tableId, text) {
    this.send(client, tableId, this.message("info", text))
  }

  send(client, tableId, event: GameEvent) {
    this.tables.getTable(tableId).recordSentEvent(client, event)
    client.ws?.send(EventUtil.serialise(event))
    if (event.type === EventType.AIM) {
      return
    }
    if (event.type === EventType.CHAT || event.type === EventType.REJOIN) {
      ServerLog.log(`sending to ${client.name} event ${JSON.stringify(event)}`)
      return
    }
    ServerLog.log(`sending to ${client.name} event ${event.type}`)
  }
}
