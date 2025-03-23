import { IScoreboard } from "../../types.ts"
import { VmixPlugin } from "./index.ts"

export class VmixIngamePlugin extends VmixPlugin {
  private ingameBlockPrefixes = {
    score: "tiso",
    gold: "vang",
    tortoise: "rua",
    lord: "lord",
    tower: "tru",
    blueBuff: "blueBuff",
    redBuff: "redBuff",
  } as const

  public teamNameIsland(blueTeamName: string, redTeamName: string) {
    const blueUrl = this.createTextUrl({
      blockName: "teamxanh",
      value: blueTeamName,
    })
    const redUrl = this.createTextUrl({
      blockName: "teamdo",
      value: redTeamName,
    })
    this.controller.batchSend(
      [blueUrl, redUrl],
      "VmixIngamePlugin.teamNameIsland",
      "Error while update ingame team name",
    )
  }

  public scoreboardIsland(
    data: { blue: Partial<IScoreboard>; red: Partial<IScoreboard> },
  ) {
    const fn = (data: Partial<IScoreboard>, side: Side) => {
      return Object.entries(data).map(
        ([key, value]) => {
          const blockName = `${
            this.ingameBlockPrefixes[key as keyof IScoreboard]
          }${side === "blue" ? "xanh" : "do"}`
          return this.createTextUrl({
            blockName,
            value: "" + value,
          })
        },
      ).filter((x) => x !== undefined)
    }

    const urls = [...fn(data.blue, "blue"), ...fn(data.red, "red")]
    this.controller.batchSend(
      urls,
      "VmixIngamePlugin.scoreboardIsland",
      "Error while updating scoreboard",
    )
  }
}
