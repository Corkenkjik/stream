import { API_SERVER, VMIX_SERVER } from "../../helper/constants.ts"
import { VmixController } from "../vmixController.ts"

export abstract class VmixPlugin {
  protected readonly blockId: string
  protected controller: VmixController

  constructor(blockId: string, controller: VmixController) {
    this.blockId = blockId
    this.controller = controller
  }
  protected createTextUrl(
    { blockName, value }: {
      blockName: string
      value: string
    },
  ) {
    return `${VMIX_SERVER}/?Function=SetText&Input=${this.blockId}&SelectedName=${blockName}.Text&Value=${value}`
  }
  protected createImageUrl({ blockName, value, type }: {
    blockName: string
    value: string
    type: "champ-pick" | "champ-ban" | "champ-end" | "champ-waiting" | "item" | "spell" | "rune" | "player"
  }) {
    if(value === "0") {
      return `${VMIX_SERVER}/?Function=SetImage&Input=${this.blockId}&SelectedName=${blockName}.Source&Value=`
    }
    return `${VMIX_SERVER}/?Function=SetImage&Input=${this.blockId}&SelectedName=${blockName}.Source&Value=${API_SERVER}/${type}/${value}`
  }
}
