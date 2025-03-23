import { PlayerData } from "../../types.ts"
import { VmixPlugin } from "./index.ts"

type Status = { isReset: boolean }
type BlockNames = Record<string, Status>

const banpickBlockNames = [
  //name
  "playerdoname5",
  "playerdoname4",
  "playerdoname3",
  "playerdoname2",
  "playerdoname1",
  "playerxanhname5",
  "playerxanhname4",
  "playerxanhname3",
  "playerxanhname2",
  "playerxanhname1",

  // do
  "playerdoban5",
  "playerdoban4",
  "playerdoban3",
  "playerdoban2",
  "playerdoban1",
  "playerdopick5",
  "playerdopick4",
  "playerdopick3",
  "playerdopick2",
  "playerdopick1",

  // xanh
  "playerxanhban5",
  "playerxanhban4",
  "playerxanhban3",
  "playerxanhban2",
  "playerxanhban1",
  "playerxanhpick5",
  "playerxanhpick4",
  "playerxanhpick3",
  "playerxanhpick2",
  "playerxanhpick1",
]

export class VmixBanpickPlugin extends VmixPlugin {
  private blockNames = Object.fromEntries(
    banpickBlockNames.map((
      name,
    ) => [name, { isReset: false, isUpdate: false }]),
  ) as BlockNames

  public async playerNameIsland(data: Pick<PlayerData, "name" | "pos">[]) {
    const urls = data.map((player) => {
      const pos = player.pos < 6 ? player.pos : player.pos - 5
      const side = player.pos < 6 ? "xanh" : "do"
      const blockName = `player${side}name${pos}`
      if (blockName in this.blockNames) {
        const { isReset } = this.blockNames[blockName]
        if (!isReset) {
          this.blockNames[blockName].isReset = true
          return this.createTextUrl({
            value: player.name,
            blockName,
          })
        } else {
          delete this.blockNames[blockName]
          return this.createTextUrl({
            value: player.name,
            blockName,
          })
        }
      }
    }).filter((x) => x !== undefined)
    await this.controller.batchSend(
      urls,
      "VmixBanpickPlugin.playerNameIsland",
      "Error while update ban pick player name",
    )
    console.log("playernameI", urls)
  }

  public async banIsland(data: { pos: number; ban: number }[]) {
    const urls = data.map((x) => {
      const side = x.pos < 6 ? "xanh" : "do"
      const pos = x.pos < 6 ? x.pos : x.pos - 5
      const blockName = `player${side}ban${pos}`
      console.log("current block name", this.blockNames)
      console.log("name", blockName)
      if (blockName in this.blockNames) {
        const { isReset } = this.blockNames[blockName]
        console.log("isReset", isReset)
        if (!isReset) {
          this.blockNames[blockName].isReset = true
          return this.createImageUrl({
            blockName,
            type: "champ-ban",
            value: "" + x.ban,
          })
        } else {
          console.log(`player ${x.pos} ban is ${x.ban}`)
          if (x.ban > 0) {
            delete this.blockNames[blockName]
            return this.createImageUrl({
              blockName,
              type: "champ-ban",
              value: "" + x.ban,
            })
          }
        }
      }
    }).filter((x) => x !== undefined)

    await this.controller.batchSend(
      urls,
      "VmixBanpickPlugin.banIsland",
      "Error while update banning",
    )
    console.log("ban", urls)
  }

  public pickIsland(data: { pos: number; pick: number }[]) {
    const urls = data.map((x) => {
      const side = x.pos < 6 ? "xanh" : "do"
      const pos = x.pos < 6 ? x.pos : x.pos - 5
      const blockName = `player${side}pick${pos}`
      if (blockName in this.blockNames) {
        const { isReset } = this.blockNames[blockName]
        if (!isReset) {
          this.blockNames[blockName].isReset = true
          return this.createImageUrl({
            blockName,
            type: "champ-pick",
            value: "" + x.pick,
          })
        } else {
          if (x.pick > 0) {
            delete this.blockNames[blockName]
            return this.createImageUrl({
              blockName,
              type: "champ-pick",
              value: "" + x.pick,
            })
          }
        }
      }
    }).filter((x) => x !== undefined)
    this.controller.batchSend(
      urls,
      "VmixBanpickPlugin.pickIsland",
      "Error while update picking",
    )
    console.log("pick", urls)
  }
}
