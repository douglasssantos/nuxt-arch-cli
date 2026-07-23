import { EventBus } from '../services/EventBus.js'
import { registerEvents } from '../EventRegistry.js'
import type { IEventBus } from '../contracts/IEventBus.js'

// defineNuxtPlugin is auto-imported by Nuxt
export default defineNuxtPlugin(() => {
  const eventBus: IEventBus = new EventBus()
  registerEvents(eventBus)

  return {
    provide: {
      eventBus,
    },
  }
})
