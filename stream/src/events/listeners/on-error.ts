import { writeToLog } from "../../helper/log.ts"
import { Detail } from "../details.ts"
import { EventDetail } from "../types.ts"

export class ErrorDetail extends Detail {
  origin: string
  message: string
  type: "input" | "output"
  url?: string

  constructor(
    { message, origin, type, url }: {
      origin: string
      message: string
      type: "input" | "output"
      url?: string
    },
  ) {
    super()
    this.message = message
    this.origin = origin
    this.type = type
    this.url = url
  }
}

export type ErrorEvent = EventDetail<ErrorDetail>

export async function onErrorHandler(event: CustomEvent<ErrorEvent>) {
  const errorDetail = event.detail.detail

  writeToLog({
    message: errorDetail.message,
    origin: errorDetail.origin,
    status: "fail",
    time: errorDetail.time!,
    type: errorDetail.type,
    url: errorDetail.url || "",
  })

  // TODO: Send error to WebSocket clients
  // broadcastError(errorDetail)
}
