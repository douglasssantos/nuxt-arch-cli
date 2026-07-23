import type { IEventBus } from '../contracts/IEventBus.js'

// useNuxtApp is auto-imported by Nuxt
export function useEventBus(): IEventBus {
  const { $eventBus } = useNuxtApp()
  return $eventBus as IEventBus
}
