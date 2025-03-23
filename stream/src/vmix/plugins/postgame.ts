import { IScoreboard, PlayerData } from "../../types.ts"
import { VmixPlugin } from "./index.ts"

type PlayerStatIslandArg = Pick<
  PlayerData,
  | "pos"
  | "kill"
  | "death"
  | "assist"
  | "gold"
  | "name"
  | "pick"
  | "level"
  | "runeMap"
>

export class VmixPostgamePlugin extends VmixPlugin {
  public playerStatIsland(data: PlayerStatIslandArg[]) {
    const urls = data.sort((a, b) => a.pos - b.pos).map((player) => {
      return Object.keys(player).map((key) => {
        const side = player.pos < 6 ? "x" : "d"
        const pos = player.pos < 6 ? player.pos : (player.pos - 5)
        // deno-fmt-ignore
        if(key !== "pos"){
          if(key === "name") {
            return this.createTextUrl({
              value: player.name,
              blockName: `p${pos}${side}name`
            })
          }

          else if (key === "kill") {
            return this.createTextUrl({
              value: ""+player.kill,
              blockName: `p${pos}${side}kill`
            })
          }
          
          else if (key === "death") {
            return this.createTextUrl({
              value: ""+player.death,
              blockName: `p${pos}${side}death`
            })
          }
          else if (key === "assist") {
            return this.createTextUrl({
              value: ""+player.assist,
              blockName: `p${pos}${side}assist`
            })
          }
          else if (key === "level") {
            return this.createTextUrl({
              value: ""+player.level,
              blockName: `p${pos}${side}level`
            })
          }
          else if (key === "gold") {
            return this.createTextUrl({
              value: ""+player.gold,
              blockName: `p${pos}${side}gold`
            })
          }
          else if (key === "pick") {
            return this.createImageUrl({
              type: "champ-end",
              value: ""+player.pick,
              blockName: `p${pos}${side}hero`
            })
          }
          else if (key === "runeMap") {
            if(player.runeMap && "3" in player.runeMap) {
              const rune = player.runeMap["3"]
              return this.createImageUrl({
                type: "rune",
                value: ""+rune,
                blockName: `p${pos}${side}ngoc`
              })
            }
          }
        } else {
          return this.createImageUrl({
            type: "player",
            value: ""+player.pos,
            blockName: `p${pos}${side}`
          })
        }
      })
    }).flatMap((x) => x).filter((x) => x !== undefined)

    this.controller.batchSend(
      urls,
      "VmixPostgamePlugin.playerStatIsland",
      "Error while update postgame player stats",
    )
  }

  public playerItemIsland(data: { pos: number; items: number[] }[]) {
    const urls = data.map((player) => {
      const side = player.pos < 6 ? "x" : "d"
      const pos = player.pos < 6 ? player.pos : (player.pos - 5)
      return player.items.map((item, itemIndex) => (this.createImageUrl({
        type: "item",
        blockName: `p${pos}${side}item${itemIndex + 1}`,
        value: "" + item,
      })))
    }).flatMap((x) => x)

    this.controller.batchSend(
      urls,
      "VmixPostgamePlugin.playerItemIsland",
      "Error while update postgame player items",
    )
  }

  public teamIsland(data: { blue: IScoreboard; red: IScoreboard }) {
    const blueUrls = Object.keys(data.blue).map((key) => {
      if (key === "score") {
        return this.createTextUrl({
          value: "" + data.blue.score,
          blockName: `tisoxanh`,
        })
      } else if (key === "gold") {
        return this.createTextUrl({
          value: "" + data.blue.gold,
          blockName: `goldxanh`,
        })
      } else if (key === "tortoise") {
        return this.createTextUrl({
          value: "" + data.blue.tortoise,
          blockName: `ruaxanh`,
        })
      } else if (key === "lord") {
        return this.createTextUrl({
          value: "" + data.blue.lord,
          blockName: `lordxanh`,
        })
      } else if (key === "tower") {
        return this.createTextUrl({
          value: "" + data.blue.tower,
          blockName: `truxanh`,
        })
      } else if (key === "blueBuff") {
        return this.createTextUrl({
          value: "" + data.blue.blueBuff,
          blockName: `bluebuffxanh`,
        })
      } else if (key === "redBuff") {
        return this.createTextUrl({
          value: "" + data.blue.redBuff,
          blockName: `redbuffxanh`,
        })
      }
    }).filter((x) => x !== undefined)

    const redUrls = Object.keys(data.red).map((key) => {
      if (key === "score") {
        return this.createTextUrl({
          value: "" + data.red.score,
          blockName: `tisodo`,
        })
      } else if (key === "gold") {
        return this.createTextUrl({
          value: "" + data.red.gold,
          blockName: `golddo`,
        })
      } else if (key === "tortoise") {
        return this.createTextUrl({
          value: "" + data.red.tortoise,
          blockName: `ruado`,
        })
      } else if (key === "lord") {
        return this.createTextUrl({
          value: "" + data.red.lord,
          blockName: `lorddo`,
        })
      } else if (key === "tower") {
        return this.createTextUrl({
          value: "" + data.red.tower,
          blockName: `trudo`,
        })
      } else if (key === "blueBuff") {
        return this.createTextUrl({
          value: "" + data.red.blueBuff,
          blockName: `bluebuffdo`,
        })
      } else if (key === "redBuff") {
        return this.createTextUrl({
          value: "" + data.red.redBuff,
          blockName: `redbuffdo`,
        })
      }
    }).filter((x) => x !== undefined)

    this.controller.batchSend(
      [...blueUrls, ...redUrls],
      "VmixPostgamePlugin.teamIsland",
      "Error while update postgame team stats",
    )
  }
}
