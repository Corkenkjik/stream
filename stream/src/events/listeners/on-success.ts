import { writeToLog } from "../../helper/log.ts"
import { Detail } from "../details.ts"
import { EventDetail } from "../types.ts"

export class SuccessDetail extends Detail {
  origin: string
  message: string
  type: "input" | "output"
  url?: string

  constructor(
    origin: string,
    message: string,
    type: "input" | "output",
    url?: string,
  ) {
    super()
    this.message = message
    this.origin = origin
    this.type = type
    this.url = url
  }
}
export type SuccessEvent = EventDetail<SuccessDetail>

export async function onSuccessHandler(event: CustomEvent<SuccessEvent>) {
  const successDetail = event.detail.detail

  writeToLog({
    message: successDetail.message,
    origin: successDetail.origin,
    status: "success",
    time: successDetail.time!,
    type: successDetail.type,
    url: successDetail.url || "",
  })
}
