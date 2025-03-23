import { PlayerData } from "../../types.ts"
import { VmixPlugin } from "./index.ts"

type mvpIslandArg = Pick<
  PlayerData,
  | "pos"
  | "kill"
  | "death"
  | "assist"
  | "gold"
  | "skillid"
  | "item_list"
  | "rune"
  | "runeMap"
  | "dmgDealt"
>

export class VmixMvpPlugin extends VmixPlugin {
  public textIsland(
    data: Pick<PlayerData, "kill" | "death" | "assist" | "gold" | "dmgDealt">,
  ) {
    const urls = Object.keys(data).map((key) => {
      if (key === "kill") {
        return this.createTextUrl({
          value: "" + data.kill,
          blockName: `kill`,
        })
      } else if (key === "death") {
        return this.createTextUrl({
          value: "" + data.death,
          blockName: `death`,
        })
      } else if (key === "assist") {
        return this.createTextUrl({
          value: "" + data.assist,
          blockName: `assist`,
        })
      } else if (key === "gold") {
        return this.createTextUrl({
          value: "" + data.gold,
          blockName: `gold`,
        })
      } else if (key === "dmgDealt") {
        return this.createTextUrl({
          value: "" + data.dmgDealt,
          blockName: `dmgDealt`,
        })
      }
    }).filter((x) => x !== undefined)

    this.controller.batchSend(
      urls,
      "VmixMvpPlugin.playerStatIsland",
      "Error while update mvp text stats",
    )
  }

  public imgIsland(
    data: Pick<PlayerData, "rune" | "skillid" | "runeMap" | "item_list">,
  ) {
    console.log("item now", data.item_list)

    const urls = Object.keys(data).map((key) => {
      if (key === "rune") {
        return this.createImageUrl({
          type: "rune",
          value: "" + data.rune,
          blockName: `emblem1`,
        })
      } else if (key === "skillid") {
        return this.createImageUrl({
          type: "spell",
          value: "" + data.skillid,
          blockName: `spell`,
        })
      } else if (data.runeMap && key === "runeMap") {
        const runes = Object.entries(data.runeMap).map(([_, rune], index) => {
          return this.createImageUrl({
            type: "rune",
            blockName: `emblem${index + 2}`,
            value: "" + rune,
          })
        })
        return runes
      } else if (key === "item_list") {
        const items = data.item_list.map((item, index) => {
          return this.createImageUrl({
            type: "item",
            blockName: `item${index + 1}`,
            value: "" + item,
          })
        })
        return items
      }
    }).flatMap((x) => x).filter((x) => x !== undefined)

    this.controller.batchSend(
      urls,
      "VmixMvpPlugin.imgIsland",
      "Error while update mvp images",
    )
  }
}
