import { Detail } from "./details.ts"
import { ErrorDetail, onErrorHandler } from "./listeners/on-error.ts"
import { onSuccessHandler, SuccessDetail } from "./listeners/on-success.ts"
import { EventDetail, type EventType } from "./types.ts"

export class EventBus extends EventTarget {
  emit<T extends Detail>(event: EventType, detail: T) {
    this.dispatchEvent(
      new CustomEvent<EventDetail<T>>(event, {
        detail: { type: event, detail },
      }),
    )
  }

  on<T extends Detail>(
    event: EventType,
    callback: (event: CustomEvent<EventDetail<T>>) => void,
  ) {
    this.addEventListener(
      event,
      (e) => callback(e as CustomEvent<EventDetail<T>>),
    )
  }
}

const eventBus = new EventBus()

eventBus.on<SuccessDetail>("on-success", onSuccessHandler)
eventBus.on<ErrorDetail>("on-error", onErrorHandler)

export { eventBus }
