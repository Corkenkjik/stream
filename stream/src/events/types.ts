import { Detail } from "./details.ts"

export type EventType = "on-error" | "on-success"

export interface EventDetail<T extends Detail> {
  type: EventType
  detail: T
}
