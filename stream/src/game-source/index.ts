import { eventBus } from "../events/event-bus.ts"
import { ErrorDetail } from "../events/listeners/on-error.ts"
import { SuccessDetail } from "../events/listeners/on-success.ts"
import { MLBB_SERVER } from "../helper/constants.ts"
import { env } from "../helper/env.ts"
import { BattleResponse, PostBattleResponse } from "./types.ts"

export class GameSource {
  public matchId: string

  constructor(matchId: string) {
    this.matchId = matchId
  }

  public async fetchData() {
    // deno-fmt-ignore
    const url = `${MLBB_SERVER}battledata?authkey=${env.api_key}&battleid=${this.matchId}&dataid=0`
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
      })
      if (!response.ok) {
        throw new Error("Cannot connect to mlbb server")
      }
      const data = await response.json() as BattleResponse
      if (data.code !== 0) {
        throw new Error("Fetch failed: " + data.message)
      }
      eventBus.emit<SuccessDetail>("on-success", {
        origin: "GameSource.fetchData",
        type: "input",
        url,
        message: "",
        time: new Date(),
      })
      return data
    } catch (error) {
      if (error instanceof Error) {
        eventBus.emit<ErrorDetail>("on-error", {
          origin: "GameSource.fetchData",
          type: "input",
          url,
          message: error.message,
          time: new Date(),
        })
      }
      throw new Error()
    }
  }

  public async fetchPostGameData() {
    // deno-fmt-ignore
    const url = `${MLBB_SERVER}postdata?authkey=${env.api_key}&battleid=${this.matchId}&dataid=0`
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" },
      })
      if (!response.ok) {
        throw new Error("Cannot connect to mlbb server")
      }
      const data = await response.json() as PostBattleResponse
      if (data.code !== 0) {
        throw new Error("Fetch failed: " + data.message)
      }
      eventBus.emit<SuccessDetail>("on-success", {
        origin: "GameSource.fetchPostGameData",
        type: "input",
        url,
        message: "",
        time: new Date(),
      })
      return data
    } catch (error) {
      if (error instanceof Error) {
        eventBus.emit<ErrorDetail>("on-error", {
          origin: "GameSource.fetchPostGameData",
          type: "input",
          url,
          message: error.message,
          time: new Date(),
        })
      }
      throw new Error()
    }
  }
}
