import { PlayerData } from "../../types.ts"
import { VmixPlugin } from "./index.ts"

export class VmixWaitingPlugin extends VmixPlugin {
  public heroIsland(data: Pick<PlayerData, "pos" | "pick">[]) {
    const urls = data.map((player) => {
      const side = player.pos < 6 ? "x" : "d"
      const pos = player.pos < 6 ? player.pos : (player.pos - 5)
      return this.createImageUrl({
        type: "champ-waiting",
        value: "" + player.pick,
        blockName: `p${pos}${side}hero`,
      })
    })

    this.controller.batchSend(
      urls,
      "VmixWaitingPlugin.heroIsland",
      "Error while update waiting plugin",
    )
  }
}
