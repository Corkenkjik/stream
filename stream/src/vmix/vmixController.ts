import { XMLParser } from "@fast-xml-parser"
import { VMIX_SERVER } from "../helper/constants.ts"
import { VmixBanpickPlugin } from "./plugins/banpick.ts"
import { VmixIngamePlugin } from "./plugins/ingame.ts"
import { VmixPostgamePlugin } from "./plugins/postgame.ts"
import { eventBus } from "../events/event-bus.ts"
import { ErrorDetail } from "../events/listeners/on-error.ts"
// import { SuccessDetail } from "../events/listeners/on-success.ts"
// import { VmixEmblemPlugin } from "./plugins/emblem.ts"
import { rateLimiter } from "../../rate-limiter.ts"
import { VmixMvpPlugin } from "./plugins/mvp.ts"
import { VmixWaitingPlugin } from "./plugins/waiting.ts"

/**
 * MUST call init method after assigned
 */
export class VmixController {
  banpickPlugin: VmixBanpickPlugin | undefined
  ingamePlugin: VmixIngamePlugin | undefined
  postgamePlugin: VmixPostgamePlugin | undefined
  // emblemPlugin: VmixEmblemPlugin | undefined
  mvpPlugin: VmixMvpPlugin | undefined
  waitingPlugin: VmixWaitingPlugin | undefined

  timeBlockId: string | undefined

  public async fetchXml() {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)
    try {
      const xmlSrc = await fetch(VMIX_SERVER, {
        method: "GET",
        headers: {
          "Accept": "application/xml",
        },
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const xmlString = await xmlSrc.text()
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      })
      const parsedXML = parser.parse(xmlString)
      const inputs = parsedXML.vmix.inputs as Inputs
      const result = {} as {
        ingame: string
        banpick: string
        postgame: string
        mvp: string
        waiting: string
        realtime: string
      }
      inputs.input.forEach((element) => {
        if (element.title === "banpick") {
          result["banpick"] = element.key
        } else if (element.title === "ingame") {
          result["ingame"] = element.key
        } else if (element.title === "postdata") {
          result["postgame"] = element.key
        } else if (element.title === "mvp") {
          result["mvp"] = element.key
        } else if (element.title === "waiting") {
          result["waiting"] = element.key
        } else if (element.title === "realtime") {
          result["realtime"] = element.key
        }
      })
      return result
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        eventBus.emit<ErrorDetail>("on-error", {
          message: "Cannot connect to VMIX_SERVER, connection timeout",
          origin: "VmixController.fetchXml",
          time: new Date(),
          type: "input",
          url: VMIX_SERVER,
        })
      }
      throw new Error()
    }
  }

  public async batchSend(urls: string[], _origin: string, _errorMsg: string) {
    rateLimiter.execute(urls)
  }

  public async init() {
    const { banpick, ingame, postgame, mvp, waiting, realtime } = await this
      .fetchXml()

    this.banpickPlugin = new VmixBanpickPlugin(banpick, this)
    this.ingamePlugin = new VmixIngamePlugin(ingame, this)
    this.postgamePlugin = new VmixPostgamePlugin(postgame, this)
    this.mvpPlugin = new VmixMvpPlugin(mvp, this)
    this.waitingPlugin = new VmixWaitingPlugin(waiting, this)
    this.timeBlockId = realtime
  }

  public async startClock() {
    console.log('start clock')
    if (this.timeBlockId) {
      await fetch(
        `${VMIX_SERVER}/?Function=StartCountdown&Input=${this.timeBlockId!}`,
      )
    } else {
      throw new Error("Cannot start clock, time block id is undefined")
    }
  }
  public async endClock() {
    if (this.timeBlockId) {
      await fetch(
        `${VMIX_SERVER}/?Function=PauseCountdown&Input=${this.timeBlockId!}`,
      )
    } else {
      throw new Error("Cannot pause clock, time block id is undefined")
    }
  }
}

export interface Inputs {
  input: InputItem[]
}

interface InputItem {
  key: string
  title: string
  text?: TextItem[]
  image?: ImageItem | ImageItem[]
  [key: string]: any
}

interface TextItem {
  index: string
  name: string
  [key: string]: any
}

interface ImageItem {
  index: string
  name: string
}

// Singleton instance
const vmixController = new VmixController()

export { vmixController }
