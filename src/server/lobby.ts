import { BeginEvent } from "../events/beginevent"
import { ChatEvent } from "../events/chatevent"
import { EventUtil } from "../events/eventutil"
import { WebSocket } from "ws"

export type Client = { ws?: WebSocket; name: string }

export class Lobby {
  readonly tables: Map<string, Client[]> = new Map()

  randomTableId() {
    return Math.floor(Math.random() * 0xffffff).toString(16)
  }

  private message(playerId, text) {
    return new ChatEvent(playerId, text)
  }

  private getOrCreateTable(tableId): Client[] {
    const table = this.tables.get(tableId)
    if (table) {
      return table
    }
    this.tables.set(tableId, [])
    return this.tables.get(tableId)!
  }

  joinTable(client, tableId) {
    const table = this.getOrCreateTable(tableId)

    if (table.length >= 2) {
      return this.message(client.name, "Table already full")
    }

    table.push(client)

    if (table.length == 1) {
      return this.message(client.name, "Waiting for opponent...")
    }

    // both players arrived
    return new BeginEvent()
  }

  handleTableMessage(client, tableId, message) {
    const m = message.toString()
    const mtype = JSON.parse(m).type
    const info = `received: ${mtype} from ${client.name}`
    this.otherClientsInTable(client, tableId).forEach((c) => {
      c.ws?.send(m)
    })
    return info
  }

  handleLeaveTable(client, tableId) {
    const table = this.tables.get(tableId)
    if (table) {
      const index = table.indexOf(client)
      if (index > -1) {
        table.splice(index, 1)
      }
      const message = this.message(client.name, `${client.name} has left`)
      this.otherClientsInTable(client, tableId).forEach((c) => {
        c.ws?.send(EventUtil.serialise(message))
      })
    }
  }

  otherClientsInTable(client, tableId): Client[] {
    return this.tableClients(tableId).filter((c) => c !== client)
  }

  tableClients(tableId) {
    return this.tables.get(tableId) || []
  }
}